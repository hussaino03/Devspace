export const allowedReactions = ["👍", "👎", "✋"];

const generateReactionsHTML = (reactions) => {
  const wrapper = document.createElement("div");
  const ul = document.createElement("ul");
  reactions.forEach((reaction) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.appendChild(document.createTextNode(reaction));
    li.appendChild(btn);
    ul.appendChild(li);
  });
  wrapper.appendChild(ul);
  return wrapper;
};

export class Reactions extends EventTarget {
  constructor(controls) {
    super();
    this.controls = controls;
    this.html = generateReactionsHTML(allowedReactions);
    this.controls.appendChild(this.html);
    this.sendReaction = this.sendReaction.bind(this);
    this.html.addEventListener("click", this.sendReaction);
  }

  sendReaction(event) {
    if (
      event.target.nodeName === "BUTTON" &&
      allowedReactions.includes(event.target.innerText)
    ) {
      this.dispatchEvent(
        new CustomEvent("reaction", {
          detail: event.target.innerText,
        })
      );
    }
  }

  destroy() {
    this.html.removeEventListener("click", this.sendReaction);
    this.html.remove();
    return null;
  }
}
