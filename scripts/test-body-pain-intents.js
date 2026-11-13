const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুতে শরীর ব্যথা কেন হয়?", "প্রতিরক্ষা-প্রতিক্রিয়া", "body pain cause"],
  ["ডেঙ্গুতে শরীর ব্যথা হলে কী করব?", "বিশ্রাম নিন", "what to do"],
  ["ডেঙ্গুতে শরীর ব্যথা কতদিন থাকে?", "সময় এক নয়", "duration"],
  ["ডেঙ্গুতে শরীর ব্যথা কমানোর উপায় কী?", "পর্যাপ্ত বিশ্রাম", "relief"],
  ["ডেঙ্গুতে শরীর ব্যথা কি বিপজ্জনক?", "একা এই ব্যথা", "danger"],
  ["How long does body pain last in dengue?", "duration varies", "English duration"],
  ["How to relieve body pain in dengue?", "prioritize rest", "English relief"]
];

let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.includes(expected);
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 100)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
