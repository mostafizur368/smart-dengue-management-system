const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");

const qualitySource = fs.readFileSync(path.join(root, "assets/js/chatbot-quality.js"), "utf8");
const context = {
  window: {
    getTopDengueMatches: () => [
      { topic: "warning", similarityPercent: 82, question: "Warning signs" }
    ]
  },
  console
};
vm.createContext(context);
vm.runInContext(qualitySource, context);
const high = context.window.getChatbotAnswerQuality("dengue warning signs");
const highOk = high.level === "high" && high.score === 82 && high.intent === "Warning signs";
console.log(`${highOk ? "PASS" : "FAIL"} | high relevance classification`);
if (!highOk) process.exitCode = 1;

context.window.getTopDengueMatches = () => [
  { topic: "general", similarityPercent: 52, question: "General dengue" }
];
const medium = context.window.getChatbotAnswerQuality("dengue question");
const mediumOk = medium.level === "medium" && medium.score === 52;
console.log(`${mediumOk ? "PASS" : "FAIL"} | medium relevance classification`);
if (!mediumOk) process.exitCode = 1;

context.window.getTopDengueMatches = () => [];
const low = context.window.getChatbotAnswerQuality("unrelated question");
const lowOk = low.level === "low" && low.score === 0 && low.matchCount === 0;
console.log(`${lowOk ? "PASS" : "FAIL"} | unmatched query classification`);
if (!lowOk) process.exitCode = 1;

const frontend = fs.readFileSync(path.join(root, "assets/js/script.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/style.css"), "utf8");

const feedbackUiOk =
  frontend.includes("function addAnswerQualityAndFeedback") &&
  frontend.includes('makeButton("helpful"') &&
  frontend.includes('makeButton("not_helpful"') &&
  frontend.includes('collection(db, "chatbot_feedback")') &&
  frontend.includes("addAnswerQualityAndFeedback(botMessageElement, message, answer)") &&
  index.includes("assets/js/chatbot-quality.js") &&
  css.includes(".chatbot-feedback-button");
console.log(`${feedbackUiOk ? "PASS" : "FAIL"} | quality signal and feedback UI wired`);
if (!feedbackUiOk) process.exitCode = 1;

const adminOk =
  admin.includes('id="chatbot-feedback-section"') &&
  admin.includes("async function loadChatbotFeedback()") &&
  admin.includes('collection(db, "chatbot_feedback")') &&
  admin.includes("await loadChatbotFeedback()");
console.log(`${adminOk ? "PASS" : "FAIL"} | admin feedback dashboard wired`);
if (!adminOk) process.exitCode = 1;

const rulesOk =
  rules.includes("match /chatbot_feedback/{feedbackId}") &&
  rules.includes("allow read: if isAdmin()") &&
  rules.includes("request.resource.data.rating in ['helpful', 'not_helpful']");
console.log(`${rulesOk ? "PASS" : "FAIL"} | Firestore feedback rules constrained`);
if (!rulesOk) process.exitCode = 1;
