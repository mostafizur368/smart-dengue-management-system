// Run with: npm run audit:question-bank
// This audit checks the canonical browser question bank without changing it.
global.window = {};
require("../assets/js/dengue-questions.js");

const audit = global.window.dengueQuestionBankAudit;
const index = global.window.dengueQuestionIndex;

console.log("Dengue Question Bank Audit");
console.log("==========================");
console.log(`Topics: ${audit.totalTopics}`);
console.log(`Questions: ${audit.totalQuestions}`);
console.log(`Unique questions: ${audit.uniqueQuestions}`);
console.log(`Duplicates: ${audit.duplicateCount}`);
console.log(`Invalid topics: ${audit.invalidTopics.length}`);
console.log(`Topics missing Bangla/English answers: ${audit.missingAnswers.length}`);
console.log(`Empty questions: ${audit.emptyQuestions.length}`);
console.log(`Stable question IDs generated: ${index.length}`);
console.log(`Result: ${audit.passed ? "PASS" : "FAIL"}`);

if (!audit.passed) {
    console.error(JSON.stringify(audit, null, 2));
    process.exitCode = 1;
}
