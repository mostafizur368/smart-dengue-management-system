import { initializeAppCheckIfConfigured } from "./firebase-app-check.js";
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  startSecuritySession,
  heartbeatSecuritySession,
  endCurrentSecuritySession,
  listMySecuritySessions,
  revokeMySecuritySessions
} from "./security-client.js";

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
let heartbeatTimer = null;
let panel = null;

function loginPath() {
  return location.pathname.includes("/assets/") ? "../../login.html" : "login.html";
}

function make(tag, text, className = "") {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function ensurePanel() {
  if (panel) return panel;
  panel = document.createElement("section");
  panel.id = "security-session-panel";
  panel.style.cssText = "max-width:1100px;margin:18px auto;padding:18px;border:1px solid #cbdada;border-radius:14px;background:#fff;color:#17313a;box-shadow:0 3px 12px rgba(15,55,60,.04);";
  const heading = make("h2", "🔐 Account Security · Active Sessions");
  heading.style.cssText = "margin:0 0 8px;font-size:20px;";
  const intro = make("p", "Review browsers signed in to your account. Device labels are approximate; stale sessions may remain visible briefly.");
  intro.style.cssText = "margin:0 0 10px;color:#60747b;font-size:13px;line-height:1.5;";
  const status = make("p", "Connecting to secure session service…");
  status.id = "security-session-status";
  status.setAttribute("role", "status");
  const actions = make("div");
  actions.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;";
  const buttonStyle = "padding:9px 12px;border-radius:8px;border:1px solid #cbdada;cursor:pointer;font-weight:700;";
  const refresh = make("button", "Refresh sessions");
  refresh.type = "button";
  refresh.style.cssText = buttonStyle + "background:#e8f2f2;color:#075e56;";
  refresh.addEventListener("click", refreshSessions);
  const end = make("button", "Sign out this device");
  end.type = "button";
  end.style.cssText = buttonStyle + "background:#fff;color:#a32620;";
  end.addEventListener("click", async () => {
    end.disabled = true;
    try { await endCurrentSecuritySession(); } catch (error) { console.warn(error); }
    await signOut(auth);
    location.href = loginPath();
  });
  const revoke = make("button", "Sign out all devices");
  revoke.type = "button";
  revoke.style.cssText = buttonStyle + "background:#a32620;color:#fff;border-color:#a32620;";
  revoke.addEventListener("click", async () => {
    if (!confirm("Sign out this account from all registered devices? You will also be signed out here.")) return;
    revoke.disabled = true;
    status.textContent = "Revoking refresh tokens and closing registered sessions…";
    try {
      const result = await revokeMySecuritySessions();
      status.textContent = `${result.revokedCount || 0} registered session(s) marked inactive. Signing out this device…`;
      await signOut(auth);
      location.href = loginPath();
    } catch (error) {
      status.textContent = `Could not revoke sessions: ${error.code || error.message}. Check that Batch 11 Cloud Functions are deployed.`;
      revoke.disabled = false;
    }
  });
  actions.append(refresh, end, revoke);
  const list = make("div");
  list.id = "security-session-list";
  list.style.cssText = "display:grid;gap:8px;";
  panel.append(heading, intro, status, actions, list);
  const main = document.querySelector("main") || document.body;
  main.appendChild(panel);
  return panel;
}

function dateText(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

async function refreshSessions() {
  const status = document.getElementById("security-session-status");
  const list = document.getElementById("security-session-list");
  if (!status || !list) return;
  status.textContent = "Loading registered sessions…";
  list.replaceChildren();
  try {
    const result = await listMySecuritySessions();
    const sessions = Array.isArray(result.sessions) ? result.sessions : [];
    if (!sessions.length) {
      list.appendChild(make("p", "No session records were returned. The session service may have just been enabled."));
    }
    sessions.forEach(session => {
      const card = make("article");
      card.style.cssText = "padding:10px 12px;border:1px solid #dce8e8;border-radius:9px;background:#f8fbfb;";
      const activeRecent = session.active && session.lastSeenAt && Date.now() - session.lastSeenAt <= 20 * 60 * 1000;
      const label = make("strong", `${session.deviceLabel || "Unknown device"} · ${activeRecent ? "Recently active" : session.active ? "Possibly stale" : "Ended / revoked"}`);
      const details = make("p", `Last seen: ${dateText(session.lastSeenAt)} · Started: ${dateText(session.createdAt)}`);
      details.style.cssText = "margin:5px 0 0;font-size:12px;color:#60747b;";
      card.append(label, details);
      list.appendChild(card);
    });
    status.textContent = `${sessions.length} recent session record(s) loaded. A session is marked recently active when its heartbeat was received in the last 20 minutes.`;
  } catch (error) {
    console.warn("Security session list unavailable:", error);
    status.textContent = `Session service unavailable (${error.code || error.message}). Deploy the Batch 11 Cloud Functions to activate this control.`;
  }
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    panel?.remove();
    panel = null;
    return;
  }
  ensurePanel();
  const status = document.getElementById("security-session-status");
  try {
    await startSecuritySession(user);
    status.textContent = "This browser session is registered with the security service.";
    await refreshSessions();
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(async () => {
      try {
        await heartbeatSecuritySession();
      } catch (error) {
        console.warn("Security session heartbeat failed:", error);
        if (error?.code === "functions/unauthenticated") {
          status.textContent = "This session was revoked or expired. Please sign in again.";
          await signOut(auth);
          location.href = loginPath();
        }
      }
    }, 5 * 60 * 1000);
  } catch (error) {
    console.warn("Security session registration unavailable:", error);
    status.textContent = `Session registration is not active yet (${error.code || error.message}). The website can still be used; deploy the Batch 11 Cloud Functions to enable it.`;
  }
});

window.addEventListener("unhandledrejection", event => {
  const error = event.reason;
  if (error?.code === "permission-denied" || error?.code === "firestore/permission-denied") {
    // This is a client-reported signal for Admin review, not proof of an intrusion.
    import("./security-client.js").then(module => module.reportSecuritySignal("permission_denied", {
      route: location.pathname,
      code: error.code
    }));
  }
});
