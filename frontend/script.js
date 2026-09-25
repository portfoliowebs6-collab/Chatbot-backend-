const API_BASE_URL = "https://chatbot-backend-sf0z.onrender.com";

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");


/* =========================
   ADD MESSAGE
========================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message ai-message";


    if (type === "ai") {

        message.innerHTML = `
            <div class="avatar">K</div>

            <div class="bubble">
                <p>${escapeHTML(text)}</p>
            </div>
        `;

    } else {

        message.innerHTML = `
            <div class="bubble">
                <p>${escapeHTML(text)}</p>
            </div>
        `;
    }


    chatBox.appendChild(message);

    scrollToBottom();
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;
}


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) return;


    // Show user message
    addMessage(message, "user");


    // Clear input
    messageInput.value = "";


    // Disable button
    sendButton.disabled = true;


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "AI response failed"
            );
        }


        // Show AI reply
        addMessage(data.reply, "ai");


    } catch (error) {

        console.error("Chat Error:", error);

        addMessage(
            "Sorry, I couldn't connect to the AI server.",
            "ai"
        );

    } finally {

        sendButton.disabled = false;

        messageInput.focus();
    }
}


/* =========================
   BUTTON
========================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================
   ENTER KEY
========================= */

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    }
);


/* Focus input */

messageInput.focus();