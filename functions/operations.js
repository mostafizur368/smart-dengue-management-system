const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { getStorage } = require("firebase-admin/storage");
const { runFirestoreBackup, verifyBackupRun } = require("./backup-service");

const db = getFirestore();
const adminAuth = getAuth();
const REGION = "asia-south1";
const ENFORCE_APP_CHECK = process.env.ENFORCE_APP_CHECK === "true";
const CALLABLE_OPTIONS = {
  region: REGION,
  timeoutSeconds: 120,
  memory: "512MiB",
  enforceAppCheck: ENFORCE_APP_CHECK
};

function clean(value, max = 160) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max)
    : "";
}

async function requireAdmin(request) {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("unauthenticated", "Please sign in as an Admin.");
  }
  const header = request.rawRequest?.headers?.authorization || "";
  const token = typeof header === "string" ? header.replace(/^Bearer\s+/i, "") : "";
  if (!token) throw new HttpsError("unauthenticated", "A valid Firebase ID token is required.");
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token, true);
  } catch (_) {
    throw new HttpsError("unauthenticated", "Your session has expired or was revoked. Sign in again.");
  }
  if (decoded.uid !== request.auth.uid) {
    throw new HttpsError("unauthenticated", "Token identity mismatch.");
  }
  const profile = await db.collection("users").doc(decoded.uid).get();
  if (!profile.exists || String(profile.data().role || "").toLowerCase() !== "admin") {
    throw new HttpsError("permission-denied", "Admin permission is required.");
  }
  return decoded.uid;
}

async function consumeAdminQuota(uid, action, max = 12, windowMs = 60_000) {
  const id = `${uid}_${action}`.replace(/[^A-Za-z0-9_-]/g, "_");
  const ref = db.collection("operations_rate_limits").doc(id);
  const now = Date.now();
  return db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    let start = snapshot.exists ? Number(snapshot.data().windowStartMs || 0) : 0;
    let count = snapshot.exists ? Number(snapshot.data().count || 0) : 0;
    if (!start || now - start >= windowMs) {
      start = now;
      count = 0;
    }
    if (count >= max) return false;
    transaction.set(ref, {
      windowStartMs: start,
      count: count + 1,
      updatedAt: new Date(),
      expiresAt: new Date(now + 24 * 60 * 60 * 1000)
    });
    return true;
  });
}

function quotaOrThrow(allowed) {
  if (!allowed) throw new HttpsError("resource-exhausted", "Too many requests. Please wait and try again.");
}

async function writeIncidentEvent(incidentId, actorUid, action, note = "") {
  await db.collection("security_incident_events").add({
    incidentId,
    actorUid: clean(actorUid, 128),
    action: clean(action, 60),
    note: clean(note, 1000),
    createdAt: new Date()
  });
}

async function createAutomatedIncident({ category, severity, title, description, source }) {
  const bucket = Math.floor(Date.now() / (15 * 60 * 1000));
  const incidentId = `auto_${clean(category, 32)}_${bucket}`.replace(/[^A-Za-z0-9_-]/g, "_");
  const ref = db.collection("security_incidents").doc(incidentId);
  const now = new Date();
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    await ref.create({
      category: clean(category, 40),
      severity: ["low", "medium", "high", "critical"].includes(severity) ? severity : "medium",
      title: clean(title, 140),
      description: clean(description, 1800),
      source: clean(source, 40),
      status: "open",
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
      resolvedAt: null
    });
    await writeIncidentEvent(incidentId, "system", "automatically_created", "Created from an automated health or backup signal.");
  }
  return incidentId;
}

exports.getBackupOverview = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "backup_overview", 20));
  const snapshot = await db.collection("system_backup_runs")
    .orderBy("startedAt", "desc")
    .limit(20)
    .get();
  const runs = snapshot.docs.map(item => {
    const data = item.data();
    return {
      runId: clean(data.runId || item.id, 100),
      prefix: clean(data.prefix, 220),
      status: clean(data.status, 30),
      trigger: clean(data.trigger, 30),
      bucket: clean(data.bucket, 180),
      documentCount: Number(data.documentCount || 0),
      fileCount: Number(data.fileCount || 0),
      collectionCount: Number(data.collectionCount || 0),
      errorCode: clean(data.errorCode, 80),
      startedAt: data.startedAt?.toMillis ? data.startedAt.toMillis() : null,
      completedAt: data.completedAt?.toMillis ? data.completedAt.toMillis() : null
    };
  });
  return { runs, generatedAt: Date.now() };
});

