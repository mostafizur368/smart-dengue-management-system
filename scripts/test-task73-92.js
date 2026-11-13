const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const check = (label, ok) => checks.push([label, Boolean(ok)]);

const rules = read("firestore.rules");
const patient = read("user-dashboard.html");
const doctor = read("assets/doctor/doctor-dashboard.html");
const admin = read("assets/admin/admin-dashboard.html");
const login = read("login.html");
const pkg = JSON.parse(read("package.json"));
const pwa = read("service-worker.js");
const manifest = JSON.parse(read("manifest.webmanifest"));
const patientSecurity = read("assets/js/patient-security-data.js");
const patientMessaging = read("assets/js/patient-messaging.js");
const doctorMessaging = read("assets/js/doctor-messaging.js");
const doctorPortal = read("assets/js/doctor-portal.js");
const adminOps = read("assets/js/admin-operations.js");
const backupFn = read("functions/index.js");

check("Task 73: Admin BMDC doctor verification/revocation UI remains present",
  admin.includes("BMDC registration number") && admin.includes("Verify for Chatbot") && admin.includes("Remove chatbot verification"));
check("Task 74: doctor weekly availability form and owner-only schedule rule exist",
  doctor.includes('id="doctor-availability-form"') && rules.includes("request.auth.uid == doctorId") && rules.includes("scheduleUpdatedAt"));
check("Task 75: online appointment booking is preserved and uses atomic ticket reservation",
  read("index.html").includes('id="appointment-form"') &&
  read("assets/js/script.js").includes("reserveAppointmentAndCreateTicket") &&
  read("assets/js/script.js").includes("runTransaction(db") &&
  rules.includes("request.resource.data.booked == resource.data.booked + 1"));
check("Task 74: patient appointment directory displays weekly schedule and BMDC verification state",
  read("assets/js/doctors.js").includes("schedule.days") &&
  read("assets/js/doctors.js").includes("BMDC verification") &&
  read("assets/js/script.js").includes("availableDays.includes(weekday)"));
check("Task 76: public hospital directory admin form and active public-read rules exist",
  admin.includes('id="admin-hospital-form"') && rules.includes("match /public_hospitals/{hospitalId}") && rules.includes("resource.data.status == 'active'"));
check("Task 77: nearest-hospital locator uses explicit user geolocation and distance ranking",
  patient.includes('id="hospital-locate-nearest"') && read("assets/js/patient-care-services.js").includes("navigator.geolocation.getCurrentPosition") && read("assets/js/patient-care-services.js").includes("kmBetween"));
check("Task 78: patient and doctor messaging UI plus participant-only Firestore rules exist",
  patient.includes('id="patient-message-form"') && doctor.includes('id="doctor-message-form"') &&
  rules.includes("match /doctor_patient_conversations/{conversationId}") &&
  rules.includes("match /messages/{messageId}") &&
  patientMessaging.includes("participants") && doctorMessaging.includes("onSnapshot"));
check("Task 79: Admin patient analytics are bounded and present",
  admin.includes('id="admin-patient-total"') && adminOps.includes('bounded("users", 2000)'));
check("Task 80: dengue statistics explicitly label symptom checks as unconfirmed",
  admin.includes("not laboratory-confirmed dengue cases") && adminOps.includes("symptom_checks"));
check("Task 81: chatbot analytics uses query events and existing analytics remains present",
  admin.includes('id="chatbot-analytics-section"') && adminOps.includes('bounded("chatbot_query_events", 2000)'));
check("Task 82: Top 100 normalized questions table is present",
  admin.includes('id="admin-top100-questions"') && adminOps.includes("slice(0, 100)"));
check("Task 83: unanswered/low-match queue is present",
  admin.includes('id="admin-unanswered-questions"') && adminOps.includes("item.isUnmatched === true"));
check("Task 84: existing Admin Knowledge Base editor is retained",
  admin.includes('id="knowledge-management-section"') && admin.includes('id="kb-editor-form"'));
check("Task 85: append-only doctor activity monitoring and write rules exist",
  admin.includes('id="admin-doctor-activity"') && rules.includes("match /doctor_activity_logs/{logId}") && rules.includes("allow update, delete: if false"));
check("Task 86: Firebase SMS MFA enrollment and sign-in resolver are integrated",
  patient.includes('id="mfa-start-enrollment"') && patientSecurity.includes("multiFactor(currentUser).enroll") &&
  login.includes("getMultiFactorResolver") && login.includes("resolveSignIn"));
check("Task 87: client-side AES-GCM archive uses PBKDF2 and stores ciphertext only",
  patientSecurity.includes("AES-GCM") && patientSecurity.includes("PBKDF2") &&
  rules.includes("match /patient_secure_vault/{userId}") && rules.includes("request.resource.data.ciphertext is string"));
check("Task 88: Admin audit log is append-only and retained",
  rules.includes("match /admin_activity_logs/{logId}") && rules.includes("allow update, delete: if false"));
check("Task 89: daily scheduled Firestore backup Cloud Function source exists",
  backupFn.includes('schedule: "every day 02:00"') && backupFn.includes("smart-dengue-firestore-backups") &&
  fs.existsSync(path.join(root, "functions/package.json")));
check("Task 90: PWA manifest, service worker, registration and PNG icons exist",
  manifest.display === "standalone" && fs.existsSync(path.join(root, "service-worker.js")) &&
  fs.existsSync(path.join(root, "assets/images/pwa-icon-192.png")) &&
  fs.existsSync(path.join(root, "assets/images/pwa-icon-512.png")));
check("Task 91: encrypted IndexedDB offline archive and standalone offline viewer exist",
  patientSecurity.includes("smart-dengue-offline-v1") && fs.existsSync(path.join(root, "assets/js/offline-records-viewer.js")) &&
  read("offline.html").includes("Unlock offline records"));
check("Task 92: account data export, re-authenticated deletion and owner delete rules exist",
  patient.includes('id="data-export-button"') && patient.includes('id="delete-account-button"') &&
  patientSecurity.includes("reauthenticateWithCredential") && patientSecurity.includes("deleteUser(currentUser)") &&
  rules.includes('resource.data.role == "user"'));
check("Secure messaging is restricted to approved and BMDC-verified public doctors",
  rules.includes("chatbotVerified == true") && patientMessaging.includes('where("chatbotVerified", "==", true)'));
check("PWA service worker excludes Firebase/network API responses from cache",
  pwa.includes('if (request.method !== "GET" || url.origin !== self.location.origin) return') &&
  pwa.includes("identitytoolkit") && pwa.includes("firestore"));
check("Cloud backup guide discloses that deployment and restore testing are required",
  read("docs/TASK73_92_DEPLOYMENT_AND_SECURITY.md").includes("source code only until Cloud Functions are deployed") &&
  read("docs/TASK73_92_DEPLOYMENT_AND_SECURITY.md").includes("restore test"));
check("Firebase config/Auth remain on the same project",
  patientSecurity.includes('projectId: "smart-dengue-management-system"') &&
  doctorPortal.includes('projectId: "smart-dengue-management-system"') &&
  adminOps.includes('projectId: "smart-dengue-management-system"'));

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? "PASS" : "FAIL"} | ${label}`));
console.log(`\nTASK 73–92 SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
