const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুতে জ্বর হলে কী করব?", "শরীরের তাপমাত্রা পর্যবেক্ষণ", "fever management"],
  ["ডেঙ্গুতে জ্বর কতদিন থাকে?", "২–৭ দিনের মধ্যে", "fever duration"],
  ["ডেঙ্গুতে মাথাব্যথা কেন হয়?", "মাথাব্যথা এবং চোখের পেছনে ব্যথা", "headache"],
  ["ডেঙ্গুতে চোখের পেছনে ব্যথা কেন?", "চোখের পেছনে ব্যথা", "eye pain"],
  ["ডেঙ্গুতে র‍্যাশ কেন হয়?", "ত্বকে লালচে র‍্যাশ", "rash"],
  ["ডেঙ্গুতে বমি হলে কী করব?", "বারবার বা অবিরাম বমি", "nausea vomiting"],
  ["How long does dengue fever last?", "2–7 days", "English fever duration"],
  ["Why does dengue cause rash?", "skin rash", "English rash"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 95)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
