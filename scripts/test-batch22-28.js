const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createRateLimiter } = require("../rate-limiter");

const root = path.join(__dirname, "..");
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");
const checks = [];
const check = (name, condition) => checks.push([name, Boolean(condition)]);

function mockResponse() {
  const headers = {};
  return {
    headers,
    statusCode: 200,
    body: null,
    setHeader(name, value) { headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; }
  };
}

// Behavioral test for the process-local Express rate limiter.
const originalNow = Date.now;
let fakeNow = 1_000_000;
Date.now = () => fakeNow;
const limiter = createRateLimiter({ windowMs: 60_000, max: 2, keyGenerator: req => req.ip });
let nextCalls = 0;
function request(ip) { return { ip, socket: { remoteAddress: ip } }; }
const r1 = mockResponse(); limiter(request("test-ip"), r1, () => nextCalls++);
const r2 = mockResponse(); limiter(request("test-ip"), r2, () => nextCalls++);
const r3 = mockResponse(); limiter(request("test-ip"), r3, () => nextCalls++);
check("Express limiter allows requests within the configured quota", nextCalls === 2 && r1.statusCode === 200 && r2.statusCode === 200);
check("Express limiter returns HTTP 429 after the quota is exceeded", r3.statusCode === 429 && r3.body?.error === "rate_limit_exceeded" && Boolean(r3.headers["Retry-After"]));
fakeNow += 60_001;
const r4 = mockResponse(); limiter(request("test-ip"), r4, () => nextCalls++);
check("Express limiter resets after the time window", r4.statusCode === 200 && nextCalls === 3);
Date.now = originalNow;

const appCheck = read("assets/js/firebase-app-check.js");
const appCheckConfig = read("assets/js/firebase-app-check-config.js");
check("Firebase App Check uses reCAPTCHA v3 with auto token refresh", appCheck.includes("ReCaptchaV3Provider") && appCheck.includes("isTokenAutoRefreshEnabled: true"));
check("App Check remains optional until the site key is configured", appCheckConfig.includes('SITE_KEY = ""') && appCheck.includes("site-key-not-configured"));
check("Callable App Check enforcement is controlled by an explicit environment switch",
  read("functions/security.js").includes('process.env.ENFORCE_APP_CHECK === "true"') &&
  read("functions/operations.js").includes('process.env.ENFORCE_APP_CHECK === "true"'));
const appEntryChecks = [
  read("assets/js/doctors.js").includes("initializeAppCheckIfConfigured(app)"),
  read("assets/js/patient-dashboard.js").includes("initializeAppCheckIfConfigured(app)"),
  read("assets/js/script.js").includes("initializeAppCheckIfConfigured(app)"),
  read("login.html").includes("initializeAppCheckIfConfigured(app)"),
  read("register.html").includes("initializeAppCheckIfConfigured(app)"),
  read("assets/admin/admin-dashboard.html").includes("initializeAppCheckIfConfigured(app)"),
  read("assets/doctor/doctor-dashboard.html").includes("initializeAppCheckIfConfigured(app)")
];
check("All main web entry points initialize App Check when configured", appEntryChecks.every(Boolean));

const backup = read("functions/backup-service.js");
const restore = read("functions/restore-firestore-backup.js");
check("Firestore backup v2 stores typed values and per-object SHA-256", backup.includes("smart-dengue-firestore-json-v2") && backup.includes("sha256") && backup.includes("byteSize"));
check("Backup runs are recorded with completed/failed status", backup.includes('status: "running"') && backup.includes('status: "completed"') && backup.includes('status: "failed"'));
check("Backup verification checks object hashes", backup.includes("verifyBackupRun") && backup.includes("digest !== object.sha256"));
check("Restore is dry-run by default and blocks production targets",
  restore.includes("if (!apply)") && restore.includes("ending in -staging or -test") && restore.includes("CONFIRM_RESTORE_PROJECT_ID") && restore.includes("will not overwrite"));
