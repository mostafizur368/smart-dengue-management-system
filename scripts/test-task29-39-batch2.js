const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const checks = [];
function check(name, ok) { checks.push([name, Boolean(ok)]); }
function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }

const context = { window: {}, console, Set, Map, Math, String, Array, Number, Date, RegExp };
context.window = context;
vm.createContext(context);
for (const file of [
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/community-question-bank.js",
  "assets/js/chatbot-intelligence.js",
  "assets/js/medical-safety.js",
  "assets/js/medical-references.js",
  "assets/js/chatbot-quality.js",
  "assets/js/answer-overrides.js"
]) vm.runInContext(read(file), context, { filename: file });

// Task 29 — confidence is retrieval relevance, not clinical certainty.
const exactConfidence = context.window.getChatbotAnswerQuality("ডেঙ্গুর লক্ষণ কী?");
const unrelatedConfidence = context.window.getChatbotAnswerQuality("What is the capital of France?");
check("Task 29: exact dengue question receives high retrieval confidence", exactConfidence.level === "high" && exactConfidence.score >= 65);
check("Task 29: unrelated question receives low confidence and no match", unrelatedConfidence.level === "low" && unrelatedConfidence.matchCount === 0);
check("Task 29: confidence is explicitly not a medical-certainty score", exactConfidence.meaning === "retrieval_relevance_only");
check("Task 29: unrelated question uses safe dengue-only fallback", context.getDengueBankAnswer("What is the capital of France?").toLowerCase().includes("only answer dengue-related"));

// Task 30 — topic-aware suggested follow-ups.
const followUps = context.window.getChatbotSuggestedFollowUps("ডেঙ্গুর লক্ষণ কী?", 3);
check("Task 30: matched dengue topic returns three follow-up prompts", followUps.length === 3 && followUps.every(item => typeof item === "string" && item.length > 8));
check("Task 30: unmatched question does not show unrelated follow-ups", context.window.getChatbotSuggestedFollowUps("capital of France", 3).length === 0);

// Task 31 — automated safety audit never claims clinical verification.
const dosageAudit = context.window.assessMedicalAnswer({
  topic: "medicine", question: "Can I take paracetamol?",
  answerBn: "প্রতিদিন ৫০০ mg ওষুধ নিন। চিকিৎসকের সঙ্গে কথা বলুন।",
  answerEn: "Take 500 mg daily. Talk to a clinician before use."
});
check("Task 31: specific dosage is flagged for clinician review", dosageAudit.status === "needs_clinician_review" && dosageAudit.warnings.some(item => item.includes("quantity")));
const cleanAudit = context.window.assessMedicalAnswer({
  topic: "symptoms", question: "What are dengue symptoms?",
  answerBn: "ডেঙ্গুর সাধারণ লক্ষণগুলোর মধ্যে জ্বর, মাথাব্যথা ও শরীর ব্যথা থাকতে পারে।",
  answerEn: "Common dengue symptoms may include fever, headache and body aches."
});
check("Task 31: clean text only passes automated checks, not clinical verification", cleanAudit.status === "automated_checks_passed_not_clinically_verified" && cleanAudit.clinicalVerification === "not_established_by_automated_checks");

// Task 32 — official source registry and answer mapping.
const defaultSources = context.window.getMedicalSourceRegistry();
check("Task 32: built-in DGHS, CDC and WHO reference links are available", defaultSources.some(item => item.id === "dghs_dengue_2025") && defaultSources.some(item => item.id === "cdc_clinical_care") && defaultSources.some(item => item.id === "who_dengue"));
const symptomMatch = context.window.getTopDengueMatches("ডেঙ্গুর লক্ষণ কী?", 1)[0];
check("Task 32: answer topic resolves related official references", context.window.getMedicalReferencesForAnswer(symptomMatch).length >= 1);
const adminSourceText = read("assets/admin/admin-dashboard.html");
check("Task 32: source IDs can be attached to and exported with Question Bank entries", adminSourceText.includes("kb-source-ids") && adminSourceText.includes("sourceIds: Array.isArray(item.sourceIds)") && adminSourceText.includes("sourceids"));

