const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize stable Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Frontend static files serve karne ke liye
app.use(express.static(path.join(__dirname, '../frontend')));

// API Endpoint connecting to Gemini API
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const reply = response.text() || "I couldn't generate a response right now.";
        
        res.json({ reply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "Oops! Something went wrong while connecting to the Gemini API. Check your API Key." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
