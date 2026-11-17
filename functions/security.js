"use strict";

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const db = getFirestore();
const adminAuth = getAuth();
const REGION = "asia-south1";
const CALLABLE_OPTIONS = {
  region: REGION,
  timeoutSeconds: 30,
  memory: "256MiB",
  enforceAppCheck: process.env.ENFORCE_APP_CHECK === "true"
};
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{20,80}$/;
const ALLOWED_SIGNALS = new Set([
  "role_mismatch",
  "permission_denied",
  "auth_state_error",
  "session_registration_error"
]);

function cleanString(value, max = 120, fallback = "") {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : fallback;
}

async function requireVerifiedUid(request) {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("unauthenticated", "Please sign in again.");
  }
  const header = request.rawRequest && request.rawRequest.headers
    ? request.rawRequest.headers.authorization
    : "";
  const token = typeof header === "string" ? header.replace(/^Bearer\s+/i, "") : "";
  if (!token) throw new HttpsError("unauthenticated", "A valid Firebase ID token is required.");
  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    if (decoded.uid !== request.auth.uid) throw new HttpsError("unauthenticated", "Token identity mismatch.");
    return decoded.uid;
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("unauthenticated", "This session has expired or was revoked. Sign in again.");
  }
}

async function requireAdmin(uid) {
  const profile = await db.collection("users").doc(uid).get();
  if (!profile.exists || String(profile.data().role || "").toLowerCase() !== "admin") {
    throw new HttpsError("permission-denied", "Admin permission is required.");
  }
}

async function writeSecurityEvent({ userId, eventType, severity = "info", summary, sessionId = null, source = "server", metadata = {} }) {
  const allowedSeverity = ["info", "low", "medium", "high"].includes(severity) ? severity : "info";
  const safeMetadata = {
    route: cleanString(metadata.route, 100),
    code: cleanString(metadata.code, 80)
  };
  await db.collection("security_events").add({
    userId: cleanString(userId, 128),
    eventType: cleanString(eventType, 60, "security_event"),
    severity: allowedSeverity,
    summary: cleanString(summary, 240, "Security event recorded."),
    sessionId: sessionId ? cleanString(sessionId, 80) : null,
    source,
    metadata: safeMetadata,
    createdAt: new Date()
  });
}

async function createSecurityAlert({ userId, alertType, severity, summary, relatedSessionId = null }) {
  const now = Date.now();
  const bucket = Math.floor(now / (15 * 60 * 1000));
  const alertId = `${cleanString(userId, 128)}_${cleanString(alertType, 40)}_${bucket}`.replace(/[^A-Za-z0-9_-]/g, "_");
  const ref = db.collection("security_alerts").doc(alertId);
  try {
    await ref.create({
      userId: cleanString(userId, 128),
      alertType: cleanString(alertType, 60),
      severity: ["medium", "high"].includes(severity) ? severity : "medium",
      summary: cleanString(summary, 300),
      relatedSessionId: relatedSessionId ? cleanString(relatedSessionId, 80) : null,
      status: "open",
      createdAt: new Date(),
      resolvedAt: null,
      resolvedBy: null
    });
  } catch (error) {
    if (error.code !== 6 && error.code !== "already-exists") throw error;
  }
}

async function consumeUserEventQuota(uid) {
  const ref = db.collection("security_rate_limits").doc(uid);
  const now = Date.now();
  return db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    let windowStart = snapshot.exists ? Number(snapshot.data().windowStartMs || 0) : 0;
    let count = snapshot.exists ? Number(snapshot.data().count || 0) : 0;
    if (!windowStart || now - windowStart >= 60_000) {
      windowStart = now;
      count = 0;
    }
    if (count >= 12) return false;
    transaction.set(ref, { windowStartMs: windowStart, count: count + 1, updatedAt: new Date() });
    return true;
  });
}