// Task 33 — emergency signals and negation/contrast.
const emergency = context.window.detectDengueEmergencySignals("The patient has severe abdominal pain and persistent vomiting");
const negated = context.window.detectDengueEmergencySignals("I have no bleeding and no severe abdominal pain");
const banglaNegatedBleeding = context.window.detectDengueEmergencySignals("মাড়ি দিয়ে রক্তপাত নেই");
const contrast = context.window.detectDengueEmergencySignals("No bleeding but severe abdominal pain now");
const positiveAfterNegatedClause = context.window.detectDengueEmergencySignals("No fever and severe abdominal pain");
const directNegation = context.window.detectDengueEmergencySignals("I do not have severe abdominal pain");
const banglish = context.window.detectDengueEmergencySignals("dengu te shash kosto hocche");
check("Task 33: active warning signs trigger urgent-care signal", emergency.isEmergency && emergency.signals.length >= 2);
check("Task 33: negated warning signs do not trigger false emergency", !negated.isEmergency);
check("Task 33: Bangla bleeding negation does not trigger false emergency", !banglaNegatedBleeding.isEmergency);
check("Task 33: contrast clause does not suppress a real warning sign", contrast.isEmergency && contrast.signals.some(item => item.id === "severe_abdominal_pain"));
check("Task 33: an unrelated negated symptom does not suppress a positive warning sign", positiveAfterNegatedClause.isEmergency);
check("Task 33: direct English negation is respected", !directNegation.isEmergency);
check("Task 33: Banglish breathing difficulty is detected", banglish.isEmergency && banglish.signals[0].id === "breathing_difficulty");

// Task 34 — medicine risk prompts.
const nsaid = context.window.detectDengueMedicineRisks("Can I take ibuprofen with dengue?");
const childDose = context.window.detectDengueMedicineRisks("Can I give my child a 5 ml dose?");
const paracetamol = context.window.detectDengueMedicineRisks("Can I take paracetamol?");
check("Task 34: NSAIDs trigger bleeding-risk warning", nsaid.warnings.some(item => item.id === "nsaid_bleeding_risk"));
check("Task 34: child-specific dose triggers clinician warning", childDose.warnings.some(item => item.id === "child_dose_requires_clinician"));
check("Task 34: paracetamol triggers duplicate/overdose caution", paracetamol.warnings.some(item => item.id === "paracetamol_dose_caution"));

// Task 36 — fingerprinted approvals expire and invalidate when content changes.
const fingerprint = context.window.getMedicalAnswerFingerprint("বাংলা উত্তর", "English answer");
const match = { id: "question-1", answerBn: "বাংলা উত্তর", answerEn: "English answer" };
context.window.approvedMedicalReviews = [{
  sourceEntryId: "question-1", answerFingerprint: fingerprint,
  reviewerName: "Clinical Reviewer", reviewedAtClient: new Date().toISOString(),
  reviewDueAt: new Date(Date.now() + 86400000).toISOString(), reviewedSourceIds: ["dghs_dengue_2025"]
}];
check("Task 36: matching current approval is recognized as clinician-reviewed", context.window.getMedicalAnswerReviewStatus(match).status === "verified");
check("Task 36: edited answer invalidates old approval", context.window.getMedicalAnswerReviewStatus({ ...match, answerEn: "Edited answer" }).status === "outdated");
context.window.approvedMedicalReviews[0].reviewDueAt = new Date(Date.now() + 86400000).toISOString();
context.window.loadMedicalSourceRegistry([{
  id: "dghs_dengue_2025", title: "DGHS source", organization: "DGHS",
  url: "https://dghs.gov.bd/example", topics: ["symptoms"], status: "active",
  reviewDueAt: new Date(Date.now() - 86400000).toISOString()
}]);
check("Task 36: overdue source used by a review makes the answer outdated", context.window.getMedicalAnswerReviewStatus(match).status === "outdated");
context.window.approvedMedicalReviews[0].reviewDueAt = new Date(Date.now() - 86400000).toISOString();
check("Task 36: overdue clinical review is marked outdated", context.window.getMedicalAnswerReviewStatus(match).status === "outdated");

