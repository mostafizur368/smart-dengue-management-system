import { getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, collection, getDocs, query, where,
  limit, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
let currentUser = null;

function status(message, bad = false) {
  const node = $("privacy-consent-status");
  if (node) {
    node.textContent = message;
    node.style.color = bad ? "#a32620" : "#60747b";
  }
}
function dateText(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "Date unavailable";
}
function row(text) {
  const node = document.createElement("article");
  node.className = "record";
  node.textContent = text;
  return node;
}

async function loadConsentHistory() {
  const box = $("privacy-consent-history");
  if (!box || !currentUser) return;
  box.replaceChildren();
  try {
    const snapshot = await getDocs(query(
      collection(db, "patient_consent_records"),
      where("userId", "==", currentUser.uid),
      limit(50)
    ));
    if (snapshot.empty) {
      box.append(row("No consent changes have been recorded yet. Optional chatbot analytics is off by default."));
      return;
    }
    snapshot.docs
      .sort((a, b) => (b.data().createdAt?.toMillis?.() || 0) - (a.data().createdAt?.toMillis?.() || 0))
      .slice(0, 10)
      .forEach(item => {
        const data = item.data();
        const decision = data.decision === "granted" ? "Allowed" : "Withdrawn";
        box.append(row(`${decision} · Optional chatbot analytics · ${dateText(data.createdAt)}`));
      });
  } catch (error) {
    box.append(row(`Consent history unavailable: ${error.code || error.message}`));
  }
}

async function loadPreferences() {
  if (!currentUser) return;
  const checkbox = $("privacy-chatbot-analytics");
  if (!checkbox) return;
  status("Loading your saved privacy choice…");
  try {
    const snapshot = await getDoc(doc(db, "patient_privacy_preferences", currentUser.uid));
    const enabled = snapshot.exists() && snapshot.data().optionalChatbotAnalytics === true;
    checkbox.checked = enabled;
    window.dispatchEvent(new CustomEvent("smart-dengue:privacy-preferences-updated", {
      detail: { optionalChatbotAnalytics: enabled, uid: currentUser.uid }
    }));
    status(enabled
      ? "Optional chatbot analytics is enabled. You can withdraw consent at any time."
      : "Optional chatbot analytics is off. No new chatbot question analytics will be stored for this account.");
    await loadConsentHistory();
  } catch (error) {
    checkbox.checked = false;
    status(`Could not load privacy preferences: ${error.code || error.message}`, true);
  }
}

async function savePreferences() {
  if (!currentUser) {
    status("Sign in to save privacy preferences.", true);
    return;
  }
  const checkbox = $("privacy-chatbot-analytics");
  const save = $("privacy-consent-save");
  const enabled = Boolean(checkbox?.checked);
  if (save) save.disabled = true;
  status("Saving your privacy choice…");
  try {
    const preferenceRef = doc(db, "patient_privacy_preferences", currentUser.uid);
    const consentRef = doc(collection(db, "patient_consent_records"));
    const batch = writeBatch(db);
    batch.set(preferenceRef, {
      userId: currentUser.uid,
      optionalChatbotAnalytics: enabled,
      policyVersion: 1,
      updatedAt: serverTimestamp()
    });
    batch.set(consentRef, {
      userId: currentUser.uid,
      purpose: "chatbot_analytics",
      decision: enabled ? "granted" : "withdrawn",
      policyVersion: 1,
      source: "patient_dashboard",
      createdAt: serverTimestamp()
    });
    await batch.commit();

    window.dispatchEvent(new CustomEvent("smart-dengue:privacy-preferences-updated", {
      detail: { optionalChatbotAnalytics: enabled, uid: currentUser.uid }
    }));
    status(enabled
      ? "Consent saved. Future chatbot questions may be stored for optional analytics."
      : "Consent withdrawn. Future chatbot question analytics is now disabled.");
    await loadConsentHistory();
  } catch (error) {
    status(`Could not save consent: ${error.code || error.message}`, true);
  } finally {
    if (save) save.disabled = false;
  }
}

$("privacy-consent-save")?.addEventListener("click", savePreferences);
$("privacy-consent-refresh")?.addEventListener("click", loadPreferences);

onAuthStateChanged(auth, user => {
  currentUser = user;
  const section = $("patient-privacy-consent");
  if (!section) return;
  if (!user) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  loadPreferences();
});
