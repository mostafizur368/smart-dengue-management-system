import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, query, where, limit,
  setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  extractLabValuesFromOcr,
  buildRecoveryTimeline,
  buildPatientReportHtml
} from "./patient-report-utils.mjs";

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
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
const setStatus = (id, message, isError = false) => {
  const node = $(id);
  if (node) {
    node.textContent = message;
    node.style.color = isError ? "#a32620" : "#60747b";
  }
};
const make = (tag, value, className = "") => {
  const node = document.createElement(tag);
  node.textContent = String(value ?? "—");
  if (className) node.className = className;
  return node;
};

let currentUser = null;
let medicalHistory = null;
let patientData = { symptoms: [], reports: [], hydration: [], medications: [] };
let selectedOcrFile = null;
let ocrSuggestions = null;
let previewUrl = null;
let medicationReminderTimer = null;

async function getOwnedRecords(collectionName) {
  const snapshot = await getDocs(query(
    collection(db, collectionName),
    where("userId", "==", currentUser.uid),
    limit(100)
  ));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function loadPatientIntelligenceData() {
  const [historySnapshot, symptoms, reports, hydration, medications] = await Promise.all([
    getDoc(doc(db, "patient_medical_history", currentUser.uid)),
    getOwnedRecords("symptom_logs"),
    getOwnedRecords("blood_reports"),
    getOwnedRecords("hydration_logs"),
    getOwnedRecords("patient_medications")
  ]);
  medicalHistory = historySnapshot.exists() ? historySnapshot.data() : null;
  patientData = { symptoms, reports, hydration, medications };

  if (medicalHistory) {
    $("medical-conditions").value = medicalHistory.conditions || "";
    $("medical-allergies").value = medicalHistory.allergies || "";
    $("medical-history-notes").value = medicalHistory.notes || "";
    $("medical-emergency-contact").value = medicalHistory.emergencyContact || "";
  }
  renderMedicationReminders();
  renderRecoveryTimeline();
  checkDueMedicationReminders();
  scheduleNextMedicationReminder();
}

async function saveMedicalHistory(event) {
  event.preventDefault();
  const record = {
    userId: currentUser.uid,
    conditions: $("medical-conditions").value.trim().slice(0, 1500),
    allergies: $("medical-allergies").value.trim().slice(0, 1000),
    notes: $("medical-history-notes").value.trim().slice(0, 1500),
    emergencyContact: $("medical-emergency-contact").value.trim().slice(0, 80),
    updatedAt: serverTimestamp()
  };
  try {
    await setDoc(doc(db, "patient_medical_history", currentUser.uid), record, { merge: true });
    medicalHistory = {
      conditions: record.conditions,
      allergies: record.allergies,
      notes: record.notes,
      emergencyContact: record.emergencyContact
    };
    setStatus("medical-history-status", "Medical history saved privately to your account.");
  } catch (error) {
    setStatus("medical-history-status", `Could not save: ${error.code || error.message}. Check the merged Firestore Rules.`, true);
  }
}

function renderMedicationReminders() {
  const box = $("medication-list");
  if (!box) return;
  box.replaceChildren();
  if (!patientData.medications.length) {
    box.append(make("p", "No medication reminders saved yet.", "empty"));
    return;
  }

  [...patientData.medications]
    .sort((a, b) => String(a.nextReminderAt || "").localeCompare(String(b.nextReminderAt || "")))
    .forEach(item => {
      const card = make("article", "");
      card.className = "record";
      card.append(make("strong", item.name));
      card.append(make("p", `Prescribed instruction: ${item.dose || "Not entered"}`));
      card.append(make("p", `Schedule: ${item.schedule || "Not entered"}`));
      card.append(make("p", `Next reminder: ${item.nextReminderAt ? new Date(item.nextReminderAt).toLocaleString() : "Not set"}`));
      if (item.notes) card.append(make("p", item.notes, "small muted"));
      const due = item.active !== false && item.nextReminderAt && Date.parse(item.nextReminderAt) <= Date.now();
      card.append(make("span", item.active === false ? "Inactive" : due ? "Due — check your clinician's instruction" : "Active reminder", due ? "pill warn" : "pill"));

      const actions = make("div", "");
      actions.className = "actions";
      const toggle = make("button", item.active === false ? "Reactivate" : "Mark inactive");
      toggle.type = "button";
      toggle.className = "secondary";
      toggle.addEventListener("click", async () => {
        try {
          await updateDoc(doc(db, "patient_medications", item.id), {
            active: item.active === false,
            updatedAt: serverTimestamp()
          });
          await loadPatientIntelligenceData();
          setStatus("medication-status", "Reminder status updated. Your prescription has not been changed.");
        } catch (error) {
          setStatus("medication-status", `Could not update reminder: ${error.code || error.message}`, true);
        }
      });
      const remove = make("button", "Delete");
      remove.type = "button";
      remove.className = "danger";
      remove.addEventListener("click", async () => {
        if (!confirm("Delete this reminder from your account? This does not change any prescription.")) return;
        try {
          await deleteDoc(doc(db, "patient_medications", item.id));
          await loadPatientIntelligenceData();
          setStatus("medication-status", "Reminder deleted.");
        } catch (error) {
          setStatus("medication-status", `Could not delete reminder: ${error.code || error.message}`, true);
        }
      });
      actions.append(toggle, remove);
      card.append(actions);
      box.append(card);
    });
}

async function addMedicationReminder(event) {
  event.preventDefault();
  const name = $("medication-name").value.trim();
  const dose = $("medication-dose").value.trim();
  const schedule = $("medication-schedule").value.trim();
  const nextValue = $("medication-next-reminder").value;
  if (!name || !dose || !schedule || !nextValue) {
    setStatus("medication-status", "Enter the medicine name, clinician-prescribed instruction, schedule and next reminder time.", true);
    return;
  }
  const nextDate = new Date(nextValue);
  if (Number.isNaN(nextDate.getTime())) {
    setStatus("medication-status", "Enter a valid next reminder date and time.", true);
    return;
  }
  try {
    await addDoc(collection(db, "patient_medications"), {
      userId: currentUser.uid,
      name: name.slice(0, 100),
      dose: dose.slice(0, 120),
      schedule: schedule.slice(0, 120),
      notes: $("medication-notes").value.trim().slice(0, 400),
      nextReminderAt: nextDate.toISOString(),
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    $("medication-form").reset();
    setStatus("medication-status", "One-time reminder saved. This app does not prescribe medicine or repeat the reminder automatically.");
    await loadPatientIntelligenceData();
  } catch (error) {
    setStatus("medication-status", `Could not save reminder: ${error.code || error.message}. Check Firestore Rules.`, true);
  }
}

function dueReminderItems() {
  const now = Date.now();
  return patientData.medications.filter(item =>
    item.active !== false && item.nextReminderAt &&
    Number.isFinite(Date.parse(item.nextReminderAt)) &&
    Date.parse(item.nextReminderAt) <= now
  );
}

function checkDueMedicationReminders() {
  const due = dueReminderItems();
  const statusNode = $("medication-notification-status");
  if (!due.length) {
    if (statusNode) statusNode.textContent = "No medication reminders are due right now.";
    return;
  }
  const names = due.map(item => item.name).join(", ");
  if (statusNode) statusNode.textContent = `Reminder due: ${names}. Follow only the instructions already given by your clinician.`;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  due.forEach(item => {
    const key = `smd.medication.reminded.${currentUser.uid}.${item.id}.${item.nextReminderAt}`;
    if (sessionStorage.getItem(key)) return;
    new Notification("Medication reminder", {
      body: `${item.name}: ${item.dose}. Follow the schedule prescribed by your clinician.`,
      tag: key
    });
    sessionStorage.setItem(key, "yes");
  });
}

function scheduleNextMedicationReminder() {
  if (medicationReminderTimer) clearTimeout(medicationReminderTimer);
  const future = patientData.medications
    .filter(item => item.active !== false && item.nextReminderAt && Date.parse(item.nextReminderAt) > Date.now())
    .map(item => Date.parse(item.nextReminderAt))
    .sort((a, b) => a - b)[0];
  if (!future) return;
  const delay = Math.max(1000, Math.min(future - Date.now(), 2147480000));
  medicationReminderTimer = setTimeout(() => {
    checkDueMedicationReminders();
    scheduleNextMedicationReminder();
  }, delay);
}

async function enableMedicationNotifications() {
  if (!("Notification" in window)) {
    setStatus("medication-notification-status", "This browser does not support notifications. In-dashboard reminders remain available.", true);
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setStatus("medication-notification-status", "Browser notifications enabled for this browser. Keep the dashboard open for scheduled reminders.");
      checkDueMedicationReminders();
    } else {
      setStatus("medication-notification-status", "Notifications were not enabled. You can still see due reminders while the dashboard is open.");
    }
  } catch (error) {
    setStatus("medication-notification-status", "Could not request notification permission. Use the in-dashboard reminder list.", true);
  }
}

function renderRecoveryTimeline() {
  const box = $("recovery-progress");
  if (!box) return;
  box.replaceChildren();
  const timeline = buildRecoveryTimeline(patientData).slice(0, 40);
  if (!timeline.length) {
    box.append(make("p", "No symptom, blood-report or fluid records are available yet.", "empty"));
  } else {
    const list = document.createElement("ol");
    list.className = "recovery-timeline";
    timeline.forEach(item => {
      const row = document.createElement("li");
      row.className = "recovery-timeline-item";
      row.append(make("strong", `${item.date} · ${item.kind}`));
      row.append(make("p", item.detail));
      list.append(row);
    });
    box.append(list);
  }
  box.append(make("p", "This is a chronological record of information you entered. It does not score recovery, predict outcomes, confirm dengue has resolved, or replace clinical assessment.", "help"));
}

function handleOcrFileChange() {
  const file = $("lab-ocr-file")?.files?.[0] || null;
  selectedOcrFile = null;
  ocrSuggestions = null;
  $("lab-ocr-apply").disabled = true;
  $("lab-ocr-suggestions").replaceChildren();
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  const preview = $("lab-ocr-preview");
  preview.hidden = true;
  preview.removeAttribute("src");

  if (!file) {
    setStatus("lab-ocr-status", "Choose a clear JPG, PNG or WebP image (maximum 8 MB).");
    return;
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    $("lab-ocr-file").value = "";
    setStatus("lab-ocr-status", "Unsupported file type. Choose a JPG, PNG or WebP image.", true);
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    $("lab-ocr-file").value = "";
    setStatus("lab-ocr-status", "Image is larger than 8 MB. Resize it and try again.", true);
    return;
  }
  selectedOcrFile = file;
  previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
  setStatus("lab-ocr-status", "Image selected. OCR will run in your browser; the image is not uploaded to Firestore.");
}

function renderOcrSuggestions(result) {
  const box = $("lab-ocr-suggestions");
  box.replaceChildren();
  const entries = Object.entries(result.suggestions || {});
  if (!entries.length) {
    box.append(make("p", "No value was confidently extracted. Enter the report manually.", "help"));
  }
  const labels = {
    plateletCount: "Platelets (×10⁹/L)",
    hematocrit: "Hematocrit / HCT (%)",
    wbcCount: "WBC (×10⁹/L)",
    hemoglobin: "Hemoglobin (g/dL)"
  };
  entries.forEach(([field, item]) => {
    const line = make("p", `${labels[field]}: suggested ${item.value} (OCR read "${item.raw}" ${item.unit || "unit not detected"}). ${item.note || ""}`);
    box.append(line);
  });
  (result.warnings || []).forEach(warning => box.append(make("p", warning, "help")));
  $("lab-ocr-apply").disabled = entries.length === 0;
}

async function runLabOcr() {
  if (!selectedOcrFile) {
    setStatus("lab-ocr-status", "Choose a clear report image first.", true);
    return;
  }
  if (!window.Tesseract) {
    setStatus("lab-ocr-status", "OCR engine could not load. Check your internet connection and reload.", true);
    return;
  }
  const button = $("lab-ocr-run");
  button.disabled = true;
  $("lab-ocr-apply").disabled = true;
  $("lab-ocr-text").textContent = "";
  setStatus("lab-ocr-status", "Reading the image locally in your browser. This can take a little time.");
  try {
    const language = $("lab-ocr-language").value;
    const result = await window.Tesseract.recognize(selectedOcrFile, language, {
      logger: message => {
        if (message.status === "recognizing text" && Number.isFinite(message.progress)) {
          setStatus("lab-ocr-status", `Reading report: ${Math.round(message.progress * 100)}%`);
        }
      }
    });
    const raw = String(result.data?.text || "");
    $("lab-ocr-text").textContent = raw.slice(0, 6000);
    ocrSuggestions = extractLabValuesFromOcr(raw);
    renderOcrSuggestions(ocrSuggestions);
    setStatus("lab-ocr-status", `${ocrSuggestions.count} suggested field(s). Review the raw OCR text and original report before applying. Nothing is saved automatically.`);
  } catch (error) {
    setStatus("lab-ocr-status", `OCR failed: ${error.message || "unknown error"}. Enter values manually.`, true);
  } finally {
    button.disabled = false;
  }
}

function applyOcrSuggestions() {
  if (!ocrSuggestions?.count) return;
  const fieldIds = {
    plateletCount: "platelet-count",
    hematocrit: "hematocrit",
    wbcCount: "wbc-count",
    hemoglobin: "hemoglobin"
  };
  Object.entries(ocrSuggestions.suggestions).forEach(([field, item]) => {
    const input = $(fieldIds[field]);
    if (input) input.value = item.value;
  });
  setStatus("lab-ocr-status", "Suggested values copied into the report form. Verify each value and unit against the original report before saving.");
}

async function loadReportDataForPdf() {
  const [historySnapshot, symptoms, reports, hydration, medications] = await Promise.all([
    getDoc(doc(db, "patient_medical_history", currentUser.uid)),
    getOwnedRecords("symptom_logs"),
    getOwnedRecords("blood_reports"),
    getOwnedRecords("hydration_logs"),
    getOwnedRecords("patient_medications")
  ]);
  return {
    history: historySnapshot.exists() ? historySnapshot.data() : medicalHistory,
    symptoms,
    reports,
    hydration,
    medications,
    patientLabel: currentUser.displayName || "Signed-in patient"
  };
}

async function createPatientPdfReport() {
  const button = $("patient-pdf-generate");
  // Open synchronously inside the click gesture; otherwise browsers may block
  // the new tab after the later Firestore read completes.
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    setStatus("patient-pdf-status", "Pop-up blocked. Allow pop-ups for this site, then try again.", true);
    return;
  }
  reportWindow.opener = null;
  button.disabled = true;
  setStatus("patient-pdf-status", "Preparing your private report…");
  try {
    const data = await loadReportDataForPdf();
    const html = buildPatientReportHtml({ ...data, generatedAt: new Date().toISOString() });
    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();
    setStatus("patient-pdf-status", "Report opened in a new tab. Select Print / Save as PDF to create the PDF file.");
  } catch (error) {
    reportWindow.close();
    setStatus("patient-pdf-status", `Could not create report: ${error.code || error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

$("medical-history-form")?.addEventListener("submit", saveMedicalHistory);
$("medication-form")?.addEventListener("submit", addMedicationReminder);
$("medication-notification-enable")?.addEventListener("click", enableMedicationNotifications);
$("medication-reminders-check")?.addEventListener("click", checkDueMedicationReminders);
$("lab-ocr-file")?.addEventListener("change", handleOcrFileChange);
$("lab-ocr-run")?.addEventListener("click", runLabOcr);
$("lab-ocr-apply")?.addEventListener("click", applyOcrSuggestions);
$("patient-pdf-generate")?.addEventListener("click", createPatientPdfReport);

onAuthStateChanged(auth, async user => {
  if (!user) {
    if (medicationReminderTimer) clearTimeout(medicationReminderTimer);
    medicationReminderTimer = null;
    currentUser = null;
    return;
  }
  if (medicationReminderTimer) clearTimeout(medicationReminderTimer);
  currentUser = user;
  try {
    await loadPatientIntelligenceData();
  } catch (error) {
    console.error("Patient intelligence features failed to load:", error);
    setStatus("patient-intelligence-status", `Some patient features could not load: ${error.code || error.message}`, true);
  }
});