// Task 37 — clinician approval records and Admin workflow.
const admin = read("assets/admin/admin-dashboard.html");
const doctorDashboard = read("assets/doctor/doctor-dashboard.html");
const rules = read("firestore_rules_current.txt");
check("Task 37: Admin can enable reviewers and assign review requests", admin.includes("clinical-reviewer-access-form") && admin.includes("clinical-reviewer-disable") && admin.includes("kbCreateClinicalReview") && admin.includes("chatbot_clinical_reviews"));
check("Task 37: clinician dashboard requires reviewer permission and records source checks", doctorDashboard.includes("profile.clinicalReviewer === true") && doctorDashboard.includes("reviewedSourceIds") && doctorDashboard.includes("loadAssignedClinicalReviews"));
check("Task 37: Firestore restricts reviews to assigned clinicians and Admins", rules.includes("function isAssignedClinicalReviewer()") && rules.includes("resource.data.assignedReviewerUid == request.auth.uid") && rules.includes("reviewerNotes.size() >= 10"));
check("Task 37: approved clinical review is public-readable, but reviewer cannot edit answer content", rules.includes("resource.data.status == 'approved'") && rules.includes("'status', 'reviewDecision', 'reviewerNotes', 'reviewedSourceIds'") && rules.includes("allow delete: if isAdmin()"));

// Task 35 — only explicitly verified doctors can be recommended.
const doctors = read("assets/js/doctors.js");
const frontend = read("assets/js/script.js");
check("Task 35: chatbot doctor recommendations require Admin verification and BMDC number", doctors.includes("data.chatbotVerified === true") && doctors.includes("bmdcRegistrationNumber") && frontend.includes("window.chatbotVerifiedDoctors"));
check("Task 35: fake placeholder doctors are removed from directory seed", !doctors.includes("Dr. Doctor One") && doctors.includes("const doctors = [];"));
check("Task 35: Admin-created doctor profiles enter public directory as unverified", admin.includes('doc(db, "public_doctors", uid)') && admin.includes('chatbotVerified: false'));
check("Task 35: emergency cases are routed to emergency department, not appointment booking", frontend.includes("Do not wait for an appointment") && frontend.includes("addDoctorRecommendation"));

// Task 38 — explicit opt-in, local-only history and clear action.
const index = read("index.html");
check("Task 38: local chat history is off by default and requires explicit consent", index.includes("id=\"chatbot-save-history\"") && frontend.includes("CHAT_HISTORY_CONSENT_KEY") && frontend.includes("toggle.checked = localStorage.getItem"));
check("Task 38: history can be cleared from this browser", index.includes("id=\"chatbot-clear-history\"") && frontend.includes("localStorage.removeItem(CHAT_HISTORY_KEY)"));
check("Task 38: saved chat history is capped at 50 messages", frontend.includes(".slice(-50)"));

// Task 39 — reason-coded feedback is stored and shown to Admin.
check("Task 39: Not Helpful flow offers reason categories and optional comment", frontend.includes("safety_concern") && frontend.includes("feedbackComment") && frontend.includes("feedbackReason"));
check("Task 39: Firestore validates bounded feedback fields", rules.includes("'feedbackReason', 'feedbackComment'") && rules.includes("feedbackComment.size() <= 300"));
check("Task 39: Admin feedback and issue queue display user reason/comment", admin.includes("record.feedbackReason") && admin.includes("issue.feedbackComment"));

// Cross-feature wiring and Firestore source access.
check("Tasks 31–32: Admin source registry and automated answer audit are available", admin.includes("medical-source-form") && admin.includes("kbLoadMedicalAnswerAudit") && admin.includes("loadMedicalSourceRegistryAdmin"));
check("Tasks 32, 37: public client loads active sources and approved reviews only", frontend.includes('where("status", "==", "approved")') && frontend.includes('where("status", "==", "active")') && rules.includes("match /medical_sources/{sourceId}") && rules.includes("match /chatbot_clinical_reviews/{reviewId}"));
check("Batch 2 adds no paid AI API dependency", !["assets/js/chatbot-intelligence.js", "assets/js/medical-safety.js", "assets/js/medical-references.js"].some(file => /openai\.com\/v1|anthropic\.com\/v1|gemini.*generateContent/i.test(read(file))));

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) failed++;
}
console.log(`\nTASK 29–39 SUMMARY: ${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
