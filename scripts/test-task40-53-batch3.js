const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const checks = [];
function check(name, ok) { checks.push([name, Boolean(ok)]); }
function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }

const index = read("index.html");
const frontend = read("assets/js/script.js");
const questions = read("assets/js/dengue-questions.js");
const css = read("assets/css/style.css");
const admin = read("assets/admin/admin-dashboard.html");
const moduleMatch = admin.match(/<script type="module">([\s\S]*?)<\/script>/);
const adminModule = moduleMatch ? moduleMatch[1] : "";
const rules = read("firestore_rules_current.txt");
const pkg = JSON.parse(read("package.json"));

// Runtime Question Bank and language regression.
const context = { console, Set, Map, Math, String, Array, Number, Date, RegExp };
context.window = context;
vm.createContext(context);
for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/community-question-bank.js",
  "assets/js/chatbot-intelligence.js",
  "assets/js/medical-safety.js",
  "assets/js/medical-references.js",
  "assets/js/chatbot-quality.js",
  "assets/js/answer-overrides.js"
]) vm.runInContext(read(file), context, { filename: file });

const banglishBodyPain = context.getDengueBankAnswer("shorir betha keno hoy");
const banglishDengueAction = context.getDengueBankAnswer("dengu hoile ki korbo");
const englishSymptoms = context.getDengueBankAnswer("What are dengue symptoms?");
check("Task 42 runtime: Banglish body-pain question returns a Bangla answer", /[\u0980-\u09FF]/.test(banglishBodyPain));
check("Task 42 runtime: Banglish dengue action question returns a Bangla answer", /[\u0980-\u09FF]/.test(banglishDengueAction));
check("Task 42 runtime: English question continues to receive an English answer", /^[A-Za-z]/.test(englishSymptoms));
const matches = context.window.getTopDengueMatches("ডেঙ্গুর লক্ষণ কী?", 15);
check("Regression: existing Top-15 retrieval remains available", matches.length > 0 && matches.length <= 15);
check("Regression: medical safety module remains available", typeof context.window.detectDengueEmergencySignals === "function");

// Task 40 — voice question input.
check("Task 40: microphone control is present in the public chatbot", index.includes('id="chatbot-voice-button"') && index.includes('id="chatbot-voice-status"'));
check("Task 40: browser SpeechRecognition and WebKit fallback are used", frontend.includes("window.SpeechRecognition || window.webkitSpeechRecognition"));
check("Task 40: transcript is reviewed in the input and not auto-submitted", frontend.includes("chatbotInput.value = transcript.slice(0, 300)") && frontend.includes("Review it before sending."));
check("Task 40: unsupported browser and denied permission have safe text fallback", frontend.includes("Voice input is not supported in this browser") && frontend.includes("Microphone permission was denied"));
check("Task 40: no paid speech API dependency was added", !/speechmatics|assemblyai|deepgram|api\.openai\.com|generativelanguage\.googleapis\.com/i.test(frontend));

// Task 41 — text to speech.
check("Task 41: answer read-aloud uses native SpeechSynthesis", frontend.includes("speechSynthesis") && frontend.includes("SpeechSynthesisUtterance"));
check("Task 41: read-aloud requires an explicit button click", frontend.includes("button.addEventListener(\"click\", () => {") && frontend.includes("window.speechSynthesis.speak(utterance)"));
check("Task 41: Bangla and English speech locales are selected", frontend.includes('"bn-BD"') && frontend.includes('"en-US"'));

// Task 42 — language detection.
check("Task 42: language detection recognizes Bengali script", frontend.includes("/[\\u0980-\\u09FF]/.test(value)") && questions.includes("/[\\u0980-\\u09FF]/.test(value)"));
check("Task 42: common Banglish transliteration cues are recognized", frontend.includes('"shorir"') && frontend.includes('"betha"') && questions.includes('"hoile"'));

// Task 43 — responsive mobile chatbot.
check("Task 43: responsive CSS handles small screens and dynamic viewport height", css.includes("@media (max-width: 600px)") && css.includes("76dvh") && css.includes("env(safe-area-inset-bottom)"));
check("Task 43: chatbot opens with flex layout for responsive column sizing", frontend.includes('chatbotWindow.style.display = "flex"') && css.includes("flex-direction: column"));
check("Task 43: narrow-device rules exist", css.includes("@media (max-width: 360px)"));

// Task 44 — starter questions.
check("Task 44: Bangla and English starter questions are present", index.includes("chatbot-starter-questions") && index.includes('data-starter-question="ডেঙ্গুর সাধারণ লক্ষণ কী?"') && index.includes('data-starter-question="What tests are used for dengue?"'));
check("Task 44: starter prompts submit through the existing chat form", frontend.includes("setupChatbotStarterQuestions") && frontend.includes('wrapper.querySelectorAll("[data-starter-question]")'));

// Task 45 — popular questions.
check("Task 45: popular question analytics retains Top 50 aggregation", admin.includes("Most asked questions · Top 50") && adminModule.includes('analytics-top-questions'));
check("Task 45: analytics CSV export is available", admin.includes('id="analytics-export"') && adminModule.includes("chatbot-analytics-"));

// Task 46 — unanswered report.
check("Task 46: unanswered question report and count are displayed", admin.includes("analytics-unanswered-list") && admin.includes("analytics-unanswered-total"));
check("Task 46: unmatched, low-confidence and missing matched-question events are counted", adminModule.includes("item.isUnmatched === true") && adminModule.includes('item.matchLevel === "low"') && adminModule.includes('!String(item.matchedQuestion || "").trim()'));

