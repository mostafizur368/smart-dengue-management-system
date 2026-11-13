const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const moduleSource = read("assets/js/dengue-ai-clinical.js");
const context = vm.createContext({ window: {} });
vm.runInContext(moduleSource, context);
const assistant = context.window.DengueClinicalAssistant;
const html = read("user-dashboard.html");
const patient = read("assets/js/patient-dashboard.js");
const chatbot = read("assets/js/script.js");
const refs = read("assets/js/medical-references.js");
const rules = read("firestore_rules_current.txt");
const pkg = JSON.parse(read("package.json"));
const runner = read("scripts/test-full-chatbot.js");
const checks = [];
const check = (label, ok) => checks.push([label, Boolean(ok)]);

const englishWarning = assistant.detectWarningSigns("I have severe abdominal pain and persistent vomiting");
const banglaWarning = assistant.detectWarningSigns("আমার তীব্র পেটব্যথা হচ্ছে");
const negatedEnglish = assistant.detectWarningSigns("I do not have severe abdominal pain");
const negatedBangla = assistant.detectWarningSigns("তীব্র পেটব্যথা নেই");
check("Task 59: detects severe abdominal pain and persistent vomiting in English", englishWarning.hasWarningSigns && englishWarning.signals.length >= 2);
check("Task 59: detects Bangla warning-sign descriptions", banglaWarning.hasWarningSigns && banglaWarning.signals.some(item => item.id === "severe_abdominal_pain"));
check("Task 59: does not flag explicitly negated English symptoms", !negatedEnglish.hasWarningSigns);
check("Task 59: does not flag explicitly negated Bangla symptoms", !negatedBangla.hasWarningSigns);
const savedWarning = assistant.assessPatientWarningSigns([
  { logDate: "2026-11-12", symptoms: ["fainting", "rapid-breathing"] },
  { logDate: "2026-11-13", symptoms: ["fever"] }
]);
check("Task 59: patient dashboard assessment detects saved warning-sign selections", savedWarning.hasWarningSigns && savedWarning.signals.length === 2);
check("Task 59: chatbot emergency alert integrates advanced warning-sign detector",
  chatbot.includes("DengueClinicalAssistant.detectWarningSigns") && chatbot.includes("mergedSignals"));
check("Task 59: dashboard warning review explicitly avoids diagnosis/risk scoring",
  html.includes("not a risk score or diagnosis") && patient.includes("not a diagnosis, risk score"));

const paired = assistant.interpretBloodReports([
  { reportDate: "2026-11-11", plateletCount: 180, hematocrit: 38, wbcCount: 4.5, hemoglobin: 13.1 },
  { reportDate: "2026-11-13", plateletCount: 120, hematocrit: 43, wbcCount: 3.8, hemoglobin: 13.0 }
]);
const plateletOnly = assistant.interpretBloodReports([
  { reportDate: "2026-11-11", plateletCount: 180, hematocrit: 38 },
  { reportDate: "2026-11-13", plateletCount: 120, hematocrit: 38 }
]);
check("Task 60: detects paired rising-HCT and falling-platelet pattern for clinician review",
  paired.pairedTrendFlag && paired.lines.some(line => line.includes("contact the treating clinician promptly")));
check("Task 60: platelet decline alone is not labeled dengue severity",
  !plateletOnly.pairedTrendFlag && plateletOnly.lines.some(line => line.includes("does not determine dengue severity")));
check("Task 60: report interpretation does not apply generic normal/critical thresholds",
  paired.disclaimer.includes("No universal normal/critical range is applied") && !paired.lines.some(line => /normal range|critical platelet/i.test(line)));
check("Task 60: dashboard renders report interpretation and preserves platelet/HCT trend charts",
  html.includes('id="blood-interpretation-panel"') && html.includes('id="platelet-chart"') && html.includes('id="hct-chart"'));
check("Task 60: app requires clinician review for paired lab pattern and explains timing/context limits",
  paired.lines.some(line => line.includes("cannot verify measurement timing")));

