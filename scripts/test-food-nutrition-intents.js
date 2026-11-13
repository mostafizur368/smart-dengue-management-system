const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুতে কী খাবার খাওয়া উচিত?", "অল্প অল্প করে সহজপাচ্য", "general food"],
  ["ডেঙ্গুতে ORS খাওয়া যাবে কি?", "ORS প্যাকেটের নির্দেশনা", "ORS hydration"],
  ["ডেঙ্গুতে ডাবের পানি কি উপকারী?", "ডাবের পানি পান করা যেতে পারে", "coconut water"],
  ["ডেঙ্গুতে পেঁপে পাতার রস খেলে কি প্লেটলেট বাড়ে?", "শক্ত ও নির্ভরযোগ্য প্রমাণ নেই", "papaya leaf"],
  ["ডেঙ্গুতে কোন খাবার খাওয়া যাবে না?", "নির্দিষ্ট দীর্ঘ নিষিদ্ধ খাবারের তালিকা নেই", "foods to avoid"],
  ["ডেঙ্গুতে খেতে ইচ্ছা না করলে কী খাব?", "একবারে বেশি খাবেন না", "poor appetite"],
  ["What should a dengue patient eat?", "small, frequent portions", "English general food"],
  ["Can I drink coconut water during dengue?", "Coconut water can be one of the fluids", "English coconut water"],
  ["Does papaya leaf juice increase platelets in dengue?", "There is not strong, reliable evidence", "English papaya leaf"],
  ["What foods should I avoid with dengue?", "no universal long list", "English foods avoid"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 115)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