exports.runManualFirestoreBackup = onCall({
  ...CALLABLE_OPTIONS,
  timeoutSeconds: 540,
  memory: "1GiB"
}, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "backup_manual", 2, 60 * 60 * 1000));
  try {
    return await runFirestoreBackup("manual-admin");
  } catch (error) {
    logger.error("Manual Firestore backup failed", { code: clean(error.code || error.name, 80) });
    throw new HttpsError("internal", "The manual backup failed. Check Cloud Functions logs and the backup run history.");
  }
});

exports.verifyBackupRun = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "backup_verify", 4));
  const prefix = clean(request.data?.prefix, 220);
  if (!prefix) throw new HttpsError("invalid-argument", "Backup prefix is required.");
  try {
    return await verifyBackupRun(prefix);
  } catch (error) {
    const code = error.code || "verification-failed";
    if (code === "invalid-argument") throw new HttpsError("invalid-argument", error.message);
    if (code === "not-found") throw new HttpsError("not-found", error.message);
    throw new HttpsError("internal", "Backup verification could not be completed.");
  }
});

async function probeServices() {
  const result = {
    firestore: "unknown",
    storage: "unknown",
    checkedAt: Date.now(),
    durationMs: 0
  };
  const started = Date.now();

  try {
    await db.listCollections();
    result.firestore = "ok";
  } catch (error) {
    result.firestore = "error";
    result.firestoreErrorCode = clean(error.code || error.name || "firestore-unavailable", 80);
  }

  try {
    const bucketName = process.env.BACKUP_BUCKET;
    const bucket = bucketName ? getStorage().bucket(bucketName) : getStorage().bucket();
    await bucket.getMetadata();
    result.storage = "ok";
    result.storageBucketConfigured = true;
  } catch (error) {
    result.storage = "error";
    result.storageBucketConfigured = Boolean(process.env.BACKUP_BUCKET);
    result.storageErrorCode = clean(error.code || error.name || "storage-unavailable", 80);
  }

  result.durationMs = Date.now() - started;
  result.overall = result.firestore === "ok" && result.storage === "ok" ? "healthy" : "degraded";
  return result;
}

exports.getSystemHealthOverview = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "system_health", 30));
  const [live, history] = await Promise.all([
    probeServices(),
    db.collection("system_health_checks").orderBy("checkedAt", "desc").limit(12).get()
  ]);
  return {
    live,
    history: history.docs.map(item => {
      const data = item.data();
      return {
        id: item.id,
        firestore: clean(data.firestore, 20),
        storage: clean(data.storage, 20),
        overall: clean(data.overall, 20),
        durationMs: Number(data.durationMs || 0),
        checkedAt: data.checkedAt?.toMillis ? data.checkedAt.toMillis() : null
      };
    }),
    generatedAt: Date.now()
  };
});

exports.scheduledSystemHealthProbe = onSchedule({
  schedule: "every 15 minutes",
  timeZone: "Asia/Dhaka",
  region: REGION,
  timeoutSeconds: 60,
  memory: "256MiB",
  retryCount: 1
}, async () => {
  const previous = await db.collection("system_health_checks").orderBy("checkedAt", "desc").limit(1).get();
  const previousStatus = previous.empty ? "unknown" : clean(previous.docs[0].data().overall, 20);
  const result = await probeServices();
  const ref = db.collection("system_health_checks").doc(String(result.checkedAt));
  await ref.set({
    firestore: result.firestore,
    storage: result.storage,
    overall: result.overall,
    durationMs: result.durationMs,
    checkedAt: new Date(result.checkedAt),
    expiresAt: new Date(result.checkedAt + 90 * 24 * 60 * 60 * 1000),
    firestoreErrorCode: result.firestoreErrorCode || null,
    storageErrorCode: result.storageErrorCode || null
  });

  // Create an automated incident only on a transition into a degraded state,
  // not every 15-minute poll while the same outage continues.
  if (result.overall !== "healthy" && previousStatus !== "degraded") {
    await createAutomatedIncident({
      category: "system_health",
      severity: result.firestore === "error" ? "critical" : "high",
      title: "Scheduled system health probe reported degraded service",
      description: `Firestore: ${result.firestore}; Cloud Storage: ${result.storage}. Error codes are stored without patient data.`,
      source: "scheduled_health_probe"
    });
  }
  logger.info("Scheduled system health probe completed", {
    overall: result.overall,
    firestore: result.firestore,
    storage: result.storage,
    durationMs: result.durationMs
  });
});

