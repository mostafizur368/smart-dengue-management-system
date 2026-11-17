import { getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js";

const app = getApp();
const auth = getAuth(app);
const functions = getFunctions(app, "asia-south1");
const $ = id => document.getElementById(id);

function call(name, payload = {}) {
  return httpsCallable(functions, name)(payload).then(result => result.data || {});
}
function el(tag, text, style = "") {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = String(text);
  if (style) node.style.cssText = style;
  return node;
}
function setStatus(id, text, bad = false) {
  const node = $(id);
  if (node) {
    node.textContent = text;
    node.style.color = bad ? "#a32620" : "#475569";
  }
}
function dateText(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}
function metric(parent, title, value, note) {
  const card = el("article", undefined, "padding:13px;border:1px solid #dbe5ec;border-radius:10px;background:#fff;");
  card.append(el("p", title, "margin:0;color:#64748b;font-size:12px;"));
  card.append(el("strong", value, "display:block;margin:5px 0;font-size:24px;color:#0f766e;"));
  card.append(el("small", note, "color:#64748b;"));
  parent.append(card);
}

async function loadBackupOverview() {
  const box = $("reliability-backup-list");
  const verify = $("reliability-backup-verify");
  if (!box) return;
  box.replaceChildren();
  setStatus("reliability-backup-status", "Loading backup run history…");
  try {
    const result = await call("getBackupOverview");
    const runs = Array.isArray(result.runs) ? result.runs : [];
    if (!runs.length) {
      box.append(el("p", "No Cloud Storage Firestore backup run has been recorded yet. Source code alone does not mean a backup has executed."));
      if (verify) verify.disabled = true;
      setStatus("reliability-backup-status", "No completed backup is recorded. Deploy the scheduled function and verify the private bucket configuration.");
      return;
    }
    if (verify) verify.disabled = !runs.some(item => item.status === "completed" && item.prefix);
    runs.forEach(run => {
      const card = el("article", undefined, "padding:12px;border:1px solid #dbe5ec;border-radius:9px;background:#fff;display:grid;gap:5px;");
      card.append(el("strong", `${String(run.status || "unknown").toUpperCase()} · ${run.trigger || "backup"}`));
      card.append(el("small", `Started: ${dateText(run.startedAt)} · Completed: ${dateText(run.completedAt)}`, "color:#64748b;"));
      card.append(el("p", `${run.documentCount || 0} documents · ${run.fileCount || 0} files · ${run.collectionCount || 0} collections`, "margin:0;font-size:13px;"));
      card.append(el("small", `Run: ${run.runId || "—"} · Bucket: ${run.bucket || "—"}`, "color:#64748b;overflow-wrap:anywhere;"));
      if (run.errorCode) card.append(el("small", `Error code: ${run.errorCode}`, "color:#a32620;"));
      box.append(card);
    });
    const latestComplete = runs.find(item => item.status === "completed" && item.prefix);
    if (verify) verify.dataset.prefix = latestComplete?.prefix || "";
    setStatus("reliability-backup-status", `Loaded ${runs.length} recent backup run(s). Latest completed run: ${latestComplete ? dateText(latestComplete.completedAt) : "none"}.`);
  } catch (error) {
    setStatus("reliability-backup-status", `Backup history unavailable: ${error.code || error.message}. Deploy the operations Cloud Functions first.`, true);
  }
}

async function runManualBackup() {
  const button = $("reliability-backup-run");
  if (!confirm("Start a full Firestore backup to the configured private Cloud Storage bucket? This may use billed Cloud Functions and Storage resources.")) return;
  if (button) button.disabled = true;
  setStatus("reliability-backup-status", "Starting a full Firestore backup. Keep this page open while the function runs…");
  try {
    const result = await call("runManualFirestoreBackup");
    setStatus("reliability-backup-status", `Manual backup completed: ${result.documentCount || 0} documents, ${result.fileCount || 0} files. Run ${result.runId || "—"}.`);
    await loadBackupOverview();
  } catch (error) {
    setStatus("reliability-backup-status", `Manual backup failed: ${error.code || error.message}. Check backup configuration and Functions logs.`, true);
    await loadBackupOverview();
  } finally {
    if (button) button.disabled = false;
  }
}

async function verifyLatestBackup() {
  const button = $("reliability-backup-verify");
  const prefix = button?.dataset.prefix || "";
  if (!prefix) {
    setStatus("reliability-backup-status", "No completed backup is available to verify.", true);
    return;
  }
  if (button) button.disabled = true;
  setStatus("reliability-backup-status", "Verifying manifest and SHA-256 checksums. This may take a while…");
  try {
    const result = await call("verifyBackupRun", { prefix });
    if (result.verificationType === "legacy-presence-only") {
      setStatus("reliability-backup-status", result.message || "Legacy backup: checksums are not available.", true);
    } else if (result.verified) {
      setStatus("reliability-backup-status", `Backup integrity verified: ${result.verifiedFiles}/${result.expectedFiles} objects. ${result.documentCount} documents recorded.`);
    } else {
      setStatus("reliability-backup-status", `Backup verification failed: ${result.verifiedFiles || 0}/${result.expectedFiles || 0} objects verified. Review the bucket and manifest.`, true);
    }
  } catch (error) {
    setStatus("reliability-backup-status", `Backup verification failed: ${error.code || error.message}`, true);
  } finally {
    if (button) button.disabled = false;
  }
}

async function loadSystemHealth() {
  const metrics = $("reliability-health-metrics");
  const history = $("reliability-health-history");
  if (!metrics || !history) return;
  metrics.replaceChildren();
  history.replaceChildren();
  setStatus("reliability-health-status", "Checking Firebase and web-server health…");
  try {
    const [result, serverResponse] = await Promise.all([
      call("getSystemHealthOverview"),
      fetch("/api/health", { cache: "no-store", credentials: "same-origin" }).catch(() => null)
    ]);
    const live = result.live || {};
    const serverData = serverResponse && serverResponse.ok ? await serverResponse.json() : null;
    metric(metrics, "Firebase Firestore", live.firestore || "unknown", "Admin SDK connectivity probe");
    metric(metrics, "Cloud Storage", live.storage || "unknown", "Configured backup bucket metadata");
    metric(metrics, "Web server", serverData?.status || "unavailable", "Render /api/health endpoint");
    metric(metrics, "Probe duration", `${Number(live.durationMs || 0)} ms`, "Latest live check");
    const rows = Array.isArray(result.history) ? result.history : [];
    if (!rows.length) history.append(el("p", "No scheduled health probe history yet. Deploy scheduledSystemHealthProbe to start the 15-minute checks."));
    rows.forEach(item => {
      const status = `${item.overall || "unknown"} · Firestore ${item.firestore || "?"} · Storage ${item.storage || "?"}`;
      history.append(el("article", `${dateText(item.checkedAt)} — ${status} (${item.durationMs || 0} ms)`, "padding:9px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;"));
    });
    setStatus("reliability-health-status", `Live probe completed ${new Date(result.generatedAt || Date.now()).toLocaleTimeString()}. Historical checks are sampled, not a guarantee of continuous availability.`);
  } catch (error) {
    setStatus("reliability-health-status", `System health service unavailable: ${error.code || error.message}`, true);
  }
}

async function loadIncidents() {
  const box = $("incident-response-list");
  const history = $("incident-response-history");
  if (!box || !history) return;
  box.replaceChildren(); history.replaceChildren();
  setStatus("incident-response-status", "Loading incident records…");
  try {
    const result = await call("listSecurityIncidents");
    const incidents = Array.isArray(result.incidents) ? result.incidents : [];
    const events = Array.isArray(result.events) ? result.events : [];
    if (!incidents.length) box.append(el("p", "No incidents have been recorded."));
    incidents.forEach(item => {
      const card = el("article", undefined, "padding:12px;border:1px solid #dbe5ec;border-radius:9px;background:#fff;display:grid;gap:7px;");
      card.append(el("strong", `${String(item.severity || "medium").toUpperCase()} · ${item.title || "Untitled incident"}`));
      card.append(el("small", `${item.category || "other"} · ${item.status || "open"} · ${dateText(item.createdAt)} · Source: ${item.source || "—"}`, "color:#64748b;"));
      card.append(el("p", item.description || "", "margin:0;font-size:13px;white-space:pre-wrap;"));
      const actions = el("div", undefined, "display:flex;gap:7px;flex-wrap:wrap;");
      for (const [status, label] of [["triaged","Mark triaged"],["investigating","Investigating"],["resolved","Resolve"]]) {
        if (item.status === status || item.status === "closed") continue;
        const button = el("button", label, "padding:7px 10px;border:0;border-radius:7px;background:#0f766e;color:#fff;cursor:pointer;font-size:12px;");
        button.type = "button";
        button.addEventListener("click", async () => {
          button.disabled = true;
          try {
            await call("updateSecurityIncident", {
              incidentId: item.id,
              status,
              note: `Status changed to ${status} from Admin Security Operations Center.`
            });
            await loadIncidents();
          } catch (error) {
            button.disabled = false;
            setStatus("incident-response-status", `Could not update incident: ${error.code || error.message}`, true);
          }
        });
        actions.append(button);
      }
      card.append(actions);
      box.append(card);
    });
    if (!events.length) history.append(el("p", "No incident events yet."));
    events.slice(0, 30).forEach(event => {
      history.append(el("article",
        `${dateText(event.createdAt)} · ${event.action || "event"} · ${event.incidentId || "—"} · ${event.note || ""}`,
        "padding:8px;border-bottom:1px solid #e2e8f0;font-size:12px;overflow-wrap:anywhere;"
      ));
    });
    setStatus("incident-response-status", `Loaded ${incidents.length} incidents and ${events.length} recent audit events.`);
  } catch (error) {
    setStatus("incident-response-status", `Incident service unavailable: ${error.code || error.message}`, true);
  }
}

async function createIncident(event) {
  event.preventDefault();
  const form = $("incident-response-form");
  const button = $("incident-response-create");
  const title = $("incident-response-title")?.value.trim() || "";
  const category = $("incident-response-category")?.value || "other";
  const severity = $("incident-response-severity")?.value || "medium";
  const description = $("incident-response-description")?.value.trim() || "";
  if (title.length < 5 || description.length < 10) {
    setStatus("incident-response-status", "Enter a title (at least 5 characters) and description (at least 10 characters).", true);
    return;
  }
  if (!confirm("Create this incident record? Do not include patient names, phone numbers, passwords, OTPs or medical details.")) return;
  if (button) button.disabled = true;
  setStatus("incident-response-status", "Creating incident…");
  try {
    const result = await call("createSecurityIncident", { title, category, severity, description });
    form.reset();
    setStatus("incident-response-status", `Incident created: ${result.incidentId}`);
    await loadIncidents();
  } catch (error) {
    setStatus("incident-response-status", `Could not create incident: ${error.code || error.message}`, true);
  } finally {
    if (button) button.disabled = false;
  }
}

$("reliability-backup-refresh")?.addEventListener("click", loadBackupOverview);
$("reliability-backup-run")?.addEventListener("click", runManualBackup);
$("reliability-backup-verify")?.addEventListener("click", verifyLatestBackup);
$("reliability-health-refresh")?.addEventListener("click", loadSystemHealth);
$("incident-response-refresh")?.addEventListener("click", loadIncidents);
$("incident-response-form")?.addEventListener("submit", createIncident);

onAuthStateChanged(auth, user => {
  if (!user) return;
  // Each callable independently verifies the Firebase token and Admin role server-side.
  loadBackupOverview();
  loadSystemHealth();
  loadIncidents();
});
