const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুতে প্লেটলেট ৭০,০০০ হলে কী করব?", "৭০,০০০", "platelet 70k Bangla digits"],
  ["ডেঙ্গুতে platelet 70000 হলে কী করব?", "৭০,০০০", "platelet 70k Arabic digits"],
  ["ডেঙ্গুতে প্লেটলেট কমে কেন?", "অস্থিমজ্জায়", "platelet drop cause"],
  ["ডেঙ্গুতে প্লেটলেট কতদিনে বাড়ে?", "critical phase", "platelet recovery"],
  ["ডেঙ্গুতে CBC রিপোর্ট কীভাবে বুঝব?", "Hematocrit", "CBC report"],
  ["ডেঙ্গুতে hematocrit বাড়লে কী বোঝায়?", "plasma leakage", "rising hematocrit"],
  ["ডেঙ্গু NS1 positive মানে কী?", "প্রথম ৭ দিনের মধ্যে", "NS1 positive"],
  ["ডেঙ্গু NS1 negative হলে কি ডেঙ্গু নেই?", "negative হলেই dengue নেই", "NS1 negative"],
  ["ডেঙ্গুতে IgM positive হলে কী বোঝায়?", "৪–৫ দিন", "IgM"],
  ["ডেঙ্গুতে IgG positive মানে কী?", "একবারের Dengue IgG positive ফল দিয়ে বর্তমানে acute dengue infection নিশ্চিত করা যায় না", "IgG"],
  ["What does dengue NS1 positive mean?", "first 7 days", "English NS1"],
  ["What does a single positive dengue IgG mean?", "A single positive dengue IgG result cannot confirm a current acute dengue infection", "English IgG"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 105)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