exports.listSecurityIncidents = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "incident_list", 20));
  const [incidentsSnap, eventsSnap] = await Promise.all([
    db.collection("security_incidents").orderBy("createdAt", "desc").limit(50).get(),
    db.collection("security_incident_events").orderBy("createdAt", "desc").limit(100).get()
  ]);
  const incidents = incidentsSnap.docs.map(item => {
    const data = item.data();
    return {
      id: item.id,
      category: clean(data.category, 40),
      severity: clean(data.severity, 20),
      title: clean(data.title, 140),
      description: clean(data.description, 1800),
      source: clean(data.source, 40),
      status: clean(data.status, 30),
      createdBy: clean(data.createdBy, 128),
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : null,
      updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : null,
      resolvedAt: data.resolvedAt?.toMillis ? data.resolvedAt.toMillis() : null
    };
  });
  const events = eventsSnap.docs.map(item => {
    const data = item.data();
    return {
      id: item.id,
      incidentId: clean(data.incidentId, 180),
      actorUid: clean(data.actorUid, 128),
      action: clean(data.action, 60),
      note: clean(data.note, 1000),
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : null
    };
  });
  return { incidents, events, generatedAt: Date.now() };
});

exports.createSecurityIncident = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "incident_create", 8));
  const category = clean(request.data?.category, 40);
  const severity = clean(request.data?.severity, 20);
  const title = clean(request.data?.title, 140);
  const description = clean(request.data?.description, 1800);
  const allowedCategories = new Set(["account_security", "app_abuse", "data_privacy", "backup_recovery", "system_health", "other"]);
  if (!allowedCategories.has(category)) throw new HttpsError("invalid-argument", "Choose a valid incident category.");
  if (!["low", "medium", "high", "critical"].includes(severity)) throw new HttpsError("invalid-argument", "Choose a valid severity.");
  if (title.length < 5 || description.length < 10) throw new HttpsError("invalid-argument", "Enter a title and a brief incident description.");
  const ref = db.collection("security_incidents").doc();
  const now = new Date();
  await ref.create({
    category,
    severity,
    title,
    description,
    source: "admin_reported",
    status: "open",
    createdBy: uid,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null
  });
  await writeIncidentEvent(ref.id, uid, "created", "Incident manually reported by Admin.");
  return { ok: true, incidentId: ref.id };
});

exports.updateSecurityIncident = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireAdmin(request);
  quotaOrThrow(await consumeAdminQuota(uid, "incident_update", 20));
  const incidentId = clean(request.data?.incidentId, 180);
  const status = clean(request.data?.status, 30);
  const note = clean(request.data?.note, 1000);
  if (!incidentId || !/^[A-Za-z0-9_-]+$/.test(incidentId)) throw new HttpsError("invalid-argument", "Invalid incident ID.");
  if (!["open", "triaged", "investigating", "resolved", "closed"].includes(status)) throw new HttpsError("invalid-argument", "Invalid incident status.");
  const ref = db.collection("security_incidents").doc(incidentId);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Incident was not found.");
  const update = { status, updatedAt: new Date(), updatedBy: uid };
  if (status === "resolved" || status === "closed") update.resolvedAt = new Date();
  else update.resolvedAt = null;
  await ref.update(update);
  await writeIncidentEvent(incidentId, uid, `status_${status}`, note);
  return { ok: true };
});
