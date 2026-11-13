const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Serve the website and its browser-side free chatbot.
app.use(express.static(__dirname));

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Smart Dengue backend is running. The chatbot search runs locally in the browser."
    });
});

// Compatibility endpoint: the project no longer calls a paid AI API.
// The active chatbot uses the local Question Bank + Hybrid Search in the browser.
app.post("/api/chat", (req, res) => {
    res.status(410).json({
        success: false,
        reply: "This paid-AI endpoint has been disabled. Please use the website's free local Dengue Chatbot."
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Smart Dengue Website running at http://localhost:${PORT}`);
});