async function setSessionsInactive(uid, reason) {
  const snapshot = await db.collection("security_sessions").where("userId", "==", uid).limit(100).get();
  let count = 0;
  let batch = db.batch();
  for (const item of snapshot.docs) {
    if (item.data().active !== true) continue;
    batch.update(item.ref, {
      active: false,
      revokedAt: new Date(),
      endedAt: new Date(),
      endReason: cleanString(reason, 60, "revoked")
    });
    count += 1;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (count % 400 !== 0) await batch.commit();
  return count;
}

exports.registerSecuritySession = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  const sessionId = cleanString(request.data && request.data.sessionId, 80);
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new HttpsError("invalid-argument", "Invalid session identifier.");

  const profile = await db.collection("users").doc(uid).get();
  if (!profile.exists) throw new HttpsError("failed-precondition", "User profile is not available.");

  const ref = db.collection("security_sessions").doc(sessionId);
  const existing = await ref.get();
  if (existing.exists && existing.data().userId !== uid) {
    throw new HttpsError("already-exists", "This session identifier is already registered.");
  }

  const now = new Date();
  const wasActive = existing.exists && existing.data().active === true;
  const deviceLabel = cleanString(request.data && request.data.deviceLabel, 80, "Unknown browser/device");
  await ref.set({
    userId: uid,
    deviceLabel,
    active: true,
    createdAt: existing.exists && existing.data().createdAt ? existing.data().createdAt : now,
    lastSeenAt: now,
    updatedAt: now,
    endedAt: null,
    revokedAt: null,
    endReason: null
  }, { merge: true });

  if (!wasActive) {
    await writeSecurityEvent({
      userId: uid,
      eventType: "session_started",
      severity: "info",
      summary: "A new signed-in browser session was registered.",
      sessionId
    });
  }

  const sessions = await db.collection("security_sessions").where("userId", "==", uid).limit(30).get();
  const activeRecent = sessions.docs.filter(item => {
    const data = item.data();
    const lastSeen = data.lastSeenAt && typeof data.lastSeenAt.toMillis === "function" ? data.lastSeenAt.toMillis() : 0;
    return data.active === true && now.getTime() - lastSeen <= 20 * 60 * 1000;
  });
  if (activeRecent.length >= 5) {
    await createSecurityAlert({
      userId: uid,
      alertType: "many_active_sessions",
      severity: "medium",
      summary: `This account has ${activeRecent.length} recently active browser sessions. Review whether they are all recognized.`,
      relatedSessionId: sessionId
    });
  }

  return { ok: true, sessionId, activeSessionCount: activeRecent.length };
});

exports.heartbeatSecuritySession = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  const sessionId = cleanString(request.data && request.data.sessionId, 80);
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new HttpsError("invalid-argument", "Invalid session identifier.");
  const ref = db.collection("security_sessions").doc(sessionId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().userId !== uid || snapshot.data().active !== true) {
    throw new HttpsError("permission-denied", "This session is no longer active. Sign in again.");
  }
  await ref.update({ lastSeenAt: new Date(), updatedAt: new Date() });
  return { ok: true };
});

exports.endSecuritySession = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  const sessionId = cleanString(request.data && request.data.sessionId, 80);
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new HttpsError("invalid-argument", "Invalid session identifier.");
  const ref = db.collection("security_sessions").doc(sessionId);
  const snapshot = await ref.get();
  if (snapshot.exists && snapshot.data().userId === uid && snapshot.data().active === true) {
    await ref.update({ active: false, endedAt: new Date(), updatedAt: new Date(), endReason: "user_signed_out" });
    await writeSecurityEvent({ userId: uid, eventType: "session_ended", summary: "The user signed out from this browser session.", sessionId });
  }
  return { ok: true };
});

exports.listMySecuritySessions = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  const snapshot = await db.collection("security_sessions").where("userId", "==", uid).limit(30).get();
  const sessions = snapshot.docs.map(item => {
    const data = item.data();
    return {
      sessionId: item.id,
      deviceLabel: cleanString(data.deviceLabel, 80, "Unknown device"),
      active: data.active === true,
      createdAt: data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : null,
      lastSeenAt: data.lastSeenAt && data.lastSeenAt.toMillis ? data.lastSeenAt.toMillis() : null,
      endedAt: data.endedAt && data.endedAt.toMillis ? data.endedAt.toMillis() : null,
      revokedAt: data.revokedAt && data.revokedAt.toMillis ? data.revokedAt.toMillis() : null
    };
  }).sort((a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0));
  return { sessions };
});

exports.revokeMySecuritySessions = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  await adminAuth.revokeRefreshTokens(uid);
  const revokedCount = await setSessionsInactive(uid, "user_revoked_all_sessions");
  await writeSecurityEvent({
    userId: uid,
    eventType: "all_sessions_revoked",
    severity: "medium",
    summary: "The user requested sign-out across all registered sessions."
  });
  return {
    ok: true,
    revokedCount,
    message: "Refresh tokens were revoked. Other already-issued ID tokens may remain valid until they expire; sign out this device now."
  };
});

