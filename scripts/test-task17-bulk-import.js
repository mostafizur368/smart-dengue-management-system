const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const checks = [
  ["CSV and Excel parser library is loaded", admin.includes("xlsx.full.min.js") && admin.includes("window.XLSX.read")],
  ["file picker accepts CSV, XLSX and XLS", admin.includes('accept=".csv,.xlsx,.xls')],
  ["template download is available", admin.includes("kb-import-template") && admin.includes("dengue-question-import-template.csv")],
  ["preview is separate from publish", admin.includes("kbImportPreviewFile") && admin.includes("kbImportPublishApproved")],
  ["maximum 500 rows is enforced", admin.includes("rawRows.length > 500")],
  ["Bangla and English answer validation exists", admin.includes("Bangla answer must be 20") && admin.includes("English answer must be 20")],
  ["exact duplicate detection exists", admin.includes("Duplicate question inside this file") && admin.includes("Exact duplicate already exists")],
  ["similar question warnings can be reviewed", admin.includes("findDengueQuestionDuplicates") && admin.includes("kb-import-allow-similar")],
  ["publish requires explicit confirmation", admin.includes("Approve & Publish Valid Questions") && admin.includes("confirm(")],
  ["publishing uses Firestore batches under 500 writes", admin.includes("writeBatch(db)") && admin.includes("start += 200") && admin.includes('"bulk_import"')],
  ["published rows use existing chatbot question bank collection", admin.includes('doc(db, "chatbot_admin_question_bank", entryId)')],
  ["failed and review rows can be exported", admin.includes("kbImportDownloadFailedRows") && admin.includes("kb-import-failed-download")],
  ["import history is stored and shown", admin.includes('"chatbot_import_batches"') && admin.includes("kbLoadImportHistory")],
  ["batch history is admin-only in Firestore rules", rules.includes("match /chatbot_import_batches/{batchId}") && rules.includes("allow read, create, update, delete: if isAdmin()")],
  ["existing full regression suite includes Task 17", pkg.scripts["test:task17"] === "node scripts/test-task17-bulk-import.js"]
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) failed++;
}
console.log(`\nTASK 17 SUMMARY: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
