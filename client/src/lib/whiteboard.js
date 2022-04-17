import { showElements, hideElements } from "./utils";

const isTouchSupported = "ontouchstart" in window;
const isPointerSupported = navigator.pointerEnabled;
const downEvent = isTouchSupported
  ? "touchstart"
  : isPointerSupported
  ? "pointerdown"
  : "mousedown";
const moveEvent = isTouchSupported
  ? "touchmove"
  : isPointerSupported
  ? "pointermove"
  : "mousemove";
const upEvent = isTouchSupported
  ? "touchend"
  : isPointerSupported
  ? "pointerup"
  : "mouseup";

const colours = [
  { name: "white", value: "#ffffff", checked: true },
  { name: "black", value: "#000000", checked: true },
  { name: "red", value: "#f22f46", checked: false },
  { name: "purple", value: "#663399", checked: false },
  { name: "blue", value: "#87ceeb", checked: false },
  { name: "green", value: "#50c878", checked: false },
  { name: "orange", value: "#FF964F", checked: false },
  { name: "yellow", value: "#FFFF7E", checked: false },
];

const brushes = [
  { name: "small", value: 10, checked: false },
  { name: "medium", value: 30, checked: true },
  { name: "large", value: 60, checked: false },
  { name: "x-large", value: 80, checked: false },
  { name: "big-chungus", value: 120, checked: false }
];

const buildRadioButton = (name, options) => {
  const li = document.createElement("li");
  const radioBtn = document.createElement("input");
  radioBtn.setAttribute("type", "radio");
  radioBtn.setAttribute("value", options.value);
  radioBtn.setAttribute("name", name);
  radioBtn.setAttribute("id", options.name);
  if (options.checked) {
    radioBtn.setAttribute("checked", "checked");
  }
  const label = document.createElement("label");
  label.setAttribute("for", options.name);
  label.appendChild(document.createTextNode(options.name));
  li.appendChild(radioBtn);
  li.appendChild(label);
  return li;
};

const buildColourButtons = (colours) => {
  const colourList = document.createElement("ul");
  colourList.classList.add("colour-list");
  colours.forEach((colour) => {
    const li = buildRadioButton("colour", colour);
    const label = li.querySelector("label");
    label.style.setProperty("--background-color", colour.value);
    colourList.appendChild(li);
  });
  return colourList;
};

const buildBrushButtons = (brushes) => {
  const brushList = document.createElement("ul");
  brushList.classList.add("brush-list");
  brushes.forEach((brush) => {
    const li = buildRadioButton("brush", brush);
    brushList.appendChild(li);
  });
  return brushList;
};

export class Whiteboard extends EventTarget {
  constructor(container) {
    super();
    this.container = container;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("whiteboard-wrapper");
    this.colourList = buildColourButtons(colours);
    this.wrapper.appendChild(this.colourList);
    this.brushList = buildBrushButtons(brushes);
    this.wrapper.appendChild(this.brushList);
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("whiteboard-canvas");
    this.canvas.width = 4000;
    this.canvas.height = 1000;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#ffffff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines = [];
    this.line = {
      plots: [],
      colour: this.currentColour(),
      brush: this.currentBrush(),
    };
    this.startDrawing = this.startDrawing.bind(this);
    this.endDrawing = this.endDrawing.bind(this);
    this.draw = this.draw.bind(this);
    this.canvas.addEventListener(downEvent, this.startDrawing, false);
    this.canvas.addEventListener(moveEvent, this.draw, false);
    this.canvas.addEventListener(upEvent, this.endDrawing, false);
    this.wrapper.appendChild(this.canvas);
    this.container.appendChild(this.wrapper);
    this.setRatios();
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    showElements(this.container);
  }

  currentColour() {
    return this.colourList.querySelector("input:checked").value;
  }

  currentBrush() {
    return this.brushList.querySelector("input:checked").value;
  }

  drawOnCanvas(line) {
    this.context.strokeStyle = line.colour;
    this.context.lineWidth = line.brush;
    this.context.lineCap = this.context.lineJoin = "round";
    this.context.beginPath();
    if (line.plots.length > 0) {
      this.context.moveTo(line.plots[0].x, line.plots[0].y);
      line.plots.forEach((plot) => {
        this.context.lineTo(plot.x, plot.y);
      });
      this.context.stroke();
    }
  }

  startDrawing(event) {
    event.preventDefault();
    this.setRatios();
    this.isDrawing = true;
    this.line.colour = this.currentColour();
    this.line.brush = this.currentBrush();
  }

  draw(event) {
    event.preventDefault();
    if (!this.isDrawing) {
      return;
    }

    let x = isTouchSupported
      ? event.targetTouches[0].pageX - this.canvas.offsetLeft
      : event.offsetX || event.layerX - this.canvas.offsetLeft;
    let y = isTouchSupported
      ? event.targetTouches[0].pageY - this.canvas.offsetTop
      : event.offsetY || event.layerY - this.canvas.offsetTop;
    x = x * this.widthScale;
    y = y * this.heightScale;

    this.line.plots.push({ x: x << 0, y: y << 0 });

    this.drawOnCanvas(this.line);
  }

  endDrawing(event) {
    event.preventDefault();
    this.isDrawing = false;
    const lineCopy = Object.assign({}, this.line);
    const drawingEvent = new CustomEvent("draw", {
      detail: lineCopy,
    });
    this.dispatchEvent(drawingEvent);
    this.saveLine(lineCopy);
    this.line.plots = [];
  }

  saveLine(line) {
    this.lines.push(line);
  }

  destroy() {
    this.canvas.removeEventListener(downEvent, this.startDrawing);
    this.canvas.removeEventListener(moveEvent, this.draw);
    this.canvas.removeEventListener(upEvent, this.endDrawing);
    this.canvas.remove();
    this.wrapper.remove();
    hideElements(this.container);
    this.lines = [];
    return null;
  }

  setRatios() {
    this.clientRect = this.canvas.getBoundingClientRect();
    this.widthScale = this.canvas.width / this.clientRect.width;
    this.heightScale = this.canvas.height / this.clientRect.height;
  }
}
