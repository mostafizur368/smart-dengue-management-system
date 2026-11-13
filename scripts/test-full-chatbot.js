const { spawnSync } = require("child_process");
const path = require("path");

const checks = [
  ["audit:question-bank", "scripts/audit-question-bank.js"],
  ["test:hybrid-search", "scripts/test-hybrid-search.js"],
  ["test:top15", "scripts/test-top15-ranking.js"],
  ["test:top15-answer", "scripts/test-top15-answer-flow.js"],
  ["test:body-pain-intents", "scripts/test-body-pain-intents.js"],
  ["test:symptom-intents", "scripts/test-symptom-intents.js"],
  ["test:platelet-reports", "scripts/test-platelet-reports.js"],
  ["test:food-nutrition", "scripts/test-food-nutrition-intents.js"],
  ["test:medicine-safety", "scripts/test-medicine-safety-intents.js"],
  ["test:emergency", "scripts/test-emergency-intents.js"],
  ["test:recovery-prevention", "scripts/test-recovery-prevention-intents.js"],
  ["test:task10-integration", "scripts/test-task10-integration.js"],
  ["test:task11", "scripts/test-task11-production-upgrade.js"],
  ["test:task12", "scripts/test-task12-community-question-bank.js"],
  ["test:task13", "scripts/test-task13-semantic-duplicates.js"],
  ["test:task14", "scripts/test-task14-answer-improvement.js"],
  ["test:task15", "scripts/test-task15-chatbot-analytics.js"],
  ["test:task16", "scripts/test-task16-knowledge-management.js"],
  ["test:task17", "scripts/test-task17-bulk-import.js"],
  ["test:task18-28", "scripts/test-task18-28-batch1.js"],
  ["test:task29-39", "scripts/test-task29-39-batch2.js"],
  ["test:task40-53", "scripts/test-task40-53-batch3.js"],
  ["test:task54-58", "scripts/test-task54-58-batch4.js"],
  ["test:task59-62", "scripts/test-task59-62-batch5.js"],
  ["test:task63-67", "scripts/test-task63-67-batch6.js"],
  ["test:task68-72", "scripts/test-task68-72-batch7.js"],
  ["test:task73-92", "scripts/test-task73-92.js"],
  ["test:chatbot-ui", "scripts/test-chatbot-ui-layout.js"]
];

let failed = 0;
for (const [name, script] of checks) {
  process.stdout.write(`\n=== ${name} ===\n`);
  const result = spawnSync(process.execPath, [path.join(__dirname, path.basename(script))], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    timeout: 60000
  });
  if (result.status !== 0) {
    failed++;
    const reason = result.error && result.error.code === "ETIMEDOUT" ? " — timed out after 60 seconds" : "";
    process.stdout.write(`RESULT: FAIL (${name})${reason}\n`);
  } else {
    process.stdout.write(`RESULT: PASS (${name})\n`);
  }
}
process.stdout.write(`\nFULL CHATBOT TEST SUMMARY: ${checks.length - failed}/${checks.length} suites passed.\n`);
if (failed) process.exitCode = 1;
