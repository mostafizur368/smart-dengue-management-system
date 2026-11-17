import { getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js";

const REGION = "asia-south1";
const SESSION_STORAGE_KEY = "smd_security_session_id_v1";
let memorySessionId = null;
let functionsInstance = null;

function functionsClient() {
  if (!functionsInstance) functionsInstance = getFunctions(getApp(), REGION);
  return functionsInstance;
}

async function callFunction(name, payload = {}) {
  const callable = httpsCallable(functionsClient(), name);
  const response = await callable(payload);
  return response.data || {};
}

function createSessionId() {
  if (crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function getSessionId() {
  if (memorySessionId) return memorySessionId;
  try {
    memorySessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch (_) {
    memorySessionId = null;
  }
  if (!memorySessionId) {
    memorySessionId = createSessionId();
    try { sessionStorage.setItem(SESSION_STORAGE_KEY, memorySessionId); } catch (_) { /* memory-only fallback */ }
  }
  return memorySessionId;
}

function deviceLabel() {
  const ua = navigator.userAgent || "";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const platform = navigator.userAgentData?.platform || navigator.platform || "Unknown device";
  return `${String(platform).slice(0, 32)} · ${browser}`.slice(0, 80);
}

export async function startSecuritySession(user) {
  if (!user || !user.uid) return null;
  const sessionId = getSessionId();
  const result = await callFunction("registerSecuritySession", {
    sessionId,
    deviceLabel: deviceLabel()
  });
  return { ...result, sessionId };
}

export async function heartbeatSecuritySession() {
  const sessionId = getSessionId();
  return callFunction("heartbeatSecuritySession", { sessionId });
}

export async function endCurrentSecuritySession() {
  const sessionId = memorySessionId || (() => {
    try { return sessionStorage.getItem(SESSION_STORAGE_KEY); } catch (_) { return null; }
  })();
  if (!sessionId) return { ok: true, skipped: true };
  try {
    return await callFunction("endSecuritySession", { sessionId });
  } finally {
    memorySessionId = null;
    try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (_) { /* ignore storage restrictions */ }
  }
}

export async function listMySecuritySessions() {
  return callFunction("listMySecuritySessions");
}

export async function revokeMySecuritySessions() {
  const result = await callFunction("revokeMySecuritySessions");
  memorySessionId = null;
  try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (_) { /* ignore */ }
  return result;
}

export async function reportSecuritySignal(eventType, metadata = {}) {
  try {
    return await callFunction("recordSecuritySignal", {
      eventType,
      route: String(metadata.route || location.pathname).slice(0, 100),
      code: String(metadata.code || "").slice(0, 80)
    });
  } catch (error) {
    console.warn("Security signal could not be submitted:", error?.code || error?.message || error);
    return { ok: false };
  }
}

export async function getSecurityOverview() {
  return callFunction("getSecurityOverview");
}

export async function resolveSecurityAlert(alertId) {
  return callFunction("resolveSecurityAlert", { alertId });
}

export async function revokeUserSecuritySessions(targetUid) {
  return callFunction("revokeUserSecuritySessions", { targetUid });
}
