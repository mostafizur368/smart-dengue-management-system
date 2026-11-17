import { initializeAppCheckIfConfigured } from "./firebase-app-check.js";
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getSecurityOverview, resolveSecurityAlert, revokeUserSecuritySessions } from "./security-client.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnup3vd_NNkSKrhHtuZdQDJ0kuBZAci9o",
  authDomain: "smart-dengue-management-system.firebaseapp.com",
  projectId: "smart-dengue-management-system",
  storageBucket: "smart-dengue-management-system.firebasestorage.app",
  messagingSenderId: "164368465699",
  appId: "1:164368465699:web:79fe552bea0b2bfc405696",
  measurementId: "G-384ZPGT9NN"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
initializeAppCheckIfConfigured(app);
const auth = getAuth(app);
const $ = id => document.getElementById(id);

function node(tag, text, style = "") {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (style) item.style.cssText = style;
  return item;
}
function dateText(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}
function addMetric(parent, label, value, hint) {
  const card = node("article", undefined, "padding:14px;border:1px solid #dbe5ec;border-radius:10px;background:#fff;");
  card.append(node("p", label, "margin:0;color:#64748b;font-size:12px;"));
  card.append(node("strong", String(value), "display:block;margin:5px 0;font-size:25px;color:#0f766e;"));
  card.append(node("p", hint, "margin:0;color:#64748b;font-size:11px;"));
  parent.append(card);
}

async function loadSecurityOverview() {
  const status = $("security-admin-status");
  const metrics = $("security-admin-metrics");
  const alertsBox = $("security-admin-alerts");
  const eventsBody = $("security-admin-events");
  const sessionsBody = $("security-admin-sessions");
  if (!status || !metrics || !alertsBox || !eventsBody || !sessionsBody) return;
  status.textContent = "Loading server-verified security overview…";
  metrics.replaceChildren(); alertsBox.replaceChildren(); eventsBody.replaceChildren(); sessionsBody.replaceChildren();

  try {
    const data = await getSecurityOverview();
    const events = Array.isArray(data.events) ? data.events : [];
    const alerts = Array.isArray(data.alerts) ? data.alerts : [];
    const sessions = Array.isArray(data.sessions) ? data.sessions : [];
    const openAlerts = alerts.filter(item => item.status !== "resolved");
    addMetric(metrics, "Open alerts", openAlerts.length, "Automated signals; not confirmed attacks");
    addMetric(metrics, "Active session records", data.activeSessionCount || sessions.length, "Recent server-registered sessions");
    addMetric(metrics, "Recent security events", events.length, "Latest 60 events");

    if (!openAlerts.length) alertsBox.append(node("p", "No unresolved security alerts in the latest alert sample."));
    openAlerts.forEach(alert => {
      const card = node("article", undefined, "padding:12px;border:1px solid #f0d6a8;border-radius:9px;background:#fffbeb;display:grid;gap:7px;");
      card.append(node("strong", `${String(alert.severity || "medium").toUpperCase()} · ${alert.alertType || "Security signal"}`));
      card.append(node("p", alert.summary || "No summary supplied.", "margin:0;line-height:1.45;"));
      card.append(node("small", `User UID: ${alert.userId || "—"} · ${dateText(alert.createdAt)}`, "color:#64748b;overflow-wrap:anywhere;"));
      const resolve = node("button", "Mark reviewed / resolve", "justify-self:start;padding:7px 10px;border:0;border-radius:7px;background:#0f766e;color:#fff;cursor:pointer;");
      resolve.type = "button";
      resolve.addEventListener("click", async () => {
        if (!confirm("Mark this security alert as reviewed and resolved?")) return;
        resolve.disabled = true;
        try { await resolveSecurityAlert(alert.id); await loadSecurityOverview(); }
        catch (error) { resolve.disabled = false; alertBox.append(node("p", `Could not resolve alert: ${error.code || error.message}`)); }
      });
      card.append(resolve);
      alertsBox.append(card);
    });

    if (!events.length) eventsBody.append(rowMessage(5, "No security events have been recorded yet."));
    events.forEach(event => {
      const tr = document.createElement("tr");
      [dateText(event.createdAt), event.userId || "—", event.eventType || "—", event.severity || "—", event.summary || "—"].forEach(value => {
        const td = node("td", value, "padding:8px;border-bottom:1px solid #e2e8f0;vertical-align:top;overflow-wrap:anywhere;font-size:12px;");
        tr.append(td);
      });
      eventsBody.append(tr);
    });

    if (!sessions.length) sessionsBody.append(rowMessage(4, "No active session records in the current sample."));
    sessions.forEach(session => {
      const tr = document.createElement("tr");
      [session.userId || "—", session.deviceLabel || "Unknown device", dateText(session.lastSeenAt)].forEach(value => {
        tr.append(node("td", value, "padding:8px;border-bottom:1px solid #e2e8f0;vertical-align:top;overflow-wrap:anywhere;font-size:12px;"));
      });
      const actionCell = document.createElement("td");
      const isCurrentAdmin = auth.currentUser && session.userId === auth.currentUser.uid;
      const button = node("button", isCurrentAdmin ? "Use your session controls" : "Revoke all sessions for user", "padding:6px 8px;border:0;border-radius:6px;background:#a32620;color:#fff;cursor:pointer;font-size:11px;");
      button.type = "button";
      button.disabled = Boolean(isCurrentAdmin);
      button.addEventListener("click", async () => {
        if (!confirm(`Revoke refresh tokens for user ${session.userId}? This signs that account out on registered devices after token expiry/refresh.`)) return;
        button.disabled = true;
        try { await revokeUserSecuritySessions(session.userId); await loadSecurityOverview(); }
        catch (error) { button.disabled = false; alert(`Could not revoke sessions: ${error.code || error.message}`); }
      });
      actionCell.append(button); tr.append(actionCell); sessionsBody.append(tr);
    });

    status.textContent = `Security overview refreshed ${new Date(data.generatedAt || Date.now()).toLocaleTimeString()}. Only server-authorized Admin accounts can retrieve this data.`;
  } catch (error) {
    console.error("Security Admin overview unavailable:", error);
    status.textContent = `Security service unavailable (${error.code || error.message}). Deploy the Batch 11 Cloud Functions and Firestore Rules before using this dashboard.`;
  }
}

function rowMessage(colspan, message) {
  const tr = document.createElement("tr");
  const td = node("td", message, "padding:10px;color:#64748b;");
  td.colSpan = colspan; tr.append(td); return tr;
}

onAuthStateChanged(auth, user => {
  if (!user) return;
  const refreshButton = $("security-admin-refresh");
  if (refreshButton && refreshButton.dataset.bound !== "true") {
    refreshButton.addEventListener("click", loadSecurityOverview);
    refreshButton.dataset.bound = "true";
  }
  loadSecurityOverview();
});
