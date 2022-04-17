import Video from "twilio-video";
import { allowedReactions } from "./reactions";
import { showElements, hideElements } from "./utils";

export class VideoChat extends EventTarget {
  constructor(token, roomName, localTracks) {
    super();
    this.videoTrack = localTracks.videoTrack;
    this.audioTrack = localTracks.audioTrack;
    this.dataTrack = localTracks.dataTrack;
    this.dataTrackReady = {};
    this.dataTrackReady.promise = new Promise((resolve, reject) => {
      this.dataTrackReady.resolve = resolve;
      this.dataTrackReady.reject = reject;
    });
    this.container = document.getElementById("participants");
    this.chatDiv = document.getElementById("video-chat");
    this.activityDiv = document.getElementById("activity");
    this.dominantSpeaker = null;
    this.whiteboard = false;
    this.participantItems = new Map();
    this.participantConnected = this.participantConnected.bind(this);
    this.participantDisconnected = this.participantDisconnected.bind(this);
    this.trackPublished = this.trackPublished.bind(this);
    this.trackUnpublished = this.trackUnpublished.bind(this);
    this.trackSubscribed = this.trackSubscribed.bind(this);
    this.trackUnsubscribed = this.trackUnsubscribed.bind(this);
    this.roomDisconnected = this.roomDisconnected.bind(this);
    this.dominantSpeakerChanged = this.dominantSpeakerChanged.bind(this);
    this.localParticipantTrackPublished = this.localParticipantTrackPublished.bind(
      this
    );
    this.localParticipantTrackPublicationFailed = this.localParticipantTrackPublicationFailed.bind(
      this
    );
    this.messageReceived = this.messageReceived.bind(this);
    this.tidyUp = this.tidyUp.bind(this);
    this.init(token, roomName);
  }

  async init(token, roomName) {
    try {
      this.room = await Video.connect(token, {
        name: roomName,
        tracks: [this.videoTrack, this.audioTrack, this.dataTrack],
        dominantSpeaker: true,
      });
      this.participantConnected(this.room.localParticipant);
      this.room.on("participantConnected", this.participantConnected);
      this.room.on("participantDisconnected", this.participantDisconnected);
      this.room.participants.forEach(this.participantConnected);
      this.room.on("disconnected", this.roomDisconnected);
      this.room.on("dominantSpeakerChanged", this.dominantSpeakerChanged);
      this.room.localParticipant.on(
        "trackPublished",
        this.localParticipantTrackPublished
      );
      this.room.localParticipant.on(
        "trackPublicationFailed",
        this.localParticipantTrackPublicationFailed
      );
      this.room.on("trackMessage", this.messageReceived);
      window.addEventListener("beforeunload", this.tidyUp);
      window.addEventListener("pagehide", this.tidyUp);
    } catch (error) {
      console.error(error);
    }
  }

  dominantSpeakerChanged(participant) {
    if (this.dominantSpeaker) {
      this.participantItems
        .get(this.dominantSpeaker.sid)
        .classList.remove("dominant");
    }
    let participantItem;
    if (participant) {
      participantItem = this.participantItems.get(participant.sid);
      this.dominantSpeaker = participant;
    } else {
      participantItem = this.participantItems.get(
        this.room.localParticipant.sid
      );
      this.dominantSpeaker = this.room.localParticipant;
    }
    participantItem.classList.add("dominant");
  }

  trackPublished(participant) {
    return (trackPub) => {
      if (trackPub.track) {
        this.trackSubscribed(participant)(trackPub.track);
      }
      trackPub.on("subscribed", this.trackSubscribed(participant));
      trackPub.on("unsubscribed", this.trackUnsubscribed(participant));
    };
  }

  trackSubscribed(participant) {
    return (track) => {
      const item = this.participantItems.get(participant.sid);
      const wrapper = item.querySelector(".video-wrapper");
      const info = item.querySelector(".info");
      if (track.kind === "video") {
        const videoElement = track.attach();
        if (track.name === "user-screen") {
          this.chatDiv.classList.add("screen-share");
          this.activityDiv.appendChild(videoElement);
          showElements(this.activityDiv);
          if (participant !== this.room.localParticipant) {
            this.dispatchEvent(new Event("screen-share-started"));
          }
        } else {
          wrapper.appendChild(videoElement);
        }
      } else if (track.kind === "audio") {
        const audioElement = track.attach();
        audioElement.muted = true;
        wrapper.appendChild(audioElement);
        const mutedHTML = document.createElement("p");
        mutedHTML.appendChild(document.createTextNode("🔇"));
        if (!track.isEnabled) {
          info.appendChild(mutedHTML);
        }
        track.on("enabled", () => {
          mutedHTML.remove();
        });
        track.on("disabled", () => {
          info.appendChild(mutedHTML);
        });
      } else if (track.kind === "data") {
        if (this.whiteboard) {
          this.sendMessage(
            JSON.stringify({
              action: "whiteboard",
              event: "started",
            })
          );
        }
      }
    };
  }

  trackUnsubscribed(participant) {
    return (track) => {
      if (track.kind !== "data") {
        const mediaElements = track.detach();
        mediaElements.forEach((mediaElement) => mediaElement.remove());
      }
      if (track.name === "user-screen") {
        hideElements(this.activityDiv);
        this.chatDiv.classList.remove("screen-share");
        if (participant !== this.room.localParticipant) {
          this.dispatchEvent(new Event("screen-share-stopped"));
        }
      }
      if (track.kind === "audio") {
        track.removeAllListeners("enabled");
        track.removeAllListeners("disabled");
      }
    };
  }

