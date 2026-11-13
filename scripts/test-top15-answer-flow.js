const vm = require("vm");
const fs = require("fs");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/dengue-questions.js", "utf8"), context);
vm.runInContext(fs.readFileSync("assets/js/dengue-search.js", "utf8"), context);
const questions = ["ডেঙ্গুর লক্ষণ কী?", "ডেঙ্গু হলে কী খাবার খাওয়া উচিত?", "What are the warning signs of dengue?"];
for (const q of questions) {
  const answer = vm.runInContext(`getDengueBankAnswer(${JSON.stringify(q)})`, context);
  const matches = context.window.lastDengueSearchResults;
  console.log(JSON.stringify({question:q, answerStarts:answer.slice(0,80), count:matches.length, topTopic:matches[0]?.topic}));
}
