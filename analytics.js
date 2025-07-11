/* Handles chat for analytics.html */

document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("input");
  const sendButton = document.querySelector("button");

  function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  async function sendMessage() {
    const question = input.value.trim();
    if (!question) return;

    appendMessage("user", question);
    input.value = "";
    appendMessage("bot", "Thinking...");

    try {
      const res = await axios.post("https://sbkch-backend.onrender.com/chat", {
        question,
      });

      chat.removeChild(chat.lastChild); // remove "Thinking..."
      appendMessage("bot", res.data?.answer || "⚠️ Something went wrong.");
    } catch (error) {
      chat.removeChild(chat.lastChild);
      appendMessage("bot", "❌ Server error. Please try again later.");
    }
  }

  sendButton.addEventListener("click", sendMessage);
});
