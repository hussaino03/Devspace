import Video, { LocalVideoTrack, LocalDataTrack } from "twilio-video";
import { VideoChat } from "./lib/video-chat";
import {
  hideElements,
  showElements,
  disableButton,
  enableButton,
} from "./lib/utils";
import LocalPreview from "./lib/localPreview";
import { Whiteboard } from "./lib/whiteboard";

let videoTrack,
  audioTrack,
  localPreview,
  screenTrack,
  dataTrack,
  reactionListener,
  videoChat,
  whiteboard;

const setupTrackListeners = (track, button, enableLabel, disableLabel) => {
  button.innerText = track.isEnabled ? disableLabel : enableLabel;
  track.on("enabled", () => {
    button.innerText = disableLabel;
  });
  track.on("disabled", () => {
    button.innerText = enableLabel;
  });
};

window.addEventListener("DOMContentLoaded", () => {
  const previewBtn = document.getElementById("media-preview");
  const startDiv = document.querySelector(".start");
  const videoChatDiv = document.getElementById("video-chat");
  const activityDiv = document.getElementById("activity");
  const joinForm = document.getElementById("join-room");
  const disconnectBtn = document.getElementById("disconnect");
  const screenShareBtn = document.getElementById("screen-share");
  const muteBtn = document.getElementById("mute-self");
  const disableVideoBtn = document.getElementById("disable-video");
  const reactionsList = document.getElementById("reactions");
  const whiteboardBtn = document.getElementById("whiteboard");
  const reactions = Array.from(reactionsList.querySelectorAll("button")).map(
    (btn) => btn.innerText
  );

  const detachTrack = (track) => {
    if (track.kind !== "data") {
      const mediaElements = track.detach();
      mediaElements.forEach((mediaElement) => mediaElement.remove());
      if (track.name === "user-screen") {
        hideElements(activityDiv);
        videoChatDiv.classList.remove("screen-share");
      }
    }
  };

  previewBtn.addEventListener("click", async () => {
    hideElements(startDiv);
    try {
      const tracks = await Video.createLocalTracks({
        video: {
          name: "user-camera",
          facingMode: "user",
        },
        audio: {
          name: "user-audio",
        },
      });
      startDiv.remove();
      showElements(joinForm);
      videoTrack = tracks.find((track) => track.kind === "video");
      audioTrack = tracks.find((track) => track.kind === "audio");
      dataTrack = new LocalDataTrack({ name: "user-data" });

      setupTrackListeners(audioTrack, muteBtn, "Unmute", "Mute");
      setupTrackListeners(
        videoTrack,
        disableVideoBtn,
        "Enable video",
        "Disable video"
      );

      localPreview = new LocalPreview(videoTrack, audioTrack);
      localPreview.addEventListener("new-video-track", (event) => {
        videoTrack = event.detail;
        setupTrackListeners(
          event.detail,
          disableVideoBtn,
          "Enable video",
          "Disable video"
        );
      });
      localPreview.addEventListener("new-audio-track", (event) => {
        audioTrack = event.detail;
        setupTrackListeners(event.detail, muteBtn, "Unmute", "Mute");
      });
    } catch (error) {
      showElements(startDiv);
      console.error(error);
    }
  });

  joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const inputs = joinForm.querySelectorAll("input");
    const data = {};
    inputs.forEach((input) => (data[input.getAttribute("name")] = input.value));
    const { token, identity, roomName } = await fetch(
      joinForm.getAttribute("action"),
      {
        method: joinForm.getAttribute("method"),
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    hideElements(joinForm);
    videoChat = new VideoChat(
      token,
      roomName,
      { videoTrack, audioTrack, dataTrack },
      reactions
    );
    if (!("getDisplayMedia" in navigator.mediaDevices)) {
      screenShareBtn.remove();
    }
    showElements(videoChatDiv);
    localPreview.hide();

    videoChat.addEventListener("data-track-published", (event) => {
      const localParticipant = event.detail.participant;
      showElements(reactionsList);
      const showReaction = videoChat.messageReceived(localParticipant);
      reactionListener = (event) => {
        if (
          event.target.nodeName === "BUTTON" &&
          reactions.includes(event.target.innerText)
        ) {
          const message = JSON.stringify({
            action: "reaction",
            reaction: event.target.innerText,
          });
          dataTrack.send(message);
          showReaction(message);
        }
      };
      reactionsList.addEventListener("click", reactionListener);

      whiteboardBtn.removeAttribute("hidden");
    });

    videoChat.addEventListener("whiteboard-started", (event) => {
      startWhiteboard(event.detail);
    });

    videoChat.addEventListener("whiteboard-stopped", () => {
      stopWhiteboard();
    });

    videoChat.addEventListener("whiteboard-draw", (event) => {
      whiteboard.drawOnCanvas(event.detail);
      whiteboard.saveLine(event.detail);
    });

    videoChat.addEventListener("screen-share-started", () => {
      if (screenShareBtn && !screenTrack) {
        disableButton(screenShareBtn);
      }
      disableButton(whiteboardBtn);
    });
    videoChat.addEventListener("screen-share-stopped", () => {
      if (screenShareBtn) {
        enableButton(screenShareBtn);
      }
      enableButton(whiteboardBtn);
    });
  });

  disconnectBtn.addEventListener("click", () => {
    if (!videoChat) {
      return;
    }
    videoChat.disconnect();
    if (screenTrack) {
      stopScreenSharing();
    }
    if (whiteboard) {
      stopWhiteboard();
    }
    hideElements(videoChatDiv, reactionsList);
    reactionsList.removeEventListener("click", reactionListener);
    localPreview.show();
    showElements(joinForm);
    videoChat = null;
  });

  const stopScreenSharing = () => {
    detachTrack(screenTrack);
    videoChat.stopScreenShare(screenTrack);
    screenTrack.stop();
    screenTrack = null;
    screenShareBtn.innerText = "Share screen";
    enableButton(whiteboardBtn);
  };

  screenShareBtn.addEventListener("click", async () => {
    if (screenTrack) {
      stopScreenSharing();
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia();
        const track = screenStream.getTracks()[0];
        screenTrack = new LocalVideoTrack(track, {
          name: "user-screen",
        });
        videoChat.startScreenShare(screenTrack);
        track.addEventListener("ended", stopScreenSharing);
        screenShareBtn.innerText = "Stop sharing";
        disableButton(whiteboardBtn);
      } catch (error) {
        console.error(error);
      }
    }
  });

  whiteboardBtn.addEventListener("click", () => {
    if (whiteboard) {
      stopWhiteboard();
      const message = JSON.stringify({
        action: "whiteboard",
        event: "stopped",
      });
      dataTrack.send(message);
    } else {
      startWhiteboard();
      const message = JSON.stringify({
        action: "whiteboard",
        event: "started",
      });
      dataTrack.send(message);
    }
  });

  const unMuteOnSpaceBarDown = (event) => {
    if (event.keyCode === 32) {
      audioTrack.enable();
    }
  };

  const muteOnSpaceBarUp = (event) => {
    if (event.keyCode === 32) {
      audioTrack.disable();
    }
  };

  muteBtn.addEventListener("click", () => {
    if (audioTrack.isEnabled) {
      audioTrack.disable();
      document.addEventListener("keydown", unMuteOnSpaceBarDown);
      document.addEventListener("keyup", muteOnSpaceBarUp);
    } else {
      audioTrack.enable();
      document.removeEventListener("keydown", unMuteOnSpaceBarDown);
      document.removeEventListener("keyup", muteOnSpaceBarUp);
    }
  });

  disableVideoBtn.addEventListener("click", () => {
    if (videoTrack.isEnabled) {
      videoTrack.disable();
    } else {
      videoTrack.enable();
    }
  });

  const startWhiteboard = (existingLines) => {
    const lines = existingLines || [];
    if (whiteboard) {
      return;
    }
    showElements(activityDiv);
    whiteboard = new Whiteboard(activityDiv);
    lines.forEach((line) => {
      whiteboard.drawOnCanvas(line);
      whiteboard.saveLine(line);
    });
    videoChatDiv.classList.add("screen-share");
    whiteboardBtn.innerText = "Stop whiteboard";
    videoChat.whiteboardStarted(whiteboard);
    whiteboard.addEventListener("draw", (event) => {
      dataTrack.send(
        JSON.stringify({
          action: "whiteboard",
          event: event.detail,
        })
      );
    });
    if (screenShareBtn) {
      disableButton(screenShareBtn);
    }
  };

  const stopWhiteboard = () => {
    if (!whiteboard) {
      return;
    }
    hideElements(activityDiv);
    whiteboard.destroy();
    whiteboard = null;
    videoChatDiv.classList.remove("screen-share");
    whiteboardBtn.innerText = "Start whiteboard";
    if (videoChat) {
      videoChat.whiteboardStopped();
    }
    if (screenShareBtn) {
      enableButton(screenShareBtn);
    }
  };
});
