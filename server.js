
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

// Load .env from project root
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

const app = express();

app.use(cors());
app.use(express.json());

// Serve website files from project root
const projectRoot = path.resolve(__dirname, "../..");
app.use(express.static(projectRoot));

// OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Dengue AI Backend is running!"
    });
});

// AI Chatbot API
app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
            return res.status(400).json({
                success: false,
                reply: "Please enter a message."
            });
        }

        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            instructions: `
You are Dengue AI Assistant for a Smart Dengue Management System.
Answer dengue-related questions in Bangla or English.
Reply in the same language as the user.
Use simple language.
Never diagnose or prescribe medicine.
Advise immediate medical attention for warning signs.
            `,
            input: userMessage
        });

        res.json({
            success: true,
            reply: response.output_text
        });

    } catch (error) {
        console.error("AI Chatbot Error:", error);

        res.status(500).json({
            success: false,
            reply: "Sorry, AI service is unavailable right now."
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Dengue Server running on port ${PORT}`);
});
