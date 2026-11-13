const vm = require("vm");
const fs = require("fs");
const path = require("path");
const context = { window: {}, console };
vm.createContext(context);
for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/community-question-bank.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
}
const added = context.window.mergeApprovedCommunityQuestions([{
  id: "test-approved-1",
  topic: "prevention",
  question: "ডেঙ্গু রোগীর ঘর কীভাবে মশামুক্ত রাখব?",
  answerBn: "ডেঙ্গু রোগীকে মশার কামড় থেকে রক্ষা করুন। মশারি ব্যবহার করুন এবং ঘরের আশপাশে জমে থাকা পানি সরিয়ে ফেলুন।",
  answerEn: "Protect the dengue patient from mosquito bites. Use a mosquito net and remove standing water around the home.",
  status: "approved"
}]);
const mergeOk = added === 1;
console.log(`${mergeOk ? "PASS" : "FAIL"} | approved records merge into live index`);
if (!mergeOk) process.exitCode = 1;

const duplicateAdded = context.window.mergeApprovedCommunityQuestions([{
  id: "test-approved-duplicate",
  topic: "prevention",
  question: "ডেঙ্গু রোগীর ঘর কীভাবে মশামুক্ত রাখব?",
  answerBn: "Duplicate answer Bangla long enough.",
  answerEn: "Duplicate answer English long enough.",
  status: "approved"
}]);
const duplicateOk = duplicateAdded === 0;
console.log(`${duplicateOk ? "PASS" : "FAIL"} | normalized exact duplicates are blocked`);
if (!duplicateOk) process.exitCode = 1;

const matches = context.window.getTopDengueMatches("ডেঙ্গু রোগীর ঘর কীভাবে মশামুক্ত রাখব?", 15);
const found = matches.find(item => item.communityApproved === true);
const searchOk = Boolean(found && found.answerBn && found.answerEn);
console.log(`${searchOk ? "PASS" : "FAIL"} | approved community entries appear in hybrid search`);
if (!searchOk) process.exitCode = 1;

const answer = vm.runInContext(
  'getDengueBankAnswer("ডেঙ্গু রোগীর ঘর কীভাবে মশামুক্ত রাখব?")',
  context
);
const answerOk = answer.includes("মশার কামড় থেকে রক্ষা করুন");
console.log(`${answerOk ? "PASS" : "FAIL"} | approved reviewed answer is returned`);
if (!answerOk) process.exitCode = 1;

const noAnswerAdded = context.window.mergeApprovedCommunityQuestions([{
  id: "bad",
  topic: "prevention",
  question: "Another dengue question that is valid",
  answerBn: "",
  answerEn: "A sufficiently long English answer",
  status: "approved"
}]);
const noAnswerOk = noAnswerAdded === 0;
console.log(`${noAnswerOk ? "PASS" : "FAIL"} | incomplete bilingual answers are not loaded`);
if (!noAnswerOk) process.exitCode = 1;