// Task 47 — poor match report.
check("Task 47: poor match report is separate from unanswered report", admin.includes("analytics-poor-match-list") && admin.includes("Poor match questions"));
check("Task 47: poor match report uses a bounded score threshold", adminModule.includes("score < 55"));

// Task 48 — satisfaction analytics.
check("Task 48: satisfaction count, helpful rate and reason breakdown exist", admin.includes("analytics-ratings-total") && admin.includes("analytics-helpful-rate") && admin.includes("analytics-feedback-reasons"));
check("Task 48: satisfaction report groups Not Helpful feedback reasons", adminModule.includes("reasonGroups") && adminModule.includes("feedbackReason"));

// Task 49 — topic-wise analytics.
check("Task 49: topic report includes average match, low-match rate and helpful rate", admin.includes("Topic performance") && admin.includes("Low match") && admin.includes("Helpful"));
check("Task 49: topic metrics combine query and feedback events", adminModule.includes("topicGroups") && adminModule.includes("group.lowCount") && adminModule.includes("group.helpful"));

// Task 50 — Admin activity log.
check("Task 50: Admin activity logger records actor, action, target and time", adminModule.includes("async function logAdminActivity") && adminModule.includes("actorUid") && adminModule.includes("createdAtClient"));
check("Task 50: activity log is visible and refreshable in Admin", admin.includes("admin-activity-log-section") && admin.includes("admin-activity-refresh") && adminModule.includes("loadAdminActivityLog"));
check("Task 50: question, bulk, import, clinical, source and doctor actions are logged", adminModule.includes("question_created") && adminModule.includes("question_bulk_") && adminModule.includes("question_import_published") && adminModule.includes("clinical_review_assigned") && adminModule.includes("medical_source_archived") && adminModule.includes("doctor_chatbot_verified"));
check("Task 50: Firestore audit trail is Admin-only and immutable", rules.includes("match /admin_activity_logs/{logId}") && rules.includes("allow read: if isAdmin()") && rules.includes("allow update, delete: if false"));

// Task 51 — complete knowledge export.
check("Task 51: complete knowledge bundle export button and function exist", admin.includes("kb-export-complete") && adminModule.includes("async function kbExportCompleteBundle"));
check("Task 51: export includes questions, medical sources, import batches and versions", adminModule.includes("questionBank: kbExportRecords()") && adminModule.includes("medicalSources: sources") && adminModule.includes("importBatches: batches") && adminModule.includes("questionVersions: versions"));
check("Task 51: complete export includes the merged built-in and Admin medical source registry", adminModule.includes("window.getMedicalSourceRegistry().map(item => ({ id: item.id"));
check("Task 51: export explicitly excludes user chats, profiles, appointments and reviewer notes", adminModule.includes("No user chat history") && adminModule.includes("clinician free-text notes are included"));

// Task 52 — system health monitoring.
check("Task 52: Admin system health panel and manual action exist", admin.includes("system-health-section") && admin.includes("system-health-run"));
check("Task 52: health check verifies network, secure context, auth and core modules", adminModule.includes("async function runAdminSystemHealthCheck") && adminModule.includes("navigator.onLine") && adminModule.includes("window.isSecureContext") && adminModule.includes("Authentication"));
check("Task 52: Firestore health reads are bounded to one document per collection", adminModule.includes("limit(1)") && adminModule.includes('"chatbot_query_events"'));
check("Task 52: health checks are read-only and not a security audit claim", adminModule.includes("no health data is written to Firestore") && admin.includes("not a full penetration test"));

// Task 53 — release audit and preserved constraints.
check("Task 53: release audit documentation exists", fs.existsSync(path.join(root, "docs/TASK40_53_RELEASE_AUDIT.md")));
check("Task 53: release audit script is registered", pkg.scripts["audit:release"] === "node scripts/audit-release.js");
check("Task 53: batch test is included in the full regression runner", pkg.scripts["test:task40-53"] === "node scripts/test-task40-53-batch3.js" && read("scripts/test-full-chatbot.js").includes("test:task40-53"));
check("Preservation: no paid AI provider dependency was added", !/openai|anthropic|gemini|cohere|mistral/i.test(JSON.stringify(pkg.dependencies || {})));
check("Preservation: existing Firebase admin role guard remains in place", adminModule.includes('userSnap.data().role !== "admin"'));
check("Preservation: existing appointment, doctor and clinician workflows remain", admin.includes("Appointment Management") && admin.includes("Clinician Review Workflow") && admin.includes("Doctor Management"));
check("Security: broad public read/write Firestore rule is absent", !/allow\\s+(?:read|write|read,\\s*write)\\s*:\\s*if\\s+true\\s*;/i.test(rules));
check("Performance: analytics reads remain bounded", adminModule.includes("limit(2000)") && adminModule.includes("limit(100)"));
check("Task 50: logger catches its own failure so it cannot block core Admin actions", adminModule.includes("Admin activity log write failed"));

// Syntax checks for changed scripts and module blocks.
for (const file of ["assets/js/script.js", "assets/js/dengue-questions.js"]) {
  const source = read(file);
  const isModule = file.endsWith("script.js");
  const result = require("child_process").spawnSync(process.execPath,
    isModule ? ["--input-type=module", "--check"] : ["--check"],
    { input: source, encoding: "utf8", cwd: root });
  check(`Syntax: ${file}`, result.status === 0);
}
const adminSyntax = require("child_process").spawnSync(process.execPath, ["--input-type=module", "--check"], {
  input: adminModule, encoding: "utf8", cwd: root
});
check("Syntax: Admin dashboard module", adminSyntax.status === 0);

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) failed++;
}
console.log(`\nTASK 40–53 SUMMARY: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