exports.recordSecuritySignal = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  const eventType = cleanString(request.data && request.data.eventType, 60);
  if (!ALLOWED_SIGNALS.has(eventType)) throw new HttpsError("invalid-argument", "Unsupported security signal.");
  const allowed = await consumeUserEventQuota(uid);
  if (!allowed) {
    await createSecurityAlert({
      userId: uid,
      alertType: "security_event_rate_limit",
      severity: "high",
      summary: "The account submitted more than 12 security signals within one minute. This is an automated rate-limit signal, not proof of an attack."
    });
    throw new HttpsError("resource-exhausted", "Security event rate limit reached.");
  }

  const route = cleanString(request.data && request.data.route, 100);
  const code = cleanString(request.data && request.data.code, 80);
  await writeSecurityEvent({
    userId: uid,
    eventType,
    severity: eventType === "role_mismatch" ? "medium" : "low",
    summary: `Client-reported security signal: ${eventType}.`,
    source: "client_reported",
    metadata: { route, code }
  });

  if (eventType === "role_mismatch") {
    const recent = await db.collection("security_events").where("userId", "==", uid).limit(50).get();
    const cutoff = Date.now() - 15 * 60 * 1000;
    const repeated = recent.docs.filter(item => {
      const data = item.data();
      const created = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0;
      return data.eventType === "role_mismatch" && created >= cutoff;
    });
    if (repeated.length >= 3) {
      await createSecurityAlert({
        userId: uid,
        alertType: "repeated_role_mismatch",
        severity: "high",
        summary: "Three or more client-reported role mismatch signals were received within 15 minutes. Review account access and configuration."
      });
    }
  }
  return { ok: true };
});

exports.getSecurityOverview = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  await requireAdmin(uid);
  const [eventsSnap, sessionsSnap, alertsSnap] = await Promise.all([
    db.collection("security_events").orderBy("createdAt", "desc").limit(60).get(),
    db.collection("security_sessions").where("active", "==", true).limit(100).get(),
    db.collection("security_alerts").orderBy("createdAt", "desc").limit(60).get()
  ]);

  const toMillis = value => value && typeof value.toMillis === "function" ? value.toMillis() : null;
  const events = eventsSnap.docs.map(item => {
    const data = item.data();
    return {
      id: item.id,
      userId: cleanString(data.userId, 128),
      eventType: cleanString(data.eventType, 60),
      severity: cleanString(data.severity, 20),
      summary: cleanString(data.summary, 240),
      source: cleanString(data.source, 30),
      createdAt: toMillis(data.createdAt)
    };
  });
  const sessions = sessionsSnap.docs.map(item => {
    const data = item.data();
    return {
      sessionId: item.id,
      userId: cleanString(data.userId, 128),
      deviceLabel: cleanString(data.deviceLabel, 80),
      lastSeenAt: toMillis(data.lastSeenAt),
      createdAt: toMillis(data.createdAt)
    };
  }).filter(item => item.lastSeenAt && Date.now() - item.lastSeenAt <= 20 * 60 * 1000);
  const alerts = alertsSnap.docs.map(item => {
    const data = item.data();
    return {
      id: item.id,
      userId: cleanString(data.userId, 128),
      alertType: cleanString(data.alertType, 60),
      severity: cleanString(data.severity, 20),
      summary: cleanString(data.summary, 300),
      status: cleanString(data.status, 20),
      createdAt: toMillis(data.createdAt),
      resolvedAt: toMillis(data.resolvedAt)
    };
  });
  return {
    generatedAt: Date.now(),
    activeSessionCount: sessions.length,
    openAlertCount: alerts.filter(item => item.status !== "resolved").length,
    events,
    sessions,
    alerts
  };
});

exports.resolveSecurityAlert = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  await requireAdmin(uid);
  const alertId = cleanString(request.data && request.data.alertId, 180);
  if (!alertId || !/^[A-Za-z0-9_-]+$/.test(alertId)) throw new HttpsError("invalid-argument", "Invalid alert identifier.");
  const ref = db.collection("security_alerts").doc(alertId);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Security alert was not found.");
  await ref.update({ status: "resolved", resolvedAt: new Date(), resolvedBy: uid });
  await writeSecurityEvent({ userId: uid, eventType: "security_alert_resolved", severity: "info", summary: `Admin resolved security alert ${alertId}.` });
  return { ok: true };
});

exports.revokeUserSecuritySessions = onCall(CALLABLE_OPTIONS, async request => {
  const uid = await requireVerifiedUid(request);
  await requireAdmin(uid);
  const targetUid = cleanString(request.data && request.data.targetUid, 128);
  if (!targetUid || targetUid === uid) throw new HttpsError("invalid-argument", "Provide another user's UID. Use your own account session control for self-revocation.");
  const target = await db.collection("users").doc(targetUid).get();
  if (!target.exists) throw new HttpsError("not-found", "Target user profile was not found.");
  await adminAuth.revokeRefreshTokens(targetUid);
  const revokedCount = await setSessionsInactive(targetUid, "admin_revoked_sessions");
  await writeSecurityEvent({
    userId: targetUid,
    eventType: "admin_revoked_sessions",
    severity: "high",
    summary: `An Admin revoked registered sessions for this account (${revokedCount} session record(s)).`
  });
  return { ok: true, revokedCount };
});
