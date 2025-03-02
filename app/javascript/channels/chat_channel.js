import consumer from "./consumer";

let pollingInterval = null;
let lastMessageId = 0;
let isTransitioning = false;
let reconnectTimer = null;

// ActionCable のチャットチャネル設定
const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log("Connected to ChatChannel");
    isTransitioning = true;

    // 接続回復時に差分を取得してから状態を更新
    fetch(`/chat_messages?last_id=${lastMessageId}`)
      .then((response) => response.json())
      .then((messages) => {
        messages.forEach((message) => {
          addMessageToUI(message);
          if (message.id > lastMessageId) {
            lastMessageId = message.id;
          }
        });
        // 差分取得完了後にポーリングを停止
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        isTransitioning = false;
      });
  },
  disconnected() {
    console.log("Disconnected from ChatChannel");

    // 既存のreconnectTimerをクリア
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    // 遅延してポーリングを開始
    reconnectTimer = setTimeout(() => {
      if (!isTransitioning && !pollingInterval) {
        startPolling();
      }
    }, 2000); // 2秒待ってからポーリング開始
  },
  received(data) {
    // 新着メッセージを画面に追加する
    addMessageToUI(data);
    // 最後のメッセージIDを更新（ここでは data.id が付与されている前提）
    if (data.id && data.id > lastMessageId) {
      lastMessageId = data.id;
    }
  },
  speak(message) {
    this.perform("speak", { message: message });
  },
});

function addMessageToUI(data) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.innerText = data.message || data.content;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function startPolling() {
  pollingInterval = setInterval(() => {
    fetch(`/chat_messages?last_id=${lastMessageId}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((message) => {
          addMessageToUI(message);
          if (message.id && message.id > lastMessageId) {
            lastMessageId = message.id;
          }
        });
      })
      .catch((error) => console.error("Polling error:", error));
  }, 3000); // 例: 3秒毎にリクエスト
}

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