  trackUnpublished(trackPub) {
    if (trackPub.track) {
      this.trackUnsubscribed()(trackPub.track);
    }
  }

  participantConnected(participant) {
    const participantItem = document.createElement("li");
    participantItem.setAttribute("id", participant.sid);
    const wrapper = document.createElement("div");
    wrapper.classList.add("video-wrapper");
    const info = document.createElement("div");
    info.classList.add("info");
    wrapper.appendChild(info);
    const reaction = document.createElement("div");
    reaction.classList.add("reaction");
    wrapper.appendChild(reaction);
    participantItem.appendChild(wrapper);
    if (participant !== this.room.localParticipant) {
      const actions = document.createElement("div");
      actions.classList.add("actions");
      wrapper.appendChild(actions);
      const name = document.createElement("p");
      name.classList.add("name");
      name.appendChild(document.createTextNode(participant.identity));
      wrapper.appendChild(name);
    }
    this.container.appendChild(participantItem);
    this.setRowsAndColumns(this.room);
    this.participantItems.set(participant.sid, participantItem);
    participant.tracks.forEach(this.trackPublished(participant));
    participant.on("trackPublished", this.trackPublished(participant));
    participant.on("trackUnpublished", this.trackUnpublished);
  }

  participantDisconnected(participant) {
    const item = this.participantItems.get(participant.sid);
    item.remove();
    this.participantItems.delete(participant.sid);
    this.setRowsAndColumns(this.room);
  }

  roomDisconnected(room, error) {
    if (error) {
      console.error(error);
    }
    this.participantItems.forEach((item, sid) => {
      item.remove();
      this.participantItems.delete(sid);
    });
    this.room.removeAllListeners();
    this.room.localParticipant.off(
      "trackPublished",
      this.localParticipantTrackPublished
    );
    this.room.localParticipant.off(
      "trackPublicationFailed",
      this.localParticipantTrackPublicationFailed
    );
    this.audioTrack.removeAllListeners("enabled");
    this.audioTrack.removeAllListeners("disabled");
    this.room = null;
  }

  disconnect() {
    this.room.disconnect();
    window.removeEventListener("beforeunload", this.tidyUp);
    window.removeEventListener("pagehide", this.tidyUp);
  }

  tidyUp(event) {
    if (event.persisted) {
      return;
    }
    if (this.room) {
      this.disconnect();
    }
  }

  setRowsAndColumns(room) {
    const numberOfParticipants =
      Array.from(room.participants.keys()).length + 1;
    let rows, cols;
    if (numberOfParticipants === 1) {
      rows = 1;
      cols = 1;
    } else if (numberOfParticipants === 2) {
      rows = 1;
      cols = 2;
    } else if (numberOfParticipants < 5) {
      rows = 2;
      cols = 2;
    } else if (numberOfParticipants < 7) {
      rows = 2;
      cols = 3;
    } else {
      rows = 3;
      cols = 3;
    }
    this.container.style.setProperty("--grid-rows", rows);
    this.container.style.setProperty("--grid-columns", cols);
  }


  startScreenShare(screenTrack) {
    this.room.localParticipant.publishTrack(screenTrack);
  }

  stopScreenShare(screenTrack) {
    this.room.localParticipant.unpublishTrack(screenTrack);
    this.chatDiv.classList.remove("screen-share");
    hideElements(this.activityDiv);
  }  

  localParticipantTrackPublished(trackPub) {
    if (trackPub.track === this.dataTrack) {
      this.dataTrackReady.resolve();
    }
  }
  localParticipantTrackPublicationFailed(error, trackPub) {
    if (trackPub.track === this.dataTrack) {
      this.dataTrackReady.reject(error);
    }
  }

  async sendMessage(message) {
    await this.dataTrackReady.promise;
    this.dataTrack.send(message);
  }

  messageReceived(data, track, participant) {
    const message = JSON.parse(data);
    if (message.action === "reaction") {
      this.showReaction(message.reaction, participant);
    } else if (message.action === "chat-message") {
      this.receiveChatMessage(message);
    } else if (message.action === "whiteboard") {
      this.receiveWhiteboardMessage(message);
    }
  }

  showReaction(reaction, participant) {
    if (!allowedReactions.includes(reaction)) {
      return;
    }
    let participantItem;
    if (participant) {
      participantItem = this.participantItems.get(participant.sid);
    } else {
      participantItem = this.participantItems.get(
        this.room.localParticipant.sid
      );
    }
    const reactionDiv = participantItem.querySelector(".reaction");
    reactionDiv.innerHTML = "";
    reactionDiv.appendChild(document.createTextNode(reaction));
    if (this.reactionTimeout) {
      clearTimeout(this.reactionTimeout);
    }
    this.reactionTimeout = setTimeout(() => (reactionDiv.innerHTML = ""), 5000);
  }

  receiveChatMessage(message) {
    const messageEvent = new CustomEvent("chat-message", {
      detail: message,
    });
    this.dispatchEvent(messageEvent);
  }

  receiveWhiteboardMessage(message) {
    if (message.event === "started") {
      const whiteboardStartedEvent = new CustomEvent("whiteboard-started", {
        detail: message.existingLines,
      });
      this.dispatchEvent(whiteboardStartedEvent);
    } else if (message.event === "stopped") {
      const whiteboardStoppedEvent = new Event("whiteboard-stopped");
      this.dispatchEvent(whiteboardStoppedEvent);
    } else {
      const whiteboardDrawEvent = new CustomEvent("whiteboard-draw", {
        detail: message.event,
      });
      this.dispatchEvent(whiteboardDrawEvent);
    }
  }
}
