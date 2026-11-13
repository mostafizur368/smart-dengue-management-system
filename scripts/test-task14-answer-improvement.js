const fs = require("fs");
const path = require("path");
const vm = require("vm");
const context = { window: {}, console };
vm.createContext(context);

for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/answer-overrides.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
}

const sourceQuestion = "ডেঙ্গুতে শরীর ব্যথা কেন হয়?";
const questionKey = context.window.getDengueQuestionKey(sourceQuestion);
const loaded = context.window.loadApprovedAnswerOverrides([
  {
    id: questionKey,
    sourceQuestion,
    answerBn: "প্রথম সংশোধিত বাংলা উত্তর। এটি পরীক্ষার জন্য যথেষ্ট দীর্ঘ।",
    answerEn: "First corrected English answer. This is sufficiently long for the test.",
    status: "approved",
    version: 1
  },
  {
    id: questionKey,
    sourceQuestion,
    answerBn: "দ্বিতীয় সংশোধিত বাংলা উত্তর। সর্বশেষ সংস্করণটি ব্যবহার করা হবে।",
    answerEn: "Second corrected English answer. The latest version should be used.",
    status: "approved",
    version: 2
  },
  {
    id: "pending",
    sourceQuestion: "ডেঙ্গুতে জ্বর কেন হয়?",
    answerBn: "Pending answer should not load.",
    answerEn: "Pending answer should not load.",
    status: "pending",
    version: 3
  }
]);
const versionOk = loaded === 1 &&
  context.window.getApprovedAnswerOverride(sourceQuestion).version === 2 &&
  context.window.getApprovedAnswerOverride(sourceQuestion).answerEn.startsWith("Second");
console.log(`${versionOk ? "PASS" : "FAIL"} | latest approved correction version wins; pending ignored`);
if (!versionOk) process.exitCode = 1;

const query = "ডেঙ্গুতে শরীর ব্যথা কেন হয়?";
const top = context.window.getTopDengueMatches(query, 1)[0];
const override = {
  sourceQuestion: top.question,
  answerBn: "পরীক্ষায় ব্যবহারের জন্য সংশোধিত বাংলা উত্তর।",
  answerEn: "Corrected English answer for the test."
};
context.window.loadApprovedAnswerOverrides([{ ...override, status: "approved", version: 1 }]);
const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(query)})`, context);
const answerOk = answer === override.answerBn;
console.log(`${answerOk ? "PASS" : "FAIL"} | approved correction overrides the live answer`);
if (!answerOk) process.exitCode = 1;

const frontend = fs.readFileSync(path.join(__dirname, "../assets/js/script.js"), "utf8");
const admin = fs.readFileSync(path.join(__dirname, "../assets/admin/admin-dashboard.html"), "utf8");
const rules = fs.readFileSync(path.join(__dirname, "../firestore_rules_current.txt"), "utf8");
const wiringOk =
  frontend.includes('rating === "not_helpful"') &&
  frontend.includes('collection(db, "chatbot_answer_issues")') &&
  frontend.includes("matchedQuestion") &&
  admin.includes("async function loadAnswerImprovementQueue()") &&
  admin.includes("Approve & Publish Correction") &&
  admin.includes("chatbot_answer_correction_history") &&
  admin.includes("Most Reported Questions");
console.log(`${wiringOk ? "PASS" : "FAIL"} | Not Helpful issue queue, admin correction and report wiring`);
if (!wiringOk) process.exitCode = 1;

const rulesOk =
  rules.includes("match /chatbot_answer_issues/{issueId}") &&
  rules.includes("match /chatbot_answer_overrides/{overrideId}") &&
  rules.includes("match /chatbot_answer_correction_history/{historyId}") &&
  rules.includes("allow read: if resource.data.status == 'approved' || isAdmin()");
console.log(`${rulesOk ? "PASS" : "FAIL"} | Firestore issue, public approved override and audit rules`);
if (!rulesOk) process.exitCode = 1;

const overrideSource = fs.readFileSync(path.join(__dirname, "../assets/js/answer-overrides.js"), "utf8");
const index = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const loaderOk = overrideSource.includes("window.loadApprovedAnswerOverrides") &&
  frontend.includes("loadApprovedAnswerCorrections()") &&
  index.includes("assets/js/answer-overrides.js");
console.log(`${loaderOk ? "PASS" : "FAIL"} | approved correction loader wired into public chatbot`);
if (!loaderOk) process.exitCode = 1;
