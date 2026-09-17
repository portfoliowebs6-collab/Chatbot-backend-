const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API (Ye automatically process.env.GEMINI_API_KEY utha lega)
const ai = new GoogleGenAI();

// Frontend static files serve karne ke liye
app.use(express.static(path.join(__dirname, '../frontend')));

// API Endpoint connecting to Gemini API
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Call Gemini 2.5 Flash model for fast responses
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: "You are Kewa AI, a helpful, friendly, and smart assistant embedded in a chatbot UI. Keep answers clear, concise, and helpful."
            }
        });

        const reply = response.text || "I couldn't generate a response right now.";
        res.json({ reply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "Oops! Something went wrong while connecting to the Gemini API." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
