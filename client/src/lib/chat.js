import { showElements, hideElements } from "./utils";
import { ThisMonthInstance } from "twilio/lib/rest/api/v2010/account/usage/record/thisMonth";

export class Chat extends EventTarget {
  constructor(container, toggleBtn, identity) {
    super();
    this.container = container;
    this.toggleBtn = toggleBtn;
    this.identity = identity;
    this.visible = true;
    this.newMessagesCount = 0;
    this.wrapper = this.container.querySelector(".chat");
    this.messageList = this.container.querySelector(".messages");
    this.form = this.container.querySelector("form");
    this.input = this.form.querySelector("input");
    this.sendMessage = this.sendMessage.bind(this);
    this.form.addEventListener("submit", this.sendMessage);
    this.inputFocused = this.inputFocused.bind(this);
    this.inputBlurred = this.inputBlurred.bind(this);
    this.input.addEventListener("focus", this.inputFocused);
    this.input.addEventListener("blur", this.inputBlurred);
  }

  sendMessage(event) {
    event.preventDefault();
    const message = {
      body: this.input.value,
      identity: this.identity,
    };
    const messageEvent = new CustomEvent("chat-message", {
      detail: message,
    });
    this.receiveMessage(message);
    this.dispatchEvent(messageEvent);
    this.input.value = "";
  }

  receiveMessage(message) {
    const li = document.createElement("li");
    const author = document.createElement("p");
    author.classList.add("author");
    author.appendChild(document.createTextNode(message.identity));
    const body = document.createElement("p");
    body.classList.add("body");
    body.appendChild(document.createTextNode(message.body));
    li.appendChild(author);
    li.appendChild(body);
    this.messageList.appendChild(li);
    if (this.lastMessage && this.visible) {
      const listRect = this.messageList.getBoundingClientRect();
      const messageRect = this.lastMessage.getBoundingClientRect();
      if (messageRect.top < listRect.bottom) {
        li.scrollIntoView();
      }
    }
    if (!this.visible) {
      this.newMessagesCount += 1;
      if (!this.badge) {
        this.badge = document.createElement("span");
        this.toggleBtn.appendChild(this.badge);
      }
      this.badge.innerText = this.newMessagesCount;
    }
    this.lastMessage = li;
  }

  inputFocused() {
    this.dispatchEvent(new Event("chat-focused"));
  }

  inputBlurred() {
    this.dispatchEvent(new Event("chat-blurred"));
  }

  toggle() {
    if (this.visible) {
      hideElements(this.wrapper);
      this.visible = false;
    } else {
      showElements(this.wrapper);
      this.visible = true;
      if (this.badge) {
        this.badge = this.badge.remove();
        this.newMessagesCount = 0;
      }
    }
  }

  destroy() {
    this.messageList.innerHTML = "";
    this.input.value = "";
    this.form.removeEventListener("submit", this.sendMessage);
    this.input.removeEventListener("focus", this.inputFocused);
    this.input.removeEventListener("blur", this.inputBlurred);
    return null;
  }
}
