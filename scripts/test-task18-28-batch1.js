const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const search = fs.readFileSync(path.join(root, "assets/js/dengue-search.js"), "utf8");
const questions = fs.readFileSync(path.join(root, "assets/js/dengue-questions.js"), "utf8");
const frontend = fs.readFileSync(path.join(root, "assets/js/script.js"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const checks = [];
function check(name, ok) { checks.push([name, Boolean(ok)]); }

check("Task 18 import batches store IDs and have a soft-delete rollback action",
  admin.includes("publishedEntryIds") &&
  admin.includes("async function kbRollbackImportBatch") &&
  admin.includes('status: "rolled_back"') &&
  admin.includes('status: "deleted"'));

check("Task 18 can recover legacy Task 17 batch entries by batchId",
  admin.includes('where("batchId", "==", batchRecord.batchId)'));

check("Task 19 version snapshots are written for edits, create, bulk actions and rollback",
  admin.includes("async function kbSaveVersionSnapshot") &&
  admin.includes('"chatbot_question_versions"') &&
  admin.includes('"bulk_import"') &&
  admin.includes('"import_rollback"'));

check("Task 19 version history viewer is available in the Question Bank",
  admin.includes("kbShowVersionHistory") && admin.includes("kb-version-history"));

check("Task 20 duplicate detection combines concept and character similarity",
  search.includes("characterSimilarity") &&
  search.includes("matchType") &&
  search.includes("findDengueQuestionDuplicates"));

check("Task 21 bulk edit, topic change, approve, delete and restore controls exist",
  admin.includes("kbBulkChange") &&
  admin.includes("kb-bulk-apply-topic") &&
  admin.includes("kb-bulk-approve") &&
  admin.includes("kb-bulk-delete") &&
  admin.includes("kb-bulk-restore"));

check("Task 22 new questions can remain pending and require explicit approval",
  admin.includes('value="pending"') &&
  admin.includes('status: targetStatus') &&
  admin.includes('kbSetStatus(item, "active")') &&
  rules.includes("resource.data.status in ['active', 'deleted']"));

check("Task 23 daily/manual backups are chunked and stored in Firestore",
  admin.includes("async function kbCreateDailyBackup") &&
  admin.includes("const chunkSize = 20") &&
  admin.includes('"chatbot_question_bank_backups"'));

check("Task 24 Top-15 search is capped at 15 and fills remaining slots",
  search.includes("Math.min(15, Number(limit) || 15)") &&
  search.includes("fillThreshold") &&
  search.includes("window.getTopDengueMatches"));

check("Task 25 Banglish phrase aliases are included in hybrid search",
  search.includes("shorir betha") &&
  search.includes("matha betha") &&
  search.includes("platelet kome") &&
  questions.includes('"dengu": "dengue"'));

check("Task 26 approved Admin-managed entries return their own Bangla/English answer",
  questions.includes("bestMatch.adminManaged === true") &&
  questions.includes("bestMatch.answerBn") &&
  questions.includes("bestMatch.answerEn"));

check("Task 27 follow-up context is resolved and remembered in-session",
  questions.includes("resolveDengueFollowUpQuery") &&
  questions.includes("rememberDengueConversationContext") &&
  search.includes("window.resolveDengueFollowUpQuery"));

check("Task 28 unmatched questions are marked in analytics",
  frontend.includes('isUnmatched: !best || quality.level === \"low\"') &&
  frontend.includes("topMatchCount") &&
  admin.includes("async function kbLoadMissedQuestions"));

check("Firestore Rules protect version history and backup collections",
  rules.includes("match /chatbot_question_versions/{versionId}") &&
  rules.includes("match /chatbot_question_bank_backups/{backupId}") &&
  rules.includes("match /chunks/{chunkId}"));

check("Firestore query analytics rules validate Task 28 optional fields",
  rules.includes("'isUnmatched', 'topMatchCount', 'contextUsed'") &&
  rules.includes("request.resource.data.isUnmatched is bool") &&
  rules.includes("request.resource.data.contextUsed is bool"));

check("Full regression runner includes Batch 1 validation",
  pkg.scripts["test:task18-28"] === "node scripts/test-task18-28-batch1.js");

const context = { console, Set, Map, Math, String, Array, Number, Date, RegExp };
context.window = context;
vm.createContext(context);
for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/community-question-bank.js",
  "assets/js/chatbot-quality.js",
  "assets/js/answer-overrides.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const banglishMatches = context.window.getTopDengueMatches("shorir betha keno hoy", 15);
check("Runtime: Banglish body-pain question retrieves the symptoms topic",
  banglishMatches.length === 15 && banglishMatches[0].topic === "symptoms");

const top15 = context.window.getTopDengueMatches("ডেঙ্গুতে শরীর ব্যথা কেন হয়", 15);
check("Runtime: Bangla question returns 15 ranked matches in descending score",
  top15.length === 15 &&
  top15.every((item, index) => item.rank === index + 1) &&
  top15.every((item, index) => index === 0 || top15[index - 1].score >= item.score));

const crossLanguageDuplicates = context.window.findDengueQuestionDuplicates(
  "ডেঙ্গুতে শরীর ব্যথা কেন?",
  [{ question: "Why does dengue cause body pain?" }],
  3
);
check("Runtime: cross-language paraphrase is detected as a possible duplicate",
  crossLanguageDuplicates.length === 1 && crossLanguageDuplicates[0].similarityPercent >= 42);

context.window.dengueConversationContext = {
  question: "ডেঙ্গুতে প্লেটলেট কমে কেন?",
  topic: "platelets",
  timestamp: Date.now()
};
const contextualQuery = context.window.resolveDengueFollowUpQuery("এটা কত হলে বিপদ?");
check("Runtime: vague follow-up uses the previous question context",
  contextualQuery.includes("ডেঙ্গুতে প্লেটলেট কমে কেন?") && contextualQuery.includes("এটা কত হলে বিপদ?"));

context.window.dengueConversationContext = null;
context.window.applyAdminQuestionBankChanges([{
  entryId: "admin_batch1_custom_test",
  source: "custom",
  status: "active",
  topic: "symptoms",
  question: "ডেঙ্গুতে Batch One custom retrieval test কী?",
  answerBn: "এটি Batch One-এর জন্য একটি পরীক্ষামূলক Admin বাংলা উত্তর।",
  answerEn: "This is the Batch One test Admin English answer."
}]);
const customAnswer = context.getDengueBankAnswer("ডেঙ্গুতে Batch One custom retrieval test কী?");
check("Runtime: approved Admin custom record returns its own answer",
  customAnswer.includes("পরীক্ষামূলক Admin বাংলা উত্তর"));

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) failed++;
}
console.log(`\nTASK 18–28 SUMMARY: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
