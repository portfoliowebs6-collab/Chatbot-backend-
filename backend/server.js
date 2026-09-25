const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash"
});

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Kewa AI backend is running"
    });
});

// Chat API
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        const result = await model.generateContent(message);

        const response = result.response.text();

        res.json({
            success: true,
            reply: response
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            success: false,
            error: "AI response failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Kewa AI backend running on port ${PORT}`);
});