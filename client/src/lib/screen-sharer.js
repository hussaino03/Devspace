import { detachTrack } from "./utils";
import { enableButton, disableButton } from "./utils";
import { LocalVideoTrack } from "twilio-video";

export class ScreenSharer extends EventTarget {
  constructor(button, videoChat) {
    super();
    this.button = button;
    this.videoChat = videoChat;
    this.screenTrack = null;
    this.handleClick = this.handleClick.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.button.addEventListener("click", this.handleClick);
  }

  handleClick() {
    if (this.screenTrack) {
      this.stopScreenShare();
    } else {
      this.startScreenShare();
    }
  }

  async startScreenShare() {
    const screenStream = await navigator.mediaDevices.getDisplayMedia();
    const track = screenStream.getTracks()[0];
    this.screenTrack = new LocalVideoTrack(track, {
      name: "user-screen",
    });
    this.videoChat.startScreenShare(this.screenTrack);
    track.addEventListener("ended", () => {
      this.stopScreenShare();
    });
    this.button.innerText = "Stop sharing";
  }

  stopScreenShare() {
    if (this.screenTrack) {
      detachTrack(this.screenTrack);
      this.videoChat.stopScreenShare(this.screenTrack);
      this.screenTrack.stop();
      this.screenTrack = null;
      this.button.innerText = "Share screen";
    }
  }

  disable() {
    disableButton(this.button);
  }

  enable() {
    enableButton(this.button);
  }

  destroy() {
    this.stopScreenShare();
    this.enable();
    this.button.removeEventListener("click", this.handleClick);
    return null;
  }
}