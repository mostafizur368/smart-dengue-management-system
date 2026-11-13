import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, query, where, limit,
  addDoc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnup3vd_NNkSKrhHtuZdQDJ0kuBZAci9o",
  authDomain: "smart-dengue-management-system.firebaseapp.com",
  projectId: "smart-dengue-management-system",
  storageBucket: "smart-dengue-management-system.firebasestorage.app",
  messagingSenderId: "164368465699",
  appId: "1:164368465699:web:79fe552bea0b2bfc405696",
  measurementId: "G-384ZPGT9NN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

const state = {
  symptoms: [],
  bloodReports: [],
  hydration: [],
  reminders: [],
  appointments: []
};

const $ = id => document.getElementById(id);
const todayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const localDateTimeValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};
const formatDate = value => {
  if (!value) return "Date not available";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};
const formatDateTime = value => {
  if (!value) return "Time not available";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = String(text);
  return element;
};
const addCell = (row, value) => row.appendChild(make("td", "", value === null || value === undefined || value === "" ? "—" : value));
const errorText = error => {
  if (error?.code === "permission-denied") return "Firestore permission denied. Check the merged patient-record Rules are deployed.";
  if (error?.code === "unavailable") return "Firebase is temporarily unavailable. Check your internet connection and try again.";
  return error?.message || "Something went wrong. Please try again.";
};
const setStatus = (id, text, isError = false) => {
  const target = $(id);
  if (!target) return;
  target.textContent = text;
  target.style.color = isError ? "#a32620" : "#60747b";
};
const withButtonState = async (button, operation) => {
  if (!button) return operation();
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Saving…";
  try { return await operation(); }
  finally { button.disabled = false; button.textContent = original; }
};

function setDateDefaults() {
  $("symptom-date").value = todayKey();
  $("report-date").value = todayKey();
  $("fluid-date").value = localDateTimeValue();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  $("reminder-due").value = localDateTimeValue(tomorrow);
}

