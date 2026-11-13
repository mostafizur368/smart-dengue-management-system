
const vm = require('vm');
const fs = require('fs');
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/js/dengue-questions.js','utf8'), ctx);
vm.runInContext(fs.readFileSync('assets/js/dengue-search.js','utf8'), ctx);
const tests = [
  'ডেঙ্গুর লক্ষণ কী?',
  'ডেঙ্গু হলে কী খাবার খাওয়া উচিত?',
  'What are the warning signs of dengue?',
  'ডেঙ্গু কি একজন থেকে আরেকজনে ছড়ায়?',
  'ডেঙ্গুতে প্লেটলেট কমে গেলে কী করব?'
];
for (const q of tests) {
  const results = ctx.window.searchDengueCandidates(q, 5);
  console.log(JSON.stringify({q, top: results.slice(0,3).map(x=>({topic:x.topic,score:x.similarityPercent,question:x.question}))}));
}
console.log('audit',ctx.window.dengueQuestionBankAudit.passed,'engine',ctx.window.dengueSearchEngineInfo);
