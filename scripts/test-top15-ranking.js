const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);

const tests = [
    ["ডেঙ্গুর লক্ষণ কী?", "symptoms"],
    ["ডেঙ্গু হলে কী খাবার খাওয়া উচিত?", "food"],
    ["What are the warning signs of dengue?", "warning"],
    ["ডেঙ্গু কি একজন থেকে আরেকজনে ছড়ায়?", "transmission"],
    ["ডেঙ্গুতে প্লেটলেট কমে গেলে কী করব?", "platelets"]
];

let failed = false;
for (const [question, expectedTopic] of tests) {
    const results = context.window.getTopDengueMatches(question, 15);
    const passed = results.length > 0 && results.length <= 15 &&
        results[0].topic === expectedTopic &&
        results.every(item => Number.isFinite(item.similarityPercent));
    console.log(`${passed ? "PASS" : "FAIL"} | ${question} | results=${results.length} | top=${results[0]?.topic}`);
    if (!passed) failed = true;
}
const unrelated = context.window.getTopDengueMatches("আজ আবহাওয়া কেমন?", 15);
const unrelatedPassed = unrelated.length === 0;
console.log(`${unrelatedPassed ? "PASS" : "FAIL"} | unrelated query is filtered | results=${unrelated.length}`);
if (!unrelatedPassed) failed = true;

if (failed) process.exitCode = 1;
