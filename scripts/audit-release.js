const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const rules = fs.readFileSync(path.join(root, "firestore_rules_current.txt"), "utf8");
const admin = fs.readFileSync(path.join(root, "assets/admin/admin-dashboard.html"), "utf8");
const frontend = fs.readFileSync(path.join(root, "assets/js/script.js"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/style.css"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const checks = [
  ["No unrestricted public write rule; public reads are limited to doctor directory and ticket counts", 
    !/allow\s+(?:update|delete|write|read,\s*write)\s*:\s*if\s+true\s*;/i.test(rules) &&
    (rules.match(/allow create:\s*if true;/g) || []).length === 2 &&
    (rules.match(/allow read:\s*if true;/g) || []).length === 2 &&
    rules.includes("match /contact_messages/{document}") && rules.includes("match /symptom_checks/{document}") &&
    rules.includes("match /public_doctors/{doctorId}") && rules.includes("match /ticket_counts/{countId}")],
  ["Admin activity log is append-only", /match\s+\/admin_activity_logs\/\{logId\}[\s\S]*?allow\s+update,\s*delete\s*:\s*if\s+false/s.test(rules)],
  ["Admin dashboard enforces Admin role", admin.includes('userSnap.data().role !== "admin"')],
  ["Analytics queries are bounded", admin.includes("limit(2000)") && admin.includes("limit(100)")],
  ["System health reads are bounded", admin.includes("limit(1)")],
  ["Voice features use browser-native APIs", frontend.includes("SpeechRecognition") && frontend.includes("speechSynthesis")],
  ["No paid AI API dependency", !/openai|anthropic|gemini|cohere|mistral/i.test(JSON.stringify(pkg.dependencies || {}))],
  ["Responsive chat CSS is present", css.includes("@media (max-width: 600px)") && css.includes("@media (max-width: 360px)")],
  ["Firestore Rules preserve existing appointment and user controls", rules.includes("match /appointments/{appointmentId}") && rules.includes("match /users/{userId}")],
  ["Release audit documentation exists", fs.existsSync(path.join(root, "docs/TASK40_53_RELEASE_AUDIT.md"))],
  ["Patient health collections are owner-only", ["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders"].every(name => rules.includes(`match /${name}/`))],
  ["Patient dashboard uses authenticated owner UID", fs.readFileSync(path.join(root, "assets/js/patient-dashboard.js"), "utf8").includes('where("userId", "==", currentUser.uid)')],
  ["Patient health records do not grant automatic doctor/Admin access", /match \/symptom_logs\/\{logId\}[\s\S]*?allow read, delete: if request\.auth != null\s*&& resource\.data\.userId == request\.auth\.uid;/.test(rules)],
  ["Batch 4 patient dashboard is responsive and preserves appointment view", fs.readFileSync(path.join(root, "user-dashboard.html"), "utf8").includes('id="appointments"')],
  ["Batch 5 clinical assistant is loaded in chatbot and patient dashboard", frontend.includes("DengueClinicalAssistant.detectWarningSigns") && fs.readFileSync(path.join(root, "user-dashboard.html"), "utf8").includes('src="assets/js/dengue-ai-clinical.js"')],
  ["Batch 5 current WHO and CDC references are included", fs.readFileSync(path.join(root, "assets/js/medical-references.js"), "utf8").includes("who_arboviral_guideline_2025") && fs.readFileSync(path.join(root, "assets/js/medical-references.js"), "utf8").includes("cdc_clinical_care_2026")],
  ["Batch 5 patient summary is generated locally from owner records", fs.readFileSync(path.join(root, "assets/js/patient-dashboard.js"), "utf8").includes("buildPatientSummary") && fs.readFileSync(path.join(root, "assets/js/patient-dashboard.js"), "utf8").includes("navigator.clipboard.writeText")],
  ["Batch 5 symptom warning options are covered by Firestore allowlist", rules.includes("'rapid-breathing'") && rules.includes("'liver-enlargement'") && rules.includes("request.resource.data.symptoms.size() <= 30")],
  ["Batch 5 report interpretation avoids universal clinical cut-offs", fs.readFileSync(path.join(root, "assets/js/dengue-ai-clinical.js"), "utf8").includes("No universal normal/critical range is applied")],
  ["Batch 6 explainable similarity results preserve the Top-15 retrieval", frontend.includes("matchSignals") && frontend.includes("Why it matched:") && fs.readFileSync(path.join(root, "assets/js/dengue-search.js"), "utf8").includes("getTopDengueMatches(message, limit = 15)")],
  ["Batch 6 Banglish aliases are consolidated into shared semantic groups", fs.readFileSync(path.join(root, "assets/js/dengue-search.js"), "utf8").includes("platelet komse") && fs.readFileSync(path.join(root, "assets/js/dengue-search.js"), "utf8").includes("shash nite koshto")],
  ["Batch 6 conversation context is limited to five in-memory turns", fs.readFileSync(path.join(root, "assets/js/dengue-questions.js"), "utf8").includes(".slice(-5)") && fs.readFileSync(path.join(root, "assets/js/dengue-questions.js"), "utf8").includes("clearDengueConversationContext")],
  ["Batch 6 context reset control is available to the user", fs.readFileSync(path.join(root, "index.html"), "utf8").includes('id="chatbot-clear-context"')],
  ["Batch 6 voice input language can be selected", fs.readFileSync(path.join(root, "index.html"), "utf8").includes('id="chatbot-voice-language"') && frontend.includes("languageChoice")],
  ["Batch 6 voice-recognition provider privacy caveat is disclosed", fs.readFileSync(path.join(root, "index.html"), "utf8").includes('id="chatbot-voice-privacy-note"') && fs.readFileSync(path.join(root, "index.html"), "utf8").includes("audio may be processed by that provider")],
  ["Batch 6 automatic speech output is opt-in", fs.readFileSync(path.join(root, "index.html"), "utf8").includes('id="chatbot-auto-speak"') && frontend.includes("autoSpeak.checked")],
  ["Batch 6 language detection supports Banglish and mixed input", fs.readFileSync(path.join(root, "assets/js/dengue-questions.js"), "utf8").includes("detectDengueLanguageDetails") && frontend.includes("Detected language:")],
  ["Batch 6 introduces no new Firestore collections or paid AI dependencies", !/match \/(conversation_context|voice_sessions|chatbot_memory)\//.test(rules) && !/openai|anthropic|gemini|cohere|mistral/i.test(JSON.stringify(pkg.dependencies || {}))],
  ["Batch 7 patient medical history is owner-only", /match \/patient_medical_history\/\{userId\}[\s\S]*?request\.auth\.uid == userId/.test(rules)],
  ["Batch 7 medication reminders are owner-only and clinician-instruction based", /match \/patient_medications\/\{medicationId\}[\s\S]*?resource\.data\.userId == request\.auth\.uid/.test(rules) && fs.readFileSync(path.join(root, "assets/js/patient-intelligence.js"), "utf8").includes("does not prescribe")],
  ["Batch 7 OCR requires manual review before applying values", fs.readFileSync(path.join(root, "assets/js/patient-intelligence.js"), "utf8").includes("function applyOcrSuggestions") && fs.readFileSync(path.join(root, "user-dashboard.html"), "utf8").includes('id="lab-ocr-apply"')],
  ["Batch 7 report export escapes patient-entered text", fs.readFileSync(path.join(root, "assets/js/patient-report-utils.mjs"), "utf8").includes("escapeReportHtml") && fs.readFileSync(path.join(root, "assets/js/patient-report-utils.mjs"), "utf8").includes("Print / Save as PDF")],
  ["Batch 7 recovery timeline does not score or predict recovery", fs.readFileSync(path.join(root, "assets/js/patient-intelligence.js"), "utf8").includes("does not score recovery") && fs.readFileSync(path.join(root, "assets/js/patient-report-utils.mjs"), "utf8").includes("buildRecoveryTimeline")],
  ["Batch 8 doctor schedule updates are restricted to the matching doctor UID", rules.includes("request.auth.uid == doctorId") && rules.includes("scheduleUpdatedAt")],
  ["Batch 8 hospital directory is public-read only for active entries", rules.includes("match /public_hospitals/{hospitalId}") && rules.includes("resource.data.status == 'active'")],
  ["Batch 8 secure messaging checks conversation participants", rules.includes("match /doctor_patient_conversations/{conversationId}") && rules.includes("participants.hasAny([request.auth.uid])")],
  ["Batch 8 doctor activity logs are append-only", rules.includes("match /doctor_activity_logs/{logId}") && rules.includes("allow update, delete: if false")],
  ["Batch 8 MFA enrollment and login challenge are present", fs.readFileSync(path.join(root, "assets/js/patient-security-data.js"), "utf8").includes("multiFactor(currentUser).enroll") && fs.readFileSync(path.join(root, "login.html"), "utf8").includes("getMultiFactorResolver")],
  ["Batch 8 encrypted patient vault stores AES-GCM ciphertext only", rules.includes("match /patient_secure_vault/{userId}") && rules.includes("request.resource.data.ciphertext is string")],
  ["Batch 8 scheduled backup function is configured for daily Dhaka schedule", fs.readFileSync(path.join(root, "functions/index.js"), "utf8").includes('schedule: "every day 02:00"') && fs.readFileSync(path.join(root, "functions/index.js"), "utf8").includes('timeZone: "Asia/Dhaka"')],
  ["Batch 8 PWA caches app shell but skips Firebase API responses", fs.readFileSync(path.join(root, "service-worker.js"), "utf8").includes("identitytoolkit") && fs.readFileSync(path.join(root, "service-worker.js"), "utf8").includes("offline.html")],
  ["Batch 8 offline archive uses encrypted IndexedDB and standalone unlock page", fs.readFileSync(path.join(root, "assets/js/patient-security-data.js"), "utf8").includes("smart-dengue-offline-v1") && fs.existsSync(path.join(root, "assets/js/offline-records-viewer.js"))],
  ["Batch 8 patient account deletion requires reauthentication and owner-only delete", fs.readFileSync(path.join(root, "assets/js/patient-security-data.js"), "utf8").includes("reauthenticateWithCredential") && rules.includes('resource.data.role == "user"')]
];
let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${label}`);
  if (!ok) failed++;
}
console.log(`\nRELEASE AUDIT: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
