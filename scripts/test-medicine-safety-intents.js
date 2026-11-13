const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const cases = [
  ["ডেঙ্গুতে প্যারাসিটামল খাওয়া যাবে কি?", "Paracetamol (Acetaminophen)", "paracetamol"],
  ["ডেঙ্গুতে প্যারাসিটামল কতটুকু খাব?", "বয়স, ওজন, লিভারের অবস্থা", "paracetamol dose safety"],
  ["ডেঙ্গুতে ibuprofen খাওয়া যাবে কি?", "Ibuprofen নিজে থেকে খাবেন না", "ibuprofen"],
  ["ডেঙ্গুতে আইবুপ্রোফেন কেন নিষেধ?", "রক্তপাতের ঝুঁকি", "ibuprofen reason"],
  ["ডেঙ্গুতে aspirin খাওয়া যাবে কি?", "Aspirin খাবেন না", "aspirin"],
  ["ডেঙ্গু হলে aspirin বন্ধ করব কি?", "নিজে থেকে বন্ধ বা চালু রাখার সিদ্ধান্ত নেবেন না", "prescribed aspirin"],
  ["ডেঙ্গুতে antibiotic খাওয়া লাগে কি?", "Antibiotic কাজ করে না", "antibiotic"],
  ["ডেঙ্গুতে কোন ওষুধে রক্তপাত বাড়ে?", "Ibuprofen, Naproxen ও Mefenamic acid", "bleeding risk"],
  ["ডেঙ্গুতে mefenamic acid খাওয়া যাবে কি?", "এড়িয়ে চলুন", "mefenamic acid"],
  ["শিশুর ডেঙ্গুতে কোন ওষুধ দেওয়া যাবে?", "শিশুর ওজন, বয়স", "child medicine"],
  ["শিশুর ডেঙ্গুতে প্যারাসিটামল কতটুকু?", "নির্দিষ্ট dose", "child dose"],
  ["ডেঙ্গুতে steroid খাওয়া যাবে কি?", "নিয়মিতভাবে সুপারিশ করা হয় না", "steroids"],
  ["Can I take ibuprofen with dengue?", "Do not self-medicate with ibuprofen", "English ibuprofen"],
  ["Are antibiotics needed for dengue?", "antibiotics do not treat uncomplicated dengue", "English antibiotics"],
  ["Can a child with dengue take aspirin?", "Do not give aspirin", "English child"]
];
let failed = false;
for (const [question, expected, label] of cases) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(question)})`, context);
  const pass = answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${pass ? "PASS" : "FAIL"} | ${label} | ${answer.slice(0, 110)}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
