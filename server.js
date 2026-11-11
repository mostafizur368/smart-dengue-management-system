
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});
const app = express();

app.use(cors());
app.use(express.json());
// Serve Website Files
app.use(express.static(__dirname));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Backend Health Check
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

Your responsibilities:
- Answer dengue-related questions in Bangla or English.
- Reply in the same language used by the user.
- Explain dengue symptoms, prevention, recovery, tests and warning signs.
- Use simple language that ordinary people can understand.
- Never claim to diagnose a patient.
- Never prescribe medicines or change medical treatment.
- Explain that platelet count alone cannot determine dengue severity.
- If warning signs appear, advise immediate medical attention.
- Do not replace professional medical advice.
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
            reply: "Sorry, AI service is unavailable right now. Please try again."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Dengue AI Server running at http://localhost:${PORT}`);
});