async function getOwnedRecords(collectionName) {
  const result = await getDocs(query(
    collection(db, collectionName),
    where("userId", "==", currentUser.uid),
    limit(100)
  ));
  return result.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function loadAllRecords() {
  const [symptoms, bloodReports, hydration, reminders, appointments] = await Promise.all([
    getOwnedRecords("symptom_logs"),
    getOwnedRecords("blood_reports"),
    getOwnedRecords("hydration_logs"),
    getOwnedRecords("patient_reminders"),
    getOwnedRecords("appointments")
  ]);
  state.symptoms = symptoms;
  state.bloodReports = bloodReports;
  state.hydration = hydration;
  state.reminders = reminders;
  state.appointments = appointments;
  renderDashboard();
}

function renderDashboard() {
  const today = todayKey();
  const todaySymptoms = state.symptoms.filter(item => item.logDate === today).length;
  const todayHydration = state.hydration
    .filter(item => item.dateKey === today)
    .reduce((total, item) => total + Number(item.amountMl || 0), 0);
  const latestReport = [...state.bloodReports]
    .filter(item => item.plateletCount !== null && item.plateletCount !== undefined)
    .sort((a, b) => String(b.reportDate).localeCompare(String(a.reportDate)))[0];
  const pendingReminders = state.reminders.filter(item => !item.completed).length;

  $("metric-symptoms").textContent = todaySymptoms;
  $("metric-platelets").textContent = latestReport ? Number(latestReport.plateletCount).toLocaleString() : "—";
  $("metric-hydration").textContent = todayHydration.toLocaleString();
  $("metric-reminders").textContent = pendingReminders;

  renderSymptoms();
  renderBloodReports();
  renderHydration();
  renderReminders();
  renderAppointments();
  renderWarningReview();
  renderMedicalSources();
}

const symptomLabels = {
  "fever": "Fever",
  "headache": "Headache",
  "eye-pain": "Pain behind eyes",
  "body-joint-pain": "Muscle / joint pain",
  "rash": "Skin rash",
  "nausea": "Nausea",
  "repeated-vomiting": "Repeated vomiting",
  "severe-abdominal-pain": "Severe abdominal pain",
  "bleeding": "Bleeding",
  "breathing-difficulty": "Breathing difficulty",
  "unusual-drowsiness": "Unusual drowsiness",
  "cold-clammy-skin": "Cold / clammy skin",
  "reduced-urination": "Markedly reduced urination",
  "rapid-breathing": "Rapid breathing",
  "fainting": "Fainting / feeling faint",
  "blood-vomit-stool": "Blood in vomit / stool or black stool",
  "fluid-accumulation": "New fluid build-up / swelling reported",
  "marked-restlessness": "Unusual restlessness",
  "pale-cold-skin": "Pale, cold or clammy skin",
  "very-thirsty": "Unusual intense thirst",
  "liver-enlargement": "Clinician reported enlarged liver"
};
const warningSymptoms = new Set([
  "repeated-vomiting", "severe-abdominal-pain", "bleeding",
  "breathing-difficulty", "unusual-drowsiness", "cold-clammy-skin",
  "reduced-urination"
]);

function updateSymptomWarning() {
  const selected = [...document.querySelectorAll('input[name="symptom"]:checked')].map(item => item.value);
  const hasWarning = selected.some(item => warningSymptoms.has(item));
  const warning = $("symptom-warning");
  warning.textContent = hasWarning
    ? "Warning sign selected. Seek urgent medical care now; do not wait for an app response."
    : "If a warning sign is present, seek urgent medical care; do not wait for the app.";
  warning.style.color = hasWarning ? "#a32620" : "#60747b";
  warning.style.fontWeight = hasWarning ? "700" : "400";
}

function renderSymptoms() {
  const list = $("symptom-list");
  list.replaceChildren();
  const records = [...state.symptoms].sort((a, b) => String(b.logDate).localeCompare(String(a.logDate)));
  if (!records.length) {
    list.appendChild(make("div", "empty", "No symptom entries saved yet."));
    return;
  }
  records.slice(0, 30).forEach(item => {
    const card = make("article", "record");
    const top = make("div", "record-top");
    top.append(make("strong", "", formatDate(item.logDate)));
    const critical = (item.symptoms || []).some(value => warningSymptoms.has(value));
    top.appendChild(make("span", critical ? "pill danger" : "pill", critical ? "Warning sign recorded" : "Saved"));
    card.appendChild(top);
    const temperature = item.temperatureC === null || item.temperatureC === undefined
      ? "Not recorded" : `${item.temperatureC} °C`;
    card.appendChild(make("p", "small", `Temperature: ${temperature}`));
    const labels = (item.symptoms || []).map(value => symptomLabels[value] || value);
    card.appendChild(make("p", "small", `Symptoms: ${labels.length ? labels.join(", ") : "None selected"}`));
    if (item.notes) card.appendChild(make("p", "small muted", `Notes: ${item.notes}`));
    const actions = make("div", "actions");
    const remove = make("button", "danger", "Delete entry");
    remove.type = "button";
    remove.dataset.deleteCollection = "symptom_logs";
    remove.dataset.deleteId = item.id;
    actions.appendChild(remove);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function drawTrendChart(canvasId, noteId, key, label, color) {
  const canvas = $(canvasId);
  const note = $(noteId);
  const records = [...state.bloodReports]
    .filter(item => typeof item[key] === "number" && Number.isFinite(item[key]))
    .sort((a, b) => String(a.reportDate).localeCompare(String(b.reportDate)));
  const context = canvas.getContext("2d");
  const width = Math.max(300, canvas.clientWidth || 600);
  const height = 220;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  if (records.length < 2) {
    note.textContent = `Add at least two reports with ${label.toLowerCase()} values to see a trend.`;
    context.fillStyle = "#60747b";
    context.font = "13px Arial";
    context.fillText("Not enough data for a trend chart yet.", 12, 34);
    return;
  }

  note.textContent = `${records.length} recorded values. This chart shows change over time only; it does not indicate severity or provide a diagnosis.`;
  const values = records.map(item => Number(item[key]));
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min = Math.max(0, min - 1); max = max + 1; }
  const padding = { left: 48, right: 16, top: 18, bottom: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  context.font = "11px Arial";
  context.strokeStyle = "#e1ebeb";
  context.fillStyle = "#60747b";
  context.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH * i / 4);
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    const value = max - ((max - min) * i / 4);
    context.fillText(value.toFixed(1), 5, y + 4);
  }
  const points = records.map((item, index) => ({
    x: padding.left + (records.length === 1 ? chartW / 2 : chartW * index / (records.length - 1)),
    y: padding.top + chartH - ((Number(item[key]) - min) / (max - min)) * chartH,
    date: String(item.reportDate || "").slice(5)
  }));
  context.strokeStyle = color;
  context.lineWidth = 2.5;
  context.beginPath();
  points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
  context.stroke();
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));
  points.forEach((point, index) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(point.x, point.y, 4, 0, Math.PI * 2);
    context.fill();
    if (index % labelEvery === 0 || index === points.length - 1) {
      context.fillStyle = "#60747b";
      context.font = "10px Arial";
      context.textAlign = "center";
      context.fillText(point.date, point.x, height - 12);
    }
  });
  context.textAlign = "left";
}

