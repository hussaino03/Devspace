import {
  createLocalTracks,
  LocalDataTrack,
  LocalVideoTrack,
  LocalAudioTrack,
} from "twilio-video";
import { VideoChat } from "./lib/video-chat";
import { hideElements, showElements } from "./lib/utils";
import LocalPreview from "./lib/localPreview";
import { Reactions } from "./lib/reactions";
import { Chat } from "./lib/chat";
import { Whiteboard } from "./lib/whiteboard";
import { ScreenSharer } from "./lib/screen-sharer";

let videoTrack,
  audioTrack,
  localPreview,
  videoChat,
  dataTrack,
  reactions,
  chat,
  whiteboard,
  screenSharer;

const setupTrackListeners = (track, button, enableLabel, disableLabel) => {
  button.innerText = track.isEnabled ? disableLabel : enableLabel;
  track.on("enabled", () => {
    button.innerText = disableLabel;
  });
  track.on("disabled", () => {
    button.innerText = enableLabel;
  });
};

const removeTrackListeners = (track) => {
  track.removeAllListeners("enabled");
  track.removeAllListeners("disabled");
};

window.addEventListener("DOMContentLoaded", () => {
  const previewBtn = document.getElementById("media-preview");
  const startDiv = document.querySelector(".start");
  const videoChatDiv = document.getElementById("video-chat");
  const joinForm = document.getElementById("join-room");
  const disconnectBtn = document.getElementById("disconnect");
  const screenShareBtn = document.getElementById("screen-share");
  const muteBtn = document.getElementById("mute-self");
  const disableVideoBtn = document.getElementById("disable-video");
  const liveControls = document.getElementById("live-controls");
  const videoAndChat = document.getElementById("videos-and-chat");
  const chatToggleBtn = document.getElementById("toggle-chat");
  const whiteboardBtn = document.getElementById("whiteboard");
  const activity = document.getElementById("activity");

  const toggleChat = () => {
    if (chat) {
      chat.toggle();
    }
  };

  const toggleWhiteboard = () => {
    if (whiteboard && videoChat) {
      videoChat.sendMessage(
        JSON.stringify({
          action: "whiteboard",
          event: "stopped",
        })
      );
      stopWhiteboard();
    } else {
      videoChat.sendMessage(
        JSON.stringify({
          action: "whiteboard",
          event: "started",
        })
      );
      startWhiteboard();
    }
  };
  
  const receiveDrawEvent = (event) => {
    videoChat.sendMessage(
      JSON.stringify({
        action: "whiteboard",
        event: event.detail,
      })
    );
  };

  const startWhiteboard = () => {
    whiteboard = new Whiteboard(activity);
    whiteboard.addEventListener("draw", receiveDrawEvent);
    videoChat.whiteboard = true;
    videoChatDiv.classList.add("screen-share");
    whiteboardBtn.innerText = "Stop whiteboard";
  };

  const stopWhiteboard = () => {
    if (!whiteboard) {
      return;
    }
    whiteboard.removeEventListener("draw", receiveDrawEvent);
    whiteboard = whiteboard.destroy();
    videoChat.whiteboard = false;
    videoChatDiv.classList.remove("screen-share");
    whiteboardBtn.innerText = "Start whiteboard";
  };

  previewBtn.addEventListener("click", async () => {
    hideElements(startDiv);
    try {
      const tracks = await createLocalTracks({
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
    const { token, roomName, identity } = await fetch(
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
    dataTrack = new LocalDataTrack();
    videoTrack = new LocalVideoTrack(videoTrack.mediaStreamTrack, {
      name: "user-camera",
    });
    audioTrack = new LocalAudioTrack(audioTrack.mediaStreamTrack, {
      name: "user-audio",
    });
    videoChat = new VideoChat(token, roomName, {
      videoTrack,
      audioTrack,
      dataTrack,
    });
    if (!("getDisplayMedia" in navigator.mediaDevices)) {
      screenShareBtn.remove();
    }
    showElements(videoChatDiv);
    localPreview.hide();
    screenSharer = new ScreenSharer(screenShareBtn, videoChat);
    videoChat.addEventListener("screen-share-started", () => {
      screenSharer.disable();
    });
    videoChat.addEventListener("screen-share-stopped", screenSharer.enable);
    reactions = new Reactions(liveControls);
    reactions.addEventListener("reaction", (event) => {
      videoChat.sendMessage(
        JSON.stringify({ action: "reaction", reaction: event.detail })
      );
      videoChat.showReaction(event.detail);
    });
    chat = new Chat(videoAndChat, chatToggleBtn, identity);
    chat.addEventListener("chat-message", (event) => {
      const message = event.detail;
      message.action = "chat-message";
      videoChat.sendMessage(JSON.stringify(message));
    });
    chat.addEventListener("chat-focused", unlistenForSpaceBar);
    chat.addEventListener("chat-blurred", listenForSpaceBar);
    videoChat.addEventListener("chat-message", (event) => {
      chat.receiveMessage(event.detail);
    });
    chatToggleBtn.addEventListener("click", toggleChat);

    whiteboardBtn.addEventListener("click", toggleWhiteboard);

    videoChat.addEventListener("whiteboard-started", () => {
      startWhiteboard();
    });

    videoChat.addEventListener("whiteboard-stopped", () => {
      stopWhiteboard();
    });

    videoChat.addEventListener("whiteboard-draw", (event) => {
      whiteboard.drawOnCanvas(event.detail);
      whiteboard.saveLine(event.detail);
    });
  });

  disconnectBtn.addEventListener("click", () => {
    if (!videoChat) {
      return;
    }
    [videoTrack, audioTrack, dataTrack].forEach(removeTrackListeners);
    screenSharer = screenSharer.destroy();
    videoChat.disconnect();
    reactions = reactions.destroy();
    chat = chat.destroy();
    chatToggleBtn.removeEventListener("click", toggleChat);
    whiteboardBtn.removeEventListener("click", toggleWhiteboard);
    stopWhiteboard();
    hideElements(videoChatDiv);
    localPreview.show();
    showElements(joinForm);
    videoChat = null;
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

  const listenForSpaceBar = () => {
    document.addEventListener("keydown", unMuteOnSpaceBarDown);
    document.addEventListener("keyup", muteOnSpaceBarUp);
  };

  const unlistenForSpaceBar = () => {
    document.removeEventListener("keydown", unMuteOnSpaceBarDown);
    document.removeEventListener("keyup", muteOnSpaceBarUp);
  };

  muteBtn.addEventListener("click", () => {
    if (audioTrack.isEnabled) {
      audioTrack.disable();
      listenForSpaceBar();
    } else {
      audioTrack.enable();
      unlistenForSpaceBar();
    }
  });

  disableVideoBtn.addEventListener("click", () => {
    if (videoTrack.isEnabled) {
      videoTrack.disable();
    } else {
      videoTrack.enable();
    }
  });
});

window.addEventListener('load',function(){
  document.querySelector('body').classList.add("loaded")  
});