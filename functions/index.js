const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

const backupService = require("./backup-service");
const securityFunctions = require("./security");
const operationsFunctions = require("./operations");

// Batch 23: daily Firestore backup to a private Cloud Storage bucket.
// Object prefix remains smart-dengue-firestore-backups/<run-id>.
exports.scheduledFirestoreBackup = onSchedule({
  schedule: "every day 02:00",
  timeZone: "Asia/Dhaka",
  region: "asia-south1",
  timeoutSeconds: 540,
  memory: "1GiB",
  retryCount: 1
}, async () => {
  const result = await backupService.runFirestoreBackup("scheduled");
  logger.info("Scheduled Firestore backup completed", result);
  return result;
});

// Batch 11: server-verified security events and session controls.
exports.registerSecuritySession = securityFunctions.registerSecuritySession;
exports.heartbeatSecuritySession = securityFunctions.heartbeatSecuritySession;
exports.endSecuritySession = securityFunctions.endSecuritySession;
exports.listMySecuritySessions = securityFunctions.listMySecuritySessions;
exports.revokeMySecuritySessions = securityFunctions.revokeMySecuritySessions;
exports.recordSecuritySignal = securityFunctions.recordSecuritySignal;
exports.getSecurityOverview = securityFunctions.getSecurityOverview;
exports.resolveSecurityAlert = securityFunctions.resolveSecurityAlert;
exports.revokeUserSecuritySessions = securityFunctions.revokeUserSecuritySessions;

// Batches 23, 26 and 28: backup verification, system health and incident response.
exports.getBackupOverview = operationsFunctions.getBackupOverview;
exports.runManualFirestoreBackup = operationsFunctions.runManualFirestoreBackup;
exports.verifyBackupRun = operationsFunctions.verifyBackupRun;
exports.getSystemHealthOverview = operationsFunctions.getSystemHealthOverview;
exports.scheduledSystemHealthProbe = operationsFunctions.scheduledSystemHealthProbe;
exports.listSecurityIncidents = operationsFunctions.listSecurityIncidents;
exports.createSecurityIncident = operationsFunctions.createSecurityIncident;
exports.updateSecurityIncident = operationsFunctions.updateSecurityIncident;
