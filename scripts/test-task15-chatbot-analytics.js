const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const frontend = fs.readFileSync(path.join(root, "assets/js/script.js"), "utf8");
const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");

const captureOk =
  frontend.includes("async function recordChatbotQueryEvent(userQuestion)") &&
  frontend.includes('collection(db, "chatbot_query_events")') &&
  frontend.includes("recordChatbotQueryEvent(message)") &&
  frontend.includes("Chatbot analytics event could not be saved:");
console.log(`${captureOk ? "PASS" : "FAIL"} | chatbot query event capture is wired and non-blocking`);
if (!captureOk) process.exitCode = 1;

const fieldsOk = [
  "question:", "matchedQuestion:", "topic:", "matchScore:", "matchLevel:",
  "language:", "userId:", "createdAt:", "createdAtClient:"
].every(field => frontend.includes(field));
console.log(`${fieldsOk ? "PASS" : "FAIL"} | analytics event includes bounded reporting fields`);
if (!fieldsOk) process.exitCode = 1;

const dashboardOk = [
  'id="chatbot-analytics-section"',
  "async function loadChatbotPerformanceAnalytics()",
  "analytics-questions-30d",
  "analytics-questions-7d",
  "analytics-average-match",
  "analytics-helpful-rate",
  "analytics-daily-chart",
  "analytics-top-questions",
  "analytics-topic-performance",
  "analytics-not-helpful-questions",
  "await loadChatbotPerformanceAnalytics()"
].every(value => admin.includes(value));
console.log(`${dashboardOk ? "PASS" : "FAIL"} | analytics dashboard metrics, chart and reports are wired`);
if (!dashboardOk) process.exitCode = 1;

const boundedReadsOk =
  admin.includes('limit(2000)') &&
  admin.includes("Data is limited to the latest 2,000 records per collection");
console.log(`${boundedReadsOk ? "PASS" : "FAIL"} | dashboard Firestore reads are bounded`);
if (!boundedReadsOk) process.exitCode = 1;

const securityOk =
  rules.includes("match /chatbot_query_events/{eventId}") &&
  rules.includes("allow read: if isAdmin()") &&
  rules.includes("allow update, delete: if false") &&
  rules.includes("request.resource.data.question.size() <= 500");
console.log(`${securityOk ? "PASS" : "FAIL"} | analytics events are admin-read-only and field constrained`);
if (!securityOk) process.exitCode = 1;

const privacyOk =
  frontend.includes("Your question may be stored for performance analytics") &&
  admin.includes("question text is stored in Firestore for analytics");
console.log(`${privacyOk ? "PASS" : "FAIL"} | user-facing analytics privacy disclosure exists`);
if (!privacyOk) process.exitCode = 1;