const sources = assistant.getSources();
check("Task 61: includes current WHO 2025 arboviral clinical guideline",
  sources.some(source => source.id === "who_arboviral_guideline_2025" && source.url.startsWith("https://www.who.int/")));
check("Task 61: includes current CDC clinical-care guidance updated in 2026",
  sources.some(source => source.id === "cdc_clinical_care_2026" && source.publicationDate === "2026-04-15"));
const sourceContext = vm.createContext({ window: {} });
vm.runInContext(refs, sourceContext);
const linked = sourceContext.window.getMedicalReferencesForAnswer({ topic: "warning", answerBn: "example", answerEn: "example" });
check("Task 61: chatbot medical reference registry returns relevant official sources",
  linked.some(source => source.id === "who_arboviral_guideline_2025") && linked.some(source => source.id === "cdc_clinical_care_2026"));
check("Task 61: chatbot displays source publication date and clinical-review disclaimer",
  chatbot.includes("Published ${source.publicationDate}") && chatbot.includes("does not mean this specific answer has been clinically verified"));
check("Task 61: source links open securely in a new tab",
  chatbot.includes('link.target = "_blank"') && chatbot.includes('link.rel = "noopener noreferrer"'));

const summary = assistant.buildPatientSummary({
  symptoms: [{ logDate: "2026-11-13", temperatureC: 38, symptoms: ["fever", "headache"], notes: "Tired" }],
  bloodReports: [{ reportDate: "2026-11-13", plateletCount: 150, hematocrit: 40, wbcCount: 4.1, hemoglobin: 13.4, labName: "Test Lab" }],
  hydration: [{ dateKey: "2026-11-13", amountMl: 250 }, { dateKey: "2026-11-13", amountMl: 300 }],
  reminders: [{ title: "CBC follow-up", dueAt: "2026-11-14T10:00:00.000Z", completed: false }]
});
check("Task 62: patient summary includes symptom history and measured temperature",
  summary.includes("SYMPtOMS") === false && summary.includes("SYMPTOMS — LAST 7 DAYS") && summary.includes("38 °C"));
check("Task 62: patient summary includes platelet, HCT, WBC and hemoglobin values",
  summary.includes("150 ×10⁹/L") && summary.includes("40%") && summary.includes("4.1 ×10⁹/L") && summary.includes("13.4 g/dL"));
check("Task 62: patient summary includes hydration and pending follow-up reminder",
  summary.includes("550 mL") && summary.includes("CBC follow-up"));
check("Task 62: patient summary carries a non-diagnostic disclaimer",
  summary.includes("not a diagnosis") && summary.includes("not a prescribed fluid target"));
check("Task 62: dashboard provides generate, copy and print actions",
  ["generate-patient-summary", "copy-patient-summary", "print-patient-summary"].every(id => html.includes(`id="${id}"`)));
check("Security: new symptom choices are accepted only under patient-owned records",
  rules.includes("'rapid-breathing'") && rules.includes("'fainting'") && rules.includes("request.resource.data.userId == request.auth.uid"));
check("Security: symptom allowlist supports all additional warning signs and has a safe size bound",
  rules.includes("'fluid-accumulation'") && rules.includes("'liver-enlargement'") && rules.includes("request.resource.data.symptoms.size() <= 30"));
check("Preservation: existing Batch 4 health collections and appointment routes remain",
  ["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders", "appointments"].every(name => rules.includes(`match /${name}/`) || name === "appointments" && rules.includes("match /appointments/")));
check("No paid AI API dependency added",
  !/openai|anthropic|gemini|cohere|mistral/i.test(JSON.stringify(pkg.dependencies || {})));
check("Batch 5 tests are registered in npm and full regression runner",
  pkg.scripts["test:task59-62"] === "node scripts/test-task59-62-batch5.js" && runner.includes("test:task59-62"));
check("Clinical assistant module is loaded on chatbot and patient dashboard",
  read("index.html").includes('src="assets/js/dengue-ai-clinical.js"') && html.includes('src="assets/js/dengue-ai-clinical.js"'));

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? "PASS" : "FAIL"} | ${label}`));
console.log(`\nTASK 59–62 SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
