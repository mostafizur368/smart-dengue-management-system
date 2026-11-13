const vm = require("vm");
const fs = require("fs");
const path = require("path");

const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../assets/js/dengue-questions.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../assets/js/dengue-search.js"), "utf8"), context);

const cases = [
  ["ডেঙ্গুতে শরীর ব্যথা কেন হয়?", "প্রতিরক্ষা-প্রতিক্রিয়া", "body pain cause"],
  ["ডেঙ্গুতে জ্বর কতদিন থাকে?", "২–৭ দিনের মধ্যে", "fever duration"],
  ["ডেঙ্গুতে বমি হলে কী করব?", "বারবার বা অবিরাম বমি", "vomiting"],
  ["ডেঙ্গুতে platelet 70000 হলে কী করব?", "চিকিৎসককে", "low platelet"],
  ["ডেঙ্গুতে NS1 positive মানে কী?", "প্রথম ৭ দিনের মধ্যে", "NS1"],
  ["ডেঙ্গুতে পেঁপে পাতার রস কি platelet বাড়ায়?", "নির্ভরযোগ্য প্রমাণ নেই", "papaya leaf"],
  ["ডেঙ্গুতে ibuprofen খাওয়া যাবে কি?", "Ibuprofen নিজে থেকে খাবেন না", "ibuprofen"],
  ["ডেঙ্গুর বিপজ্জনক লক্ষণ কী কী?", "তীব্র পেটব্যথা", "warning signs"],
  ["ডেঙ্গু থেকে সুস্থ হতে কতদিন লাগে?", "১–২ সপ্তাহের মধ্যে", "recovery duration"],
  ["ডেঙ্গুর পর কখন ব্যায়াম করা যাবে?", "ধীরে শুরু করুন", "return to activity"],
  ["দ্বিতীয়বার ডেঙ্গু হলে কি বেশি বিপদ?", "ঝুঁকি তুলনামূলক বেশি", "second infection"],
  ["বাড়িতে ডেঙ্গুর মশা জন্মানো বন্ধ করব কীভাবে?", "সপ্তাহে অন্তত একবার", "breeding control"],
  ["What should a dengue patient eat?", "small, frequent portions", "English food"],
  ["Can I take aspirin with dengue?", "Do not take aspirin", "English aspirin"],
  ["What are the dengue warning signs?", "Important dengue warning signs", "English emergency"],
  ["How long does it take to recover from dengue?", "1–2 weeks", "English recovery"]
];

let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const ok = typeof answer === "string" && answer.length > 25 &&
    answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${ok ? "PASS" : "FAIL"} | answer route | ${label}`);
  if (!ok) failed = true;

  const matches = context.window.getTopDengueMatches(question, 15);
  const valid = Array.isArray(matches) && matches.length <= 15 &&
    matches.every((m, i) => m.rank === i + 1 &&
      typeof m.question === "string" &&
      typeof m.similarityPercent === "number" &&
      m.similarityPercent >= 0 && m.similarityPercent <= 100);
  console.log(`${valid ? "PASS" : "FAIL"} | Top-15 contract | ${label} (${matches.length} matches)`);
  if (!valid) failed = true;
}

const unrelatedAnswer = vm.runInContext('getDengueBankAnswer("What is the capital of France?")', context);
const unrelatedOk = unrelatedAnswer.includes("only answer dengue-related") &&
  context.window.getTopDengueMatches("What is the capital of France?", 15).length === 0;
console.log(`${unrelatedOk ? "PASS" : "FAIL"} | unrelated query is safely rejected`);
if (!unrelatedOk) failed = true;

const frontend = fs.readFileSync(path.join(__dirname, "../assets/js/script.js"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "../assets/css/style.css"), "utf8");
const emergencyOk = frontend.includes("function addEmergencyAlert") &&
  frontend.includes("addEmergencyAlert(botMessageElement, message)") &&
  frontend.includes('setAttribute("role", "alert")') &&
  frontend.includes('setAttribute("aria-live", "assertive")') &&
  css.includes(".dengue-emergency-alert");
console.log(`${emergencyOk ? "PASS" : "FAIL"} | emergency alert integration and accessible styling`);
if (!emergencyOk) failed = true;

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
const requiredScripts = [
  "test:body-pain-intents", "test:symptom-intents", "test:platelet-reports",
  "test:food-nutrition", "test:medicine-safety", "test:emergency",
  "test:recovery-prevention", "test:full"
];
const scriptsOk = requiredScripts.every(name => Boolean(packageJson.scripts[name]));
console.log(`${scriptsOk ? "PASS" : "FAIL"} | test scripts are registered`);
if (!scriptsOk) failed = true;

if (failed) process.exitCode = 1;
