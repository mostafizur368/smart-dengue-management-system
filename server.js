const express = require("express");
const cors = require("cors");
const { createRateLimiter } = require("./rate-limiter");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY || 1);

const allowedOrigins = new Set(
    String(process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map(value => value.trim())
        .filter(Boolean)
);

// Same-origin website requests do not need CORS. Cross-origin requests are denied
// unless their exact origin is explicitly listed in ALLOWED_ORIGINS.
app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, false);
        return callback(null, allowedOrigins.has(origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 600
}));

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
    res.setHeader("Cache-Control", req.path.startsWith("/api/") ? "no-store" : "public, max-age=300");
    next();
});

app.use(express.json({ limit: "32kb", strict: true }));

const apiLimiter = createRateLimiter({ windowMs: 60_000, max: 120 });
const healthLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });
const chatLimiter = createRateLimiter({ windowMs: 60_000, max: 8 });

app.use("/api", apiLimiter);

// Do not publish server-side source, Firebase Rules, deployment config or developer tools
// through the static website root.
const privatePathPattern = /^\/(?:functions|scripts|docs)(?:\/|$)|^\/(?:firebase\.json|firestore\.rules|firestore_rules_current\.txt|package(?:-lock)?\.json|server\.js|rate-limiter\.js)(?:$|\/)/i;
app.use((req, res, next) => {
    if (privatePathPattern.test(req.path)) return res.sendStatus(404);
    next();
});

// Serve the public website files.
app.use(express.static(__dirname));

// Public health endpoint: only non-sensitive process status is returned.
app.get("/api/health", healthLimiter, (req, res) => {
    res.json({
        success: true,
        status: "ok",
        service: "smart-dengue-web",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Compatibility endpoint: the project no longer calls a paid AI API.
app.post("/api/chat", chatLimiter, (req, res) => {
    res.status(410).json({
        success: false,
        error: "endpoint_disabled",
        reply: "This paid-AI endpoint has been disabled. Please use the website's free local Dengue Chatbot."
    });
});

// Do not expose stack traces or environment details to callers.
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = Number(error.status || error.statusCode);
    if (status === 413) {
        return res.status(413).json({ success: false, error: "payload_too_large" });
    }
    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({ success: false, error: "invalid_json" });
    }
    console.error("Request failed:", error.code || error.name || "request_error");
    return res.status(500).json({ success: false, error: "internal_server_error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Smart Dengue Website running at http://localhost:${PORT}`);
});
