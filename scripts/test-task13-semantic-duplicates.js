const fs = require("fs");
const path = require("path");
const vm = require("vm");
const context = { window: {}, console };
vm.createContext(context);

for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
}

const compare = context.window.compareDengueQuestionSimilarity;
const cases = [
  ["ডেঙ্গুতে শরীর ব্যথা কেন হয়?", "Why does dengue cause body pain?", 0.78, "Bangla-English body pain"],
  ["ডেঙ্গু হলে গা ব্যথা করে কেন?", "ডেঙ্গুতে শরীর ব্যথা কেন হয়?", 0.78, "Bangla body pain paraphrase"],
  ["ডেঙ্গুর লক্ষণ কী?", "What are the symptoms of dengue?", 0.78, "Bangla-English symptoms"],
  ["ডেঙ্গুতে NS1 পরীক্ষা কখন করাতে হয়?", "When should I get an NS1 test for dengue?", 0.70, "Bangla-English NS1 test"],
  ["ডেঙ্গুতে শরীর ব্যথা কেন হয়?", "ডেঙ্গুতে NS1 পরীক্ষা কখন করাতে হয়?", 0.78, "different intents must not be duplicates"]
];

let failed = false;
for (const [a, b, threshold, label] of cases) {
  const result = compare(a, b);
  const pass = label.startsWith("different")
    ? result.score < threshold
    : result.score >= threshold;
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${result.similarityPercent}%`);
  if (!pass) failed = true;
}

const candidates = [
  { id: "1", question: "Why does dengue cause body pain?" },
  { id: "2", question: "When should I get an NS1 test for dengue?" }
];
const ranked = context.window.findDengueQuestionDuplicates(
  "ডেঙ্গুতে শরীর ব্যথা কেন হয়?", candidates, 5
);
const rankedOk = ranked.length > 0 &&
  ranked[0].id === "1" &&
  ranked[0].similarityPercent >= 78;
console.log(`${rankedOk ? "PASS" : "FAIL"} | semantic duplicate candidates are ranked`);
if (!rankedOk) failed = true;

const admin = fs.readFileSync(path.join(__dirname, "../assets/admin/admin-dashboard.html"), "utf8");
const adminOk = admin.includes("findDengueQuestionDuplicates") &&
  admin.includes("Strong meaning-level duplicate") &&
  admin.includes("Possible related question(s) found") &&
  admin.includes("similarityPercent") &&
  admin.includes("approve.disabled = duplicate");
console.log(`${adminOk ? "PASS" : "FAIL"} | admin semantic warning and approval guard`);
if (!adminOk) failed = true;

const search = fs.readFileSync(path.join(__dirname, "../assets/js/dengue-search.js"), "utf8");
const apiOk = search.includes("window.compareDengueQuestionSimilarity") &&
  search.includes("window.findDengueQuestionDuplicates") &&
  search.includes("SEMANTIC_PHRASE_ALIASES");
console.log(`${apiOk ? "PASS" : "FAIL"} | free local semantic comparison API`);
if (!apiOk) failed = true;

if (failed) process.exitCode = 1;