function renderBloodReports() {
  const body = $("blood-table");
  body.replaceChildren();
  const records = [...state.bloodReports].sort((a, b) => String(b.reportDate).localeCompare(String(a.reportDate)));
  if (!records.length) {
    const row = make("tr");
    const cell = make("td", "", "No reports saved yet.");
    cell.colSpan = 7;
    row.appendChild(cell);
    body.appendChild(row);
  } else {
    records.slice(0, 50).forEach(item => {
      const row = make("tr");
      addCell(row, formatDate(item.reportDate));
      addCell(row, item.plateletCount);
      addCell(row, item.hematocrit);
      addCell(row, item.wbcCount);
      addCell(row, item.hemoglobin);
      addCell(row, item.labName);
      const cell = make("td");
      const remove = make("button", "danger", "Delete");
      remove.type = "button";
      remove.dataset.deleteCollection = "blood_reports";
      remove.dataset.deleteId = item.id;
      cell.appendChild(remove);
      row.appendChild(cell);
      body.appendChild(row);
    });
  }
  drawTrendChart("platelet-chart", "platelet-chart-note", "plateletCount", "platelet", "#087f8c");
  drawTrendChart("hct-chart", "hct-chart-note", "hematocrit", "hematocrit", "#a05a28");
  renderBloodInterpretation();
}

