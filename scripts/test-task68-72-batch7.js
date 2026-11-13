const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const check = (label, ok) => checks.push([label, Boolean(ok)]);

(async () => {
  const utils = await import(path.join(root, "assets/js/patient-report-utils.mjs"));
  const html = read("user-dashboard.html");
  const module = read("assets/js/patient-intelligence.js");
  const rules = read("firestore_rules_current.txt");
  const packageJson = JSON.parse(read("package.json"));
  const fullRunner = read("scripts/test-full-chatbot.js");
  const audit = read("scripts/audit-release.js");

  const englishOcr = utils.extractLabValuesFromOcr(
    "Platelet Count: 150,000 /uL\nHCT: 42%\nWBC: 4,500 /uL\nHemoglobin: 13.5 g/dL"
  );
  check("Task 69: English OCR text suggests platelet, HCT, WBC and hemoglobin values",
    englishOcr.count === 4 &&
    englishOcr.suggestions.plateletCount.value === "150" &&
    englishOcr.suggestions.hematocrit.value === "42" &&
    englishOcr.suggestions.wbcCount.value === "4.5" &&
    englishOcr.suggestions.hemoglobin.value === "13.5");
  check("Task 69: count conversion uses printed per-microlitre units and discloses conversion",
    englishOcr.suggestions.plateletCount.note.includes("verify the printed unit") &&
    englishOcr.suggestions.wbcCount.value === "4.5");
  const banglaOcr = utils.extractLabValuesFromOcr(
    "প্লেটলেট ১৫০০০০ /cmm\nহেমাটোক্রিট ৪২%\nWBC ৪৫০০ /uL\nহিমোগ্লোবিন ১৩.৫ g/dL"
  );
  check("Task 69: Bangla labels and Bengali numerals are supported",
    banglaOcr.count === 4 && banglaOcr.suggestions.plateletCount.value === "150" &&
    banglaOcr.suggestions.hematocrit.value === "42");
  const ambiguousOcr = utils.extractLabValuesFromOcr("Platelet: 150000\nHCT: 42%");
  check("Task 69: ambiguous platelet units are not auto-converted",
    !ambiguousOcr.suggestions.plateletCount && ambiguousOcr.warnings.some(x => x.includes("ambiguous")));
  const emptyOcr = utils.extractLabValuesFromOcr("Patient name: Test\nHospital: Sample");
  check("Task 69: OCR does not invent values when labels are missing",
    emptyOcr.count === 0 && emptyOcr.warnings.length > 0);
  check("Task 69: OCR UI supports English and Bangla, preview and manual apply",
    html.includes('id="lab-ocr-language"') && html.includes('value="eng+ben"') &&
    html.includes('id="lab-ocr-preview"') && html.includes('id="lab-ocr-apply"') &&
    module.includes('addEventListener("click", applyOcrSuggestions)') &&
    module.includes("applyOcrSuggestions"));
  check("Task 69: OCR file size/type is validated and nothing is saved automatically",
    module.includes("8 * 1024 * 1024") &&
    module.includes("image/jpeg") && module.includes("image/png") &&
    module.includes("image/webp") &&
    !module.slice(module.indexOf("async function runLabOcr"), module.indexOf("function applyOcrSuggestions")).includes("addDoc("));
  check("Task 69: OCR is client-side and does not upload report images",
    module.includes("window.Tesseract.recognize") &&
    !module.slice(module.indexOf("async function runLabOcr"), module.indexOf("function applyOcrSuggestions")).includes("uploadBytes"));

  const timeline = utils.buildRecoveryTimeline({
    symptoms: [{ logDate: "2026-11-12", symptoms: ["fever", "headache"], temperatureC: 38 }],
    reports: [{ reportDate: "2026-11-13", plateletCount: 150, hematocrit: 42, wbcCount: 4.5 }],
    hydration: [{ dateKey: "2026-11-13", amountMl: 250, fluidType: "water" }]
  });
  check("Task 71: timeline merges symptoms, reports and hydration records",
    timeline.length === 3 && timeline.some(x => x.kind === "Symptom log") &&
    timeline.some(x => x.kind === "Blood report") && timeline.some(x => x.kind === "Fluid log"));
  check("Task 71: timeline is newest-first and preserves entered values",
    timeline[0].date === "2026-11-13" && timeline.some(x => x.detail.includes("Platelets 150")));
  check("Task 71: timeline makes no recovery prediction or clinical severity score",
    module.includes("does not score recovery") && html.includes("does not calculate a recovery score"));

  const reportHtml = utils.buildPatientReportHtml({
    patientLabel: "Test Patient",
    generatedAt: "2026-11-14T00:00:00.000Z",
    history: { conditions: "<script>alert(1)</script>", allergies: "None reported", emergencyContact: "Test Contact" },
    symptoms: [{ logDate: "2026-11-13", symptoms: ["fever"], temperatureC: 38.1, notes: "<img src=x>" }],
    reports: [{ reportDate: "2026-11-13", plateletCount: 150, hematocrit: 42, wbcCount: 4.5, hemoglobin: 13.5, labName: "Sample Lab" }],
    hydration: [{ dateKey: "2026-11-13", amountMl: 250, fluidType: "water", note: "After lunch" }],
    medications: [{ name: "Example medicine", dose: "As prescribed", schedule: "As prescribed", nextReminderAt: "2026-11-14T08:00:00.000Z", active: true }]
  });
  check("Task 72: PDF-ready report contains medical history and emergency contact",
    reportHtml.includes("Medical history") && reportHtml.includes("Test Contact"));
  check("Task 72: PDF-ready report includes blood reports, symptoms, fluids and medication reminders",
    ["Blood reports", "Symptom history", "Fluid records", "Active medication reminders"].every(x => reportHtml.includes(x)));
  check("Task 72: patient-entered HTML is escaped in the printable report",
    reportHtml.includes("&lt;script&gt;alert(1)&lt;/script&gt;") &&
    reportHtml.includes("&lt;img src=x&gt;") && !reportHtml.includes("<script>alert(1)</script>"));
  check("Task 72: print/save as PDF action is available",
    reportHtml.includes("Print / Save as PDF") && reportHtml.includes("window.print()"));
  check("Task 72: report includes a non-diagnostic medical disclaimer",
    reportHtml.includes("not a diagnosis") && reportHtml.includes("consult a qualified clinician"));

  check("Task 68: medical history form includes conditions, allergies, notes and emergency contact",
    ["medical-conditions", "medical-allergies", "medical-history-notes", "medical-emergency-contact"].every(id => html.includes(`id="${id}"`)));
  check("Task 68: medical history is saved under the signed-in user's document",
    module.includes('doc(db, "patient_medical_history", currentUser.uid)') &&
    module.includes("userId: currentUser.uid"));
  check("Task 68: Firestore Rules restrict medical history to its owner",
    /match \/patient_medical_history\/\{userId\}[\s\S]*?allow read: if request\.auth != null && request\.auth\.uid == userId;[\s\S]*?allow delete: if request\.auth != null && request\.auth\.uid == userId;/.test(rules));

  check("Task 70: medicine form requires clinician instruction, schedule and next reminder time",
    ["medication-name", "medication-dose", "medication-schedule", "medication-next-reminder"].every(id => html.includes(`id="${id}"`)));
  check("Task 70: medication reminders are owner-scoped and validate nextReminderAt",
    /match \/patient_medications\/\{medicationId\}[\s\S]*?resource\.data\.userId == request\.auth\.uid;[\s\S]*?request\.resource\.data\.nextReminderAt is string/.test(rules));
  check("Task 70: browser notification permission is requested only by an explicit user action",
    module.includes('addEventListener("click", enableMedicationNotifications)') &&
    module.includes("Notification.requestPermission()"));
  check("Task 70: UI discloses one-time reminders and no background push/repeated prescription",
    html.includes("One-time reminder") && html.includes("does not recommend medicines") &&
    html.includes("only while this dashboard is open") &&
    module.includes("or repeat the reminder automatically"));

  check("Batch 7: all five sections are present in the patient dashboard",
    ["medical-history", "lab-ocr-section", "medications", "recovery-progress", "patient-pdf-report"].every(id => html.includes(`id="${id}"`)));
  check("Batch 7: patient intelligence module is loaded after the existing dashboard",
    html.indexOf('src="assets/js/patient-dashboard.js"') < html.indexOf('src="assets/js/patient-intelligence.js"'));
  check("Batch 7: uses the existing Firebase project configuration",
    module.includes('projectId: "smart-dengue-management-system"') &&
    module.includes('appId: "1:164368465699:web:79fe552bea0b2bfc405696"'));
  check("Batch 7: no paid AI/OCR provider dependency is added",
    !/openai|anthropic|gemini|cohere|mistral|google-cloud-vision/i.test(JSON.stringify(packageJson.dependencies || {})));
  check("Batch 7: new Firestore collections are limited to private history and medication reminders",
    (rules.match(/match \/patient_medical_history\//g) || []).length === 1 &&
    (rules.match(/match \/patient_medications\//g) || []).length === 1);
  check("Batch 7 test is registered in npm and full regression suite",
    packageJson.scripts["test:task68-72"] === "node scripts/test-task68-72-batch7.js" &&
    fullRunner.includes('["test:task68-72", "scripts/test-task68-72-batch7.js"]'));
  check("Release audit checks Task 68–72 owner privacy and OCR review flow",
    audit.includes("Batch 7 patient medical history is owner-only") &&
    audit.includes("Batch 7 OCR requires manual review before applying values"));

  const syntaxFiles = ["assets/js/patient-intelligence.js", "assets/js/patient-dashboard.js"];
  let syntaxOk = true;
  for (const file of syntaxFiles) {
    const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
      cwd: root, encoding: "utf8", input: read(file)
    });
    if (result.status !== 0) {
      syntaxOk = false;
      console.log(result.stderr);
    }
  }
  check("Batch 7 JavaScript module syntax is valid", syntaxOk);

  const failed = checks.filter(([, ok]) => !ok);
  checks.forEach(([label, ok]) => console.log(`${ok ? "PASS" : "FAIL"} | ${label}`));
  console.log(`\nTASK 68–72 SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
  if (failed.length) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
