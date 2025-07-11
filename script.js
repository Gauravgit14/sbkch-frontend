/* Handles chatbot on index.html */

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatbotContainer = document.getElementById("chatbot");
  const chatbox = document.getElementById("chatbox");
  const input = document.getElementById("chatInput");
  const endChatBtn = document.getElementById("end-chat");

  let chatStep = 0;
  let nameInput = "";
  let emailInput = "";
  let phoneInput = "";
  let issueInput = "";
  let complaintId = "";

  endChatBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("closing");

    setTimeout(() => {
      chatbotContainer.classList.remove("open", "closing");
      chatbox.innerHTML = "";
      chatStep = 0;
      nameInput = emailInput = phoneInput = issueInput = complaintId = "";
    }, 600);
  });

  chatToggle.addEventListener("click", () => {
    chatbotContainer.classList.toggle("open");
    if (chatbox.innerHTML === "") {
      addMessage("👋 Hi there! What's your name?");
    }
  });

  function addMessage(message, sender = "bot") {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = message;
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  window.sendMessage = function () {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");

    switch (chatStep) {
      case 0:
        nameInput = text;
        addMessage(`Hi ${nameInput}! Please enter your email address:`);
        chatStep++;
        break;
      case 1:
        emailInput = text;
        addMessage("Great! Now enter your 10-digit phone number:");
        chatStep++;
        break;
      case 2:
        phoneInput = text;
        if (!/^\d{10}$/.test(phoneInput)) {
          addMessage("❗ Please enter a valid 10-digit number:");
          return;
        }
        addMessage("Please describe your issue:");
        chatStep++;
        break;
      case 3:
        issueInput = text;
        addMessage("📨 Submitting your issue...");

        fetch("https://sbkch-backend.onrender.com/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput,
            email: emailInput,
            phone: phoneInput,
            issue: issueInput,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.complaintId) {
              complaintId = data.complaintId;
              addMessage(`✅ Issue submitted!`);
              addMessage(`🆔 Complaint ID: ${complaintId}`);
              addMessage(`Our team will contact you within 24–48 hours.`);
              setTimeout(() => {
                addMessage("⭐ Please rate your experience (1–5 stars):");
                chatStep++;
              }, 1000);
            } else {
              addMessage("❌ Something went wrong. Try again later.");
            }
          })
          .catch((err) => {
            console.error(err);
            addMessage("🚨 Failed to connect to server.");
          });
        break;
      case 4:
        const rating = parseInt(text);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          addMessage("❗ Enter a number between 1 and 5.");
          return;
        }
        addMessage(`⭐ Thank you for rating us ${rating} stars!`);
        addMessage("Would you like to start a new chat? Type 'yes'");
        chatStep++;
        break;
      default:
        if (text.toLowerCase() === "yes") {
          chatStep = 0;
          nameInput = emailInput = phoneInput = issueInput = complaintId = "";
          chatbox.innerHTML = "";
          addMessage("👋 Hi there! What's your name?");
        } else {
          addMessage("Type 'yes' to start again.");
        }
        break;
    }

    input.value = "";
  };
});