function renderHydration() {
  const list = $("hydration-list");
  list.replaceChildren();
  const today = todayKey();
  const todayEntries = state.hydration.filter(item => item.dateKey === today);
  const total = todayEntries.reduce((sum, item) => sum + Number(item.amountMl || 0), 0);
  list.appendChild(make("div", "record", `Today: ${total.toLocaleString()} mL recorded across ${todayEntries.length} entr${todayEntries.length === 1 ? "y" : "ies"}.`));
  const records = [...state.hydration].sort((a, b) => String(b.loggedAt).localeCompare(String(a.loggedAt)));
  if (!records.length) {
    list.appendChild(make("div", "empty", "No fluid entries saved yet."));
    return;
  }
  records.slice(0, 25).forEach(item => {
    const card = make("article", "record");
    const top = make("div", "record-top");
    top.append(make("strong", "", `${Number(item.amountMl || 0).toLocaleString()} mL · ${(item.fluidType || "fluid").replace(/-/g, " ")}`));
    top.appendChild(make("span", "small muted", formatDateTime(item.loggedAt)));
    card.appendChild(top);
    if (item.note) card.appendChild(make("p", "small muted", item.note));
    const actions = make("div", "actions");
    const remove = make("button", "danger", "Delete entry");
    remove.type = "button";
    remove.dataset.deleteCollection = "hydration_logs";
    remove.dataset.deleteId = item.id;
    actions.appendChild(remove);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function renderReminders() {
  const list = $("reminder-list");
  list.replaceChildren();
  const now = Date.now();
  const records = [...state.reminders].sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt)));
  if (!records.length) {
    list.appendChild(make("div", "empty", "No reminders saved yet."));
    return;
  }
  records.forEach(item => {
    const card = make("article", "record");
    const top = make("div", "record-top");
    top.appendChild(make("strong", "", item.title || "Reminder"));
    const due = new Date(item.dueAt).getTime();
    const statusClass = item.completed ? "pill done" : due < now ? "pill danger" : "pill warn";
    const statusText = item.completed ? "Completed" : due < now ? "Overdue" : "Upcoming";
    top.appendChild(make("span", statusClass, statusText));
    card.appendChild(top);
    card.appendChild(make("p", "small", `${(item.category || "other").replace(/-/g, " ")} · ${formatDateTime(item.dueAt)}`));
    if (item.notes) card.appendChild(make("p", "small muted", item.notes));
    const actions = make("div", "actions");
    if (!item.completed) {
      const complete = make("button", "secondary", "Mark complete");
      complete.type = "button";
      complete.dataset.reminderAction = "complete";
      complete.dataset.reminderId = item.id;
      actions.appendChild(complete);
    }
    const remove = make("button", "danger", "Delete");
    remove.type = "button";
    remove.dataset.deleteCollection = "patient_reminders";
    remove.dataset.deleteId = item.id;
    actions.appendChild(remove);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function renderAppointments() {
  const list = $("appointments-list");
  list.replaceChildren();
  const records = [...state.appointments].sort((a, b) => String(a.appointmentDate || "").localeCompare(String(b.appointmentDate || "")));
  if (!records.length) {
    list.appendChild(make("div", "empty", "No appointments found for this account."));
    return;
  }
  records.forEach(item => {
    const card = make("article", "appointment-card");
    card.appendChild(make("h3", "", "🎫 Appointment Ticket"));
    [
      ["Ticket ID", item.id],
      ["Patient", item.patientName],
      ["Phone", item.patientPhone],
      ["Doctor", item.doctorName],
      ["Date", item.appointmentDate],
      ["Time", item.appointmentTime],
      ["Status", item.status || "Pending"]
    ].forEach(([label, value]) => {
      const paragraph = make("p");
      paragraph.appendChild(make("strong", "", `${label}: `));
      paragraph.appendChild(document.createTextNode(value == null ? "Not available" : String(value)));
      card.appendChild(paragraph);
    });
    list.appendChild(card);
  });
}

function renderWarningReview() {
  const panel = $("patient-warning-review");
  if (!panel) return;
  panel.replaceChildren();
  const assistant = window.DengueClinicalAssistant;
  if (!assistant) {
    panel.className = "clinical-insight warning";
    panel.appendChild(make("h3", "", "Warning-sign review unavailable"));
    panel.appendChild(make("p", "", "The clinical safety module did not load. Follow medical advice and seek urgent care for warning signs."));
    return;
  }
  const result = assistant.assessPatientWarningSigns(state.symptoms);
  panel.className = result.hasWarningSigns ? "clinical-insight danger" : "clinical-insight";
  panel.appendChild(make("h3", "", result.hasWarningSigns ? "Warning-sign related information was recorded" : "No warning-sign item found in saved entries"));
  if (result.hasWarningSigns) {
    panel.appendChild(make("p", "", "These items may be from past entries. The app cannot tell whether they are happening now. If any is present now, seek urgent medical care immediately."));
    const list = make("ul");
    result.signals.forEach(signal => list.appendChild(make("li", "", `${signal.labelEn} · ${signal.date || "date not recorded"}`)));
    panel.appendChild(list);
  } else {
    panel.appendChild(make("p", "", "No warning-sign item was found in the saved symptom selections or notes. This does not rule out warning signs or dengue."));
  }
  panel.appendChild(make("p", "small", "This is a safety prompt, not a diagnosis, risk score or substitute for clinical assessment."));
}

function renderBloodInterpretation() {
  const panel = $("blood-interpretation-panel");
  if (!panel) return;
  panel.replaceChildren();
  const assistant = window.DengueClinicalAssistant;
  if (!assistant) {
    panel.className = "clinical-insight warning";
    panel.appendChild(make("h3", "", "Report interpretation unavailable"));
    panel.appendChild(make("p", "", "The clinical helper did not load. Ask your clinician to interpret the original report."));
    return;
  }
  const result = assistant.interpretBloodReports(state.bloodReports);
  panel.className = result.pairedTrendFlag ? "clinical-insight warning" : "clinical-insight";
  panel.appendChild(make("h3", "", result.pairedTrendFlag ? "Trend pattern needs prompt clinician review" : "Plain-language report summary"));
  const list = make("ul");
  result.lines.forEach(line => list.appendChild(make("li", "", line)));
  panel.appendChild(list);
  panel.appendChild(make("p", "small", result.disclaimer));
}

function renderMedicalSources() {
  const container = $("patient-medical-source-list");
  if (!container) return;
  container.replaceChildren();
  const assistantSources = window.DengueClinicalAssistant && window.DengueClinicalAssistant.getSources
    ? window.DengueClinicalAssistant.getSources() : [];
  const registrySources = window.getMedicalSourceRegistry ? window.getMedicalSourceRegistry() : [];
  const merged = new Map();
  [...assistantSources, ...registrySources].forEach(source => {
    if (source && source.url && /^https:\/\//i.test(source.url)) {
      merged.set(source.id || source.url, source);
    }
  });
  [...merged.values()].slice(0, 8).forEach(source => {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${source.organization || "Medical source"}: ${source.title || "Open reference"}${source.publicationDate ? ` (${source.publicationDate})` : ""}`;
    container.appendChild(link);
  });
  if (!container.children.length) container.appendChild(make("span", "small muted", "No reference links available."));
}

function currentPatientSummary() {
  if (!window.DengueClinicalAssistant || !window.DengueClinicalAssistant.buildPatientSummary) return "";
  return window.DengueClinicalAssistant.buildPatientSummary({
    symptoms: state.symptoms,
    bloodReports: state.bloodReports,
    hydration: state.hydration,
    reminders: state.reminders
  });
}

function generatePatientSummary() {
  const output = $("patient-summary-output");
  const copy = $("copy-patient-summary");
  const print = $("print-patient-summary");
  const summary = currentPatientSummary();
  if (!summary) {
    setStatus("patient-summary-status", "Summary module is unavailable. Refresh the page and try again.", true);
    return;
  }
  output.textContent = summary;
  copy.disabled = false;
  print.disabled = false;
  setStatus("patient-summary-status", "Summary generated from your currently loaded records.");
}

async function refreshDashboard() {
  $("page-message").textContent = "Refreshing your private health records…";
  try {
    await loadAllRecords();
    $("page-message").textContent = "Your dashboard is up to date.";
  } catch (error) {
    console.error("Patient dashboard refresh failed:", error);
    $("page-message").textContent = errorText(error);
  }
}

$("symptom-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.submitter || $("symptom-form").querySelector('button[type="submit"]');
  await withButtonState(button, async () => {
    try {
      const temperatureText = $("symptom-temperature").value.trim();
      const temperatureC = temperatureText ? Number(temperatureText) : null;
      const symptoms = [...document.querySelectorAll('input[name="symptom"]:checked')].map(item => item.value);
      await addDoc(collection(db, "symptom_logs"), {
        userId: currentUser.uid,
        logDate: $("symptom-date").value,
        temperatureC,
        symptoms,
        notes: $("symptom-notes").value.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      $("symptom-form").reset();
      $("symptom-date").value = todayKey();
      updateSymptomWarning();
      setStatus("symptom-status", "Symptom entry saved.");
      await refreshDashboard();
    } catch (error) {
      setStatus("symptom-status", errorText(error), true);
    }
  });
});

$("blood-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.submitter || $("blood-form").querySelector('button[type="submit"]');
  await withButtonState(button, async () => {
    try {
      const readNumber = id => $(id).value.trim() === "" ? null : Number($(id).value);
      const values = {
        plateletCount: readNumber("platelet-count"),
        hematocrit: readNumber("hematocrit"),
        wbcCount: readNumber("wbc-count"),
        hemoglobin: readNumber("hemoglobin")
      };
      if (Object.values(values).every(value => value === null)) {
        setStatus("blood-status", "Enter at least one result from the report.", true);
        return;
      }
      await addDoc(collection(db, "blood_reports"), {
        userId: currentUser.uid,
        reportDate: $("report-date").value,
        labName: $("lab-name").value.trim(),
        ...values,
        notes: $("blood-notes").value.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      $("blood-form").reset();
      $("report-date").value = todayKey();
      setStatus("blood-status", "Blood report saved. Ask your clinician to interpret the results.");
      await refreshDashboard();
    } catch (error) {
      setStatus("blood-status", errorText(error), true);
    }
  });
});

$("hydration-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.submitter || $("hydration-form").querySelector('button[type="submit"]');
  await withButtonState(button, async () => {
    try {
      const localValue = $("fluid-date").value;
      const loggedDate = new Date(localValue);
      if (Number.isNaN(loggedDate.getTime())) throw new Error("Choose a valid date and time.");
      await addDoc(collection(db, "hydration_logs"), {
        userId: currentUser.uid,
        dateKey: localValue.slice(0, 10),
        fluidType: $("fluid-type").value,
        amountMl: Number($("fluid-amount").value),
        loggedAt: loggedDate.toISOString(),
        note: $("fluid-notes").value.trim(),
        createdAt: serverTimestamp()
      });
      $("hydration-form").reset();
      $("fluid-date").value = localDateTimeValue();
      setStatus("hydration-status", "Fluid entry saved.");
      await refreshDashboard();
    } catch (error) {
      setStatus("hydration-status", errorText(error), true);
    }
  });
});

$("reminder-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.submitter || $("reminder-form").querySelector('button[type="submit"]');
  await withButtonState(button, async () => {
    try {
      const due = new Date($("reminder-due").value);
      if (Number.isNaN(due.getTime())) throw new Error("Choose a valid reminder date and time.");
      if (due.getTime() < Date.now() - 60 * 1000) throw new Error("Choose a future date and time.");
      await addDoc(collection(db, "patient_reminders"), {
        userId: currentUser.uid,
        title: $("reminder-title").value.trim(),
        category: $("reminder-category").value,
        dueAt: due.toISOString(),
        notes: $("reminder-notes").value.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      $("reminder-form").reset();
      $("reminder-due").value = localDateTimeValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setStatus("reminder-status", "Reminder saved. It will appear when you open this dashboard.");
      await refreshDashboard();
    } catch (error) {
      setStatus("reminder-status", errorText(error), true);
    }
  });
});

document.addEventListener("click", async event => {
  const deleteButton = event.target.closest("button[data-delete-collection][data-delete-id]");
  const completeButton = event.target.closest("button[data-reminder-action='complete'][data-reminder-id]");
  try {
    if (deleteButton) {
      const collectionName = deleteButton.dataset.deleteCollection;
      const allowed = new Set(["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders"]);
      if (!allowed.has(collectionName)) return;
      if (!window.confirm("Delete this record from your account? This cannot be undone.")) return;
      deleteButton.disabled = true;
      await deleteDoc(doc(db, collectionName, deleteButton.dataset.deleteId));
      await refreshDashboard();
    }
    if (completeButton) {
      completeButton.disabled = true;
      await updateDoc(doc(db, "patient_reminders", completeButton.dataset.reminderId), {
        completed: true,
        updatedAt: serverTimestamp()
      });
      await refreshDashboard();
    }
  } catch (error) {
    console.error("Patient record action failed:", error);
    $("page-message").textContent = errorText(error);
  }
});

document.querySelectorAll('input[name="symptom"]').forEach(input => input.addEventListener("change", updateSymptomWarning));

$("generate-patient-summary").addEventListener("click", generatePatientSummary);
$("copy-patient-summary").addEventListener("click", async () => {
  const summary = $("patient-summary-output").textContent || "";
  if (!summary || summary.startsWith("Generate a summary")) return;
  try {
    await navigator.clipboard.writeText(summary);
    setStatus("patient-summary-status", "Summary copied to clipboard.");
  } catch (error) {
    setStatus("patient-summary-status", "Clipboard access is unavailable. Select the summary text and copy it manually.", true);
  }
});
$("print-patient-summary").addEventListener("click", () => {
  const summary = $("patient-summary-output").textContent || "";
  if (!summary || summary.startsWith("Generate a summary")) return;
  window.print();
});
$("refresh-dashboard").addEventListener("click", refreshDashboard);
$("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    $("page-message").textContent = `Logout failed: ${errorText(error)}`;
  }
});
window.addEventListener("resize", () => {
  if (state.bloodReports.length) {
    drawTrendChart("platelet-chart", "platelet-chart-note", "plateletCount", "platelet", "#087f8c");
    drawTrendChart("hct-chart", "hct-chart-note", "hematocrit", "hematocrit", "#a05a28");
  }
});

setDateDefaults();
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  try {
    const profile = await getDoc(doc(db, "users", user.uid));
    const name = profile.exists() ? profile.data().name : "";
    $("welcome").textContent = `Welcome, ${name || user.displayName || user.email}. Your personal health records are below.`;
    await refreshDashboard();
  } catch (error) {
    console.error("Patient dashboard initialization failed:", error);
    $("page-message").textContent = errorText(error);
  }
});