check("Admin backup functions are exported", read("functions/index.js").includes("getBackupOverview") && read("functions/index.js").includes("verifyBackupRun") && read("functions/index.js").includes("runManualFirestoreBackup"));

const consent = read("assets/js/privacy-consent-center.js");
const patientHtml = read("user-dashboard.html");
const chatbot = read("assets/js/script.js");
const rules = read("firestore.rules");
check("Privacy consent is off by default and patient-controlled", consent.includes("optionalChatbotAnalytics") && consent.includes("No consent changes") && patientHtml.includes('id="privacy-chatbot-analytics"'));
check("Consent changes are append-only and owner-scoped in Firestore Rules",
  rules.includes("match /patient_privacy_preferences/{userId}") &&
  rules.includes("match /patient_consent_records/{consentId}") &&
  rules.includes("allow update: if false"));
check("Chatbot raw question analytics requires saved opt-in", chatbot.includes("hasOptionalChatbotAnalyticsConsent") && chatbot.includes("if (!(await hasOptionalChatbotAnalyticsConsent())) return;"));
check("Patient export/deletion includes consent data", read("assets/js/patient-security-data.js").includes('"patient_consent_records"') && read("assets/js/patient-security-data.js").includes('"patient_privacy_preferences"'));

const server = read("server.js");
check("Express API has general and route-specific rate limits", server.includes('max: 120') && server.includes('max: 30') && server.includes('max: 8'));
check("CORS is restricted to explicit ALLOWED_ORIGINS", server.includes("ALLOWED_ORIGINS") && server.includes("allowedOrigins.has(origin)"));
check("Web health endpoint exposes minimal status and uptime", server.includes('app.get("/api/health"') && server.includes("uptimeSeconds"));
check("Static hosting blocks developer, Functions and Firebase Rules files", server.includes("privatePathPattern") && server.includes("functions|scripts|docs") && server.includes("firestore\\.rules"));

const ops = read("functions/operations.js");
check("Scheduled Firebase/Storage health probes run every 15 minutes", ops.includes('schedule: "every 15 minutes"') && ops.includes("system_health_checks"));
check("System health probe writes a TTL expiry", ops.includes("expiresAt: new Date(result.checkedAt + 90 * 24 * 60 * 60 * 1000)"));
check("Admin incident workflow creates, lists and updates incidents", ops.includes("createSecurityIncident") && ops.includes("listSecurityIncidents") && ops.includes("updateSecurityIncident"));
check("Operations module preserves all Cloud Function exports", !ops.includes("module.exports = { probeServices }") && read("functions/index.js").includes("operationsFunctions.createSecurityIncident"));
check("Incident records are server-written and Admin-readable only",
  rules.includes("match /security_incidents/{incidentId}") &&
  rules.includes("match /security_incident_events/{eventId}") &&
  rules.includes("allow create, update, delete: if false"));
check("Patient privacy and Admin Reliability/Incident UI are loaded",
  patientHtml.includes("patient-privacy-consent") &&
  read("assets/admin/admin-dashboard.html").includes("reliability-admin-panel.js"));

const encryption = read("assets/js/patient-security-data.js");
check("Encrypted archive supports legacy v1 and new v2", encryption.includes("![1, 2].includes(formatVersion)") && encryption.includes("formatVersion: 2"));
check("Cloud archive key rotation increments key version", encryption.includes("async function rotateVaultKey") && encryption.includes("Number(current.keyVersion || 1) + 1"));
check("Firestore Rules allow versioned encryption metadata", rules.includes("request.resource.data.formatVersion in [1, 2]") && rules.includes("'keyVersion', 'keyRotatedAt'"));
check("Existing Task 86 MFA enrollment code remains present", encryption.includes("Task 86: Firebase Phone Multi-Factor Authentication") && encryption.includes("multiFactor(currentUser).enroll"));

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([name, ok]) => console.log(`${ok ? "PASS" : "FAIL"} | ${name}`));
console.log(`\nBATCH 22–28 SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
