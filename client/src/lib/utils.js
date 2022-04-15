const hideElements = (...elements) =>
  elements.forEach((el) => el.setAttribute("hidden", "hidden"));

const showElements = (...elements) =>
  elements.forEach((el) => el.removeAttribute("hidden"));

const disableButton = (btn) => {
  btn.setAttribute("disabled", "disabled");
};
const enableButton = (btn) => {
  btn.removeAttribute("disabled");
};

const buildDropDown = (labelText, options, selected) => {
  const label = document.createElement("label");
  label.appendChild(document.createTextNode(labelText));
  const select = document.createElement("select");
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.setAttribute("value", opt.value);
    if (opt.label === selected) {
      option.setAttribute("selected", "selected");
    }
    option.appendChild(document.createTextNode(opt.label));
    select.appendChild(option);
  });
  label.appendChild(select);
  return label;
};

const attachTrack = (div, track) => {
  const mediaElement = track.attach();
  div.appendChild(mediaElement);
  return mediaElement;
};

const detachTrack = (track) => {
  track.detach().forEach((mediaElement) => {
    mediaElement.remove();
  });
};

module.exports = {
  hideElements,
  showElements,
  buildDropDown,
  attachTrack,
  detachTrack,
  disableButton,
  enableButton,
};
