// app/javascript/channels/chat_channel.js
import consumer from "./consumer";

const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel");
  },
  disconnected() {
    console.log("Disconnected from ChatChannel");
  },
  received(data) {
    // 受信したメッセージをメッセージエリアに追加する
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.innerText = data.message;
    messagesDiv.appendChild(messageElement);
    // 最新メッセージが見えるようにスクロール
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },
  speak(message) {
    this.perform("speak", { message: message });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat_form");
  const chatInput = document.getElementById("chat_input");

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (chatInput.value.trim() !== "") {
      chatChannel.speak(chatInput.value);
      chatInput.value = "";
    }
  });
});
