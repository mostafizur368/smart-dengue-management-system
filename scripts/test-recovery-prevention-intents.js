const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গু থেকে সুস্থ হতে কতদিন লাগে?", "১–২ সপ্তাহের মধ্যে", "recovery duration"],
  ["ডেঙ্গু ভালো হওয়ার পরও দুর্বল লাগে কেন?", "কয়েক সপ্তাহ", "post dengue fatigue"],
  ["ডেঙ্গু থেকে সেরে উঠে কখন কাজ শুরু করব?", "ধীরে শুরু করুন", "return to work"],
  ["ডেঙ্গুর পর কখন ব্যায়াম করা যাবে?", "strenuous activity", "return to exercise"],
  ["দ্বিতীয়বার ডেঙ্গু হলে কি বেশি বিপদ?", "severe dengue-এর ঝুঁকি তুলনামূলক বেশি", "second infection"],
  ["ডেঙ্গু থেকে বাঁচতে মশার কামড় এড়াব কীভাবে?", "DEET", "bite prevention"],
  ["বাড়িতে ডেঙ্গুর মশা জন্মানো বন্ধ করব কীভাবে?", "সপ্তাহে অন্তত একবার", "breeding control"],
  ["ডেঙ্গু একবার হলে কি আবার হবে না?", "চারটি serotype", "reinfection"],
  ["How long does it take to recover from dengue?", "1–2 weeks", "English recovery"],
  ["Why am I tired after dengue?", "several weeks", "English fatigue"],
  ["Is dengue more dangerous the second time?", "higher risk", "English second infection"],
  ["How to stop dengue mosquitoes breeding at home?", "At least once a week", "English breeding"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 110)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
