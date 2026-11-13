const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const context = { window: {}, console, Set, Map, Math, String, Array, Number };
vm.createContext(context);

for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/community-question-bank.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}

const base = context.window.dengueQuestionIndex;
const builtin = base.find(item => !item.communityApproved);
const communityAdded = context.window.mergeApprovedCommunityQuestions([{
  id: "task16-test",
  topic: "general",
  question: "Task sixteen test community dengue question?",
  answerBn: "এটি পরীক্ষার জন্য একটি community বাংলা উত্তর।",
  answerEn: "This is a community English answer used for the test.",
  status: "approved"
}]);
const community = context.window.dengueQuestionIndex.find(item => item.id === "community_task16-test");
const originalCount = context.window.dengueQuestionIndex.length;

const changes = [
  {
    entryId: builtin.id, source: "builtin", status: "active",
    topic: "task16_test", question: "Task 16 edited built-in dengue question?",
    answerBn: "Task 16 পরীক্ষার জন্য সংশোধিত বাংলা উত্তর দেওয়া হয়েছে।",
    answerEn: "Task 16 edited built-in English answer for testing."
  },
  {
    entryId: "symptoms_002", source: "builtin", status: "deleted",
    topic: "symptoms", question: "Deleted test item", answerBn: "deleted", answerEn: "deleted"
  },
  {
    entryId: "community_task16-test", source: "community", status: "active",
    topic: "task16_test", question: "Task 16 edited community dengue question?",
    answerBn: "Task 16 community বাংলা সংশোধিত উত্তর।",
    answerEn: "Task 16 community edited English answer."
  },
  {
    entryId: "admin_task16_custom", source: "custom", status: "active",
    topic: "task16_test", question: "Task 16 custom knowledge base question?",
    answerBn: "Task 16 custom বাংলা উত্তর পরীক্ষার জন্য যোগ করা হয়েছে।",
    answerEn: "Task 16 custom English answer has been added for testing."
  }
];
const mergedCount = context.window.applyAdminQuestionBankChanges(changes);
const index = context.window.dengueQuestionIndex;
const editedBuiltin = index.find(item => item.id === builtin.id);
const deletedBuiltin = index.find(item => item.id === "symptoms_002");
const editedCommunity = index.find(item => item.id === "community_task16-test");
const custom = index.find(item => item.id === "admin_task16_custom");

const tests = [
  ["community question was loaded for the test", communityAdded === 1 && Boolean(community)],
  ["built-in question edit overlay applied", editedBuiltin && editedBuiltin.question === "Task 16 edited built-in dengue question?"],
  ["deleted built-in question removed from live index", !deletedBuiltin],
  ["community question edit overlay applied", editedCommunity && editedCommunity.question === "Task 16 edited community dengue question?"],
  ["custom Admin question added to live index", custom && custom.answerEn.includes("custom English answer")],
  ["search index invalidated after overlay", context.window.searchDengueCandidates("Task 16 custom knowledge base question?", 5).some(item => item.id === "admin_task16_custom")],
  ["merged knowledge base count is returned", mergedCount === index.length && index.length > 0]
];
let failed = false;
for (const [name, ok] of tests) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;

const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const frontend = fs.readFileSync(path.join(root, "assets/js/script.js"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");
const uiOk = [
  "Smart Question Bank & Knowledge Management",
  "kb-add-new", "kb-editor-form", "kb-search", "kb-topic-filter",
  "kb-status-filter", "kb-export-json", "kb-export-csv", "kb-backup-json",
  "kb-question-list", "kb-prev-page", "kb-next-page",
  "async function kbLoadQuestionBank()", "async function kbSaveQuestion(event)",
  "async function kbSetStatus(item, nextStatus)"
].every(value => admin.includes(value));
console.log(`${uiOk ? "PASS" : "FAIL"} | Admin CRUD, topic filter, pagination and export UI`);
if (!uiOk) process.exitCode = 1;

const publicOk =
  frontend.includes("async function loadAdminQuestionBankChanges()") &&
  frontend.includes('collection(db, "chatbot_admin_question_bank")') &&
  frontend.includes("applyAdminQuestionBankChanges(records)") &&
  frontend.includes("loadApprovedCommunityQuestions().then(loadAdminQuestionBankChanges)");
console.log(`${publicOk ? "PASS" : "FAIL"} | public chatbot loads approved Admin knowledge changes`);
if (!publicOk) process.exitCode = 1;

const securityOk =
  rules.includes("match /chatbot_admin_question_bank/{entryId}") &&
  rules.includes("resource.data.status in ['active', 'deleted']") &&
  rules.includes("allow create, update, delete: if isAdmin()");
console.log(`${securityOk ? "PASS" : "FAIL"} | Firestore public-read status restriction and admin-only writes`);
if (!securityOk) process.exitCode = 1;
