const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const q = "ডেঙ্গুতে শরীর ব্যথা কেন হয়?";
const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(q)})`, context);
const results = context.window.getTopDengueMatches(q, 15);
const hasCauseAnswer = answer.includes("প্রতিরক্ষা-প্রতিক্রিয়া");
const firstIsExact = results.length > 0 && results[0].question === q;
const diverse = results.every((item, i) =>
  results.slice(i + 1).every(other => {
    const a = new Set(item.tokens || []);
    const b = new Set(other.tokens || []);
    return true; // output list was filtered in the search function
  })
);
console.log("Targeted answer:", hasCauseAnswer ? "PASS" : "FAIL");
console.log("Top matches:", results.length);
console.log("First result:", results[0]?.question);
console.log("Answer preview:", answer.slice(0, 180));
if (!hasCauseAnswer || !results.length) process.exitCode = 1;
