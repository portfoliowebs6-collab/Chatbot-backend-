const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Helper to get current time format like "10:25 AM"
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

// Append message into chat screen
function appendMessage(text, sender) {
    const isUser = sender === 'user';
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');

    messageDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i></div>
        <div class="msg-content">
            <p>${text.replace(/\n/g, '<br>')}</p>
            <span class="timestamp">${getCurrentTime()}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle sending message logic
async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display User Message
    appendMessage(text, 'user');
    userInput.value = '';

    try {
        // Fetch response from backend server
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        if (data.reply) {
            appendMessage(data.reply, 'bot');
        } else {
            appendMessage("Sorry, something went wrong.", 'bot');
        }
    } catch (error) {
        console.error('Error connecting to backend:', error);
        appendMessage("Unable to connect to the backend server. Make sure it's running.", 'bot');
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
