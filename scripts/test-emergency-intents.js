const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুর বিপদজনক লক্ষণ কী কী?", "Warning Signs", "warning signs"],
  ["ডেঙ্গুতে জ্বর কমে গেলে কেন বিপদ বাড়ে?", "Critical Phase", "fever drops"],
  ["ডেঙ্গু শক কী?", "Dengue Shock", "shock"],
  ["ডেঙ্গুতে রক্তপাত হলে কী করব?", "জরুরি অবস্থা", "bleeding emergency"],
  ["ডেঙ্গুতে প্রস্রাব কমে গেলে কী করব?", "দ্রুত চিকিৎসকের মূল্যায়ন", "reduced urine"],
  ["ডেঙ্গুতে কখন হাসপাতালে ভর্তি হতে হয়?", "হাসপাতালে ভর্তি", "hospital admission"],
  ["What are the dengue warning signs?", "Important dengue warning signs", "English warning signs"],
  ["What is dengue shock?", "life-threatening state", "English shock"],
  ["What should I do if bleeding occurs in dengue?", "Treat nose or gum bleeding", "English bleeding"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 115)}`);
  if (!pass) failed = true;
}
const frontend = fs.readFileSync("assets/js/script.js", "utf8");
const alertWired = frontend.includes("function addEmergencyAlert") &&
  frontend.includes("addEmergencyAlert(botMessageElement, message)") &&
  frontend.includes('setAttribute("role", "alert")');
console.log(`${alertWired ? "PASS" : "FAIL"} | emergency alert is wired into chatbot UI`);
if (!alertWired) failed = true;
if (failed) process.exitCode = 1;
