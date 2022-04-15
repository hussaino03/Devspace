import { pollAudio } from "./volume-meter";
import {
  hideElements,
  showElements,
  buildDropDown,
  attachTrack,
  detachTrack,
} from "./utils";
import { createLocalVideoTrack, createLocalAudioTrack } from "twilio-video";

class LocalPreview extends EventTarget {
  constructor(videoTrack, audioTrack) {
    super();
    this.visible = true;
    this.choosingDevice = false;
    this.localPreviewDiv = document.getElementById("local-preview");
    this.videoPreviewDiv = document.getElementById("video-preview");
    this.canvas = document.getElementById("audio-data");
    this.cameraSelector = document.getElementById("camera-selector");
    this.micSelector = document.getElementById("mic-selector");
    this.stopPolling = null;
    this.videoTrack = videoTrack;
    this.audioTrack = audioTrack;
    this.setupSelectors();
    this.show();
  }

  set videoTrack(track) {
    if (this.videoPreview) {
      this.videoPreview.pause();
      this.videoPreview.remove();
    }
    this._videoTrack = track;
    this.videoPreview = attachTrack(this.videoPreviewDiv, this.videoTrack);
    if (this.visible) {
      this.videoPreview.play();
    }
  }
  get videoTrack() {
    return this._videoTrack;
  }

  set audioTrack(track) {
    this._audioTrack = track;
    if (this.visible) {
      pollAudio(this.audioTrack, this.canvas).then(
        (callback) => (this.stopPolling = callback)
      );
    }
  }
  get audioTrack() {
    return this._audioTrack;
  }

  hide() {
    hideElements(this.localPreviewDiv);
    this.videoPreview.pause();
    if (this.stopPolling) {
      this.stopPolling();
      this.stopPolling = null;
    }
    this.visible = false;
  }

  async show() {
    this.stopPolling = await pollAudio(this.audioTrack, this.canvas);
    this.videoPreview.play();
    showElements(this.localPreviewDiv);
    this.visible = true;
  }

  async setupSelectors() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const deviceToOption = (device) => ({
        value: device.deviceId,
        label: device.label,
      });
      const videoDevices = devices
        .filter((device) => device.kind === "videoinput")
        .map(deviceToOption);
      const audioDevices = devices
        .filter((device) => device.kind === "audioinput")
        .map(deviceToOption);
      const videoSelect = buildDropDown(
        "Choose camera",
        videoDevices,
        this.videoTrack.mediaStreamTrack.label
      );
      videoSelect.addEventListener("change", (event) => {
        this.getVideoTrack(event.target.value);
      });
      const audioSelect = buildDropDown(
        "Choose microphone",
        audioDevices,
        this.audioTrack.mediaStreamTrack.label
      );
      audioSelect.addEventListener("change", (event) => {
        this.getAudioTrack(event.target.value);
      });

      this.cameraSelector.appendChild(videoSelect);
      this.micSelector.appendChild(audioSelect);
    } catch (e) {
      console.error(e);
    }
  }

  async getVideoTrack(deviceId) {
    if (this.choosingDevice) {
      return;
    }
    this.choosingDevice = true;
    try {
      this.videoTrack.stop();
      detachTrack(this.videoTrack);
      const newVideoTrack = await createLocalVideoTrack({
        deviceId: { exact: deviceId },
      });
      this.videoTrack = newVideoTrack;
      this.dispatchNewTrackEvent("new-video-track", this.videoTrack);
    } catch (error) {
      console.error(error);
    }
    this.choosingDevice = false;
  }

  async getAudioTrack(deviceId) {
    if (this.choosingDevice) {
      return;
    }
    this.choosingDevice = true;
    try {
      this.audioTrack.stop();
      const newAudioTrack = await createLocalAudioTrack({
        deviceId: { exact: deviceId },
      });
      this.audioTrack = newAudioTrack;
      this.dispatchNewTrackEvent("new-audio-track", this.audioTrack);
    } catch (error) {
      console.error(error);
    }
    this.choosingDevice = false;
  }

  dispatchNewTrackEvent(type, track) {
    const newTrackEvent = new CustomEvent(type, { detail: track });
    this.dispatchEvent(newTrackEvent);
  }
}

export default LocalPreview;
