const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple endpoint to handle chat messages
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Simulated AI response logic
    setTimeout(() => {
        let reply = "That's awesome! I'm here to help you with questions, coding, and brainstorming.";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            reply = "Hello! 👋 I'm your AI assistant. How can I help you today?";
        } else if (lowerMsg.includes('who are you') || lowerMsg.includes('about yourself')) {
            reply = "Of course! I'm an AI assistant designed to help you with questions, ideas, explanations, coding, learning and much more.";
        } else if (lowerMsg.includes('what can you do')) {
            reply = "I can help with answering questions, explaining complex topics, brainstorming ideas, writing code, and much more!";
        }

        res.json({ reply });
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
