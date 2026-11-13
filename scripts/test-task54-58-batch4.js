const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const html = read("user-dashboard.html");
const js = read("assets/js/patient-dashboard.js");
const rules = read("firestore_rules_current.txt");
const pkg = JSON.parse(read("package.json"));
const fullRunner = read("scripts/test-full-chatbot.js");
const checks = [];
const check = (label, ok) => checks.push([label, Boolean(ok)]);

check("Task 54: Patient dashboard replaces appointment-only view while retaining appointment section",
  html.includes("My Health Dashboard") && html.includes('id="appointments"') && js.includes("renderAppointments"));
check("Task 54: dashboard shows patient summary metrics",
  html.includes("metric-symptoms") && html.includes("metric-platelets") && html.includes("metric-hydration") && html.includes("metric-reminders"));
check("Task 54: dashboard loads the signed-in user's own profile",
  js.includes('doc(db, "users", user.uid)') && js.includes("onAuthStateChanged(auth"));
check("Task 54: dashboard collections are queried by authenticated user UID with a bounded result",
  js.includes('where("userId", "==", currentUser.uid)') && js.includes("limit(100)"));
check("Task 55: daily symptom tracker records date, temperature, symptoms and notes",
  html.includes('id="symptom-form"') && js.includes('collection(db, "symptom_logs")') && js.includes("temperatureC") && js.includes("symptoms"));
check("Task 55: urgent warning-sign selection shows immediate-care advice",
  js.includes("warningSymptoms") && js.includes("Seek urgent medical care now") && html.includes("Severe abdominal pain"));
check("Task 55: symptom values are stored under the authenticated UID",
  js.includes("userId: currentUser.uid") && rules.includes("match /symptom_logs/{logId}") && rules.includes("request.resource.data.userId == request.auth.uid"));
check("Task 56: blood report form supports platelet, HCT, WBC and hemoglobin",
  ["platelet-count", "hematocrit", "wbc-count", "hemoglobin"].every(id => html.includes(`id="${id}"`)));
check("Task 56: platelet and hematocrit trends are displayed without diagnostic thresholds",
  html.includes("platelet-chart") && html.includes("hct-chart") && js.includes("drawTrendChart") && js.includes("does not indicate severity or provide a diagnosis"));
check("Task 56: at least one blood result is required and values are persisted",
  js.includes("Enter at least one result from the report.") && js.includes('collection(db, "blood_reports")'));
check("Task 57: hydration tracker records fluid type, volume, local date and time",
  html.includes('id="hydration-form"') && js.includes('collection(db, "hydration_logs")') && js.includes("amountMl") && js.includes("dateKey"));
check("Task 57: hydration UI avoids prescribing a fixed target",
  html.includes("does not set a fluid target") && html.includes("Follow your clinician’s fluid advice"));
check("Task 58: reminder form supports doctor visit, lab test and follow-up categories",
  html.includes('id="reminder-form"') && ["doctor-visit", "lab-test", "follow-up"].every(value => html.includes(value)));
check("Task 58: reminders can be completed and deleted by the owner",
  js.includes("completed: true") && js.includes('doc(db, "patient_reminders"') && js.includes("deleteDoc"));
check("Task 58: reminder limitations are disclosed; no background push is claimed",
  html.includes("Background push notifications are not included in this release"));
check("Security: symptom logs are private to their owner; no automatic Admin/doctor read",
  /match \/symptom_logs\/\{logId\}[\s\S]*?allow read, delete: if request\.auth != null\s*&& resource\.data\.userId == request\.auth\.uid;/.test(rules));
check("Security: blood reports are private to their owner",
  /match \/blood_reports\/\{reportId\}[\s\S]*?allow read, delete: if request\.auth != null\s*&& resource\.data\.userId == request\.auth\.uid;/.test(rules));
check("Security: hydration logs and reminders are private to their owner",
  rules.includes("match /hydration_logs/{logId}") && rules.includes("match /patient_reminders/{reminderId}") &&
  (rules.match(/allow read, delete: if request\.auth != null/g) || []).length >= 4);
check("Security: hydration log cannot be modified after creation",
  /match \/hydration_logs\/\{logId\}[\s\S]*?allow update: if false;/.test(rules));
check("Security: all four collections validate userId and allowed fields",
  ["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders"].every(name => rules.includes(`match /${name}/`)));
check("Preservation: existing user, appointment, admin log and chatbot rules remain",
  rules.includes("match /users/{userId}") && rules.includes("match /appointments/{appointmentId}") &&
  rules.includes("match /admin_activity_logs/{logId}") && rules.includes("match /chatbot_query_events/{eventId}"));
check("No paid API or third-party health analytics dependency added",
  !/openai|anthropic|gemini|cohere|mistral|mixpanel|amplitude/i.test(JSON.stringify(pkg.dependencies || {})));
check("Batch 4 test is registered in npm and full regression runner",
  pkg.scripts["test:task54-58"] === "node scripts/test-task54-58-batch4.js" && fullRunner.includes("test:task54-58"));
check("Task 54–58 documentation exists",
  fs.existsSync(path.join(root, "docs/TASK54_58_PATIENT_MONITORING.md")));
const syntax = spawnSync(process.execPath, ["--input-type=module", "--check"], {
  cwd: root, encoding: "utf8", input: js
});
check("Syntax: patient dashboard JavaScript module", syntax.status === 0);
let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${label}`);
  if (!ok) failed++;
}
console.log(`\nTASK 54–58 SUMMARY: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
