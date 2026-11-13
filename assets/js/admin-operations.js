import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, getDocs, query, limit, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const config = {
  apiKey: "AIzaSyAnup3vd_NNkSKrhHtuZdQDJ0kuBZAci9o",
  authDomain: "smart-dengue-management-system.firebaseapp.com",
  projectId: "smart-dengue-management-system",
  storageBucket: "smart-dengue-management-system.firebasestorage.app",
  messagingSenderId: "164368465699",
  appId: "1:164368465699:web:79fe552bea0b2bfc405696"
};
const app = getApps().length ? getApp() : initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
let admin = null;
let latestAdminAnalyticsRows = [];

function node(tag, text, cls = "") {
  const item = document.createElement(tag);
  item.textContent = String(text ?? "");
  if (cls) item.className = cls;
  return item;
}
function setStatus(id, text, bad = false) {
  const item = $(id);
  if (item) { item.textContent = text; item.style.color = bad ? "#b91c1c" : "#475569"; }
}
async function bounded(name, max = 2000) {
  const snap = await getDocs(query(collection(db, name), limit(max)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() }));
}
function dateValue(value) {
  if (value?.toDate) return value.toDate();
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}
function downloadCsv(filename, rows) {
  const escape = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map(row => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function loadAdminIntelligence() {
  setStatus("admin-intelligence-status", "Loading bounded analytics (maximum 2,000 records per collection)…");
  try {
    const [users, appointments, symptomChecks, queryEvents, doctorLogs] = await Promise.all([
      bounded("users", 2000),
      bounded("appointments", 2000),
      bounded("symptom_checks", 2000),
      bounded("chatbot_query_events", 2000),
      bounded("doctor_activity_logs", 1000)
    ]);
    const patients = users.filter(item => (item.role || "user").toLowerCase() === "user").length;
    const doctors = users.filter(item => (item.role || "").toLowerCase() === "doctor").length;
    const setMetric = (id, value) => { if ($(id)) $(id).textContent = String(value); };
    setMetric("admin-patient-total", patients);
    setMetric("admin-doctor-total", doctors);
    setMetric("admin-appointment-total", appointments.length);
    setMetric("admin-symptom-check-total", symptomChecks.length);
    setMetric("admin-chatbot-query-total", queryEvents.length);

    const risk = { "No Symptoms": 0, "Low Risk": 0, "Medium Risk": 0, "High Risk": 0, Other: 0 };
    symptomChecks.forEach(item => {
      const key = Object.prototype.hasOwnProperty.call(risk, item.riskLevel) ? item.riskLevel : "Other";
      risk[key] += 1;
    });
    const riskBox = $("admin-dengue-risk-stats");
    riskBox?.replaceChildren();
    Object.entries(risk).forEach(([name, count]) => {
      const card = node("div", `${name}: ${count}`, "record");
      riskBox?.append(card);
    });

    const normalized = value => String(value || "").toLowerCase().normalize("NFKC").replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d)).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    const frequency = new Map();
    queryEvents.forEach(item => {
      const question = String(item.question || "").trim();
      const key = normalized(question);
      if (!key) return;
      const previous = frequency.get(key) || { question, count: 0 };
      previous.count++;
      if (question.length > previous.question.length) previous.question = question;
      frequency.set(key, previous);
    });
    const top100 = [...frequency.values()].sort((a, b) => b.count - a.count).slice(0, 100);
    const topBody = $("admin-top100-questions");
    topBody?.replaceChildren();
    top100.forEach((item, index) => {
      const row = document.createElement("tr");
      [index + 1, item.count, item.question].forEach(value => row.append(node("td", value)));
      topBody?.append(row);
    });
    if (!top100.length) topBody?.append(node("tr", "No chatbot questions have been recorded yet."));

    const unanswered = queryEvents.filter(item => item.isUnmatched === true || !String(item.matchedQuestion || "").trim() || Number(item.matchScore) < 55)
      .sort((a, b) => (dateValue(b.createdAt)?.getTime() || 0) - (dateValue(a.createdAt)?.getTime() || 0))
      .slice(0, 100);
    const unansweredBox = $("admin-unanswered-questions");
    unansweredBox?.replaceChildren();
    unanswered.forEach(item => {
      const card = node("article", "");
      card.className = "record";
      card.append(node("strong", item.question || "Question unavailable"));
      card.append(node("p", `Match: ${Number.isFinite(Number(item.matchScore)) ? `${item.matchScore}%` : "not recorded"} · Topic: ${item.topic || "unknown"}`));
      unansweredBox?.append(card);
    });
    if (!unanswered.length) unansweredBox?.append(node("p", "No unanswered or low-match questions in the loaded sample."));

    const doctorActivity = $("admin-doctor-activity");
    doctorActivity?.replaceChildren();
    doctorLogs.sort((a, b) => (dateValue(b.createdAt)?.getTime() || 0) - (dateValue(a.createdAt)?.getTime() || 0)).slice(0, 100).forEach(item => {
      const row = document.createElement("tr");
      [dateValue(item.createdAt)?.toLocaleString() || item.createdAtClient || "—", item.doctorUid || "—", item.action || "—", item.summary || "—"].forEach(value => row.append(node("td", value)));
      doctorActivity?.append(row);
    });
    if (!doctorLogs.length) doctorActivity?.append(node("tr", "No doctor activity logs found."));

    latestAdminAnalyticsRows = [
      ["metric", "value"],
      ["patients", patients], ["doctors", doctors], ["appointments", appointments.length],
      ["symptom_checks_not_confirmed_cases", symptomChecks.length], ["chatbot_queries", queryEvents.length],
      ...Object.entries(risk).map(([key, value]) => [`symptom_check_${key}`, value]),
      ["Top question", "Count"], ...top100.map(item => [item.question, item.count])
    ];
    setStatus("admin-intelligence-status", `Analytics loaded from bounded samples: ${users.length} users, ${appointments.length} appointments, ${symptomChecks.length} symptom checks, ${queryEvents.length} chatbot queries, ${doctorLogs.length} doctor events. Counts are not guaranteed to represent all-time totals if a collection exceeds the limit.`);
  } catch (error) {
    setStatus("admin-intelligence-status", `Analytics load failed: ${error.code || error.message}. Check Admin Firestore permissions.`, true);
  }
}

async function loadHospitals() {
  const box = $("admin-hospital-list");
  if (!box) return;
  try {
    const items = await bounded("public_hospitals", 200);
    box.replaceChildren();
    items.forEach(item => {
      const row = node("div", `${item.name || "Hospital"} · ${item.status || "draft"} · ${item.address || ""}`, "record");
      box.append(row);
    });
    if (!items.length) box.append(node("p", "No hospital listings yet."));
  } catch (error) {
    box.replaceChildren(node("p", `Could not load hospitals: ${error.code || error.message}`));
  }
}
async function addHospital(event) {
  event.preventDefault();
  const name = $("hospital-admin-name").value.trim();
  const address = $("hospital-admin-address").value.trim();
  const phone = $("hospital-admin-phone").value.trim();
  const city = $("hospital-admin-city").value.trim();
  const latText = $("hospital-admin-lat").value.trim();
  const lngText = $("hospital-admin-lng").value.trim();
  const lat = latText === "" ? null : Number(latText);
  const lng = lngText === "" ? null : Number(lngText);
  if (!name || !address) { setStatus("admin-hospital-status", "Hospital name and address are required.", true); return; }
  if ((lat === null) !== (lng === null) || (lat !== null && (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180))) {
    setStatus("admin-hospital-status", "Enter both valid latitude and longitude, or leave both empty.", true); return;
  }
  try {
    await addDoc(collection(db, "public_hospitals"), {
      name: name.slice(0, 160), address: address.slice(0, 300), phone: phone.slice(0, 40),
      city: city.slice(0, 100), lat, lng, emergencyServices: $("hospital-admin-emergency").checked,
      status: "active", createdBy: admin.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    });
    $("admin-hospital-form").reset();
    setStatus("admin-hospital-status", "Hospital listing published. Confirm the address and coordinates before relying on distance estimates.");
    await loadHospitals();
  } catch (error) { setStatus("admin-hospital-status", `Could not publish: ${error.code || error.message}`, true); }
}

$("admin-intelligence-refresh")?.addEventListener("click", loadAdminIntelligence);
$("admin-analytics-export")?.addEventListener("click", () => {
  if (latestAdminAnalyticsRows.length) downloadCsv("smart-dengue-admin-analytics.csv", latestAdminAnalyticsRows);
});
$("admin-hospital-form")?.addEventListener("submit", addHospital);
onAuthStateChanged(auth, async user => {
  if (!user) return;
  try {
    const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js");
    const profile = await getDoc(doc(db, "users", user.uid));
    if (!profile.exists() || profile.data().role !== "admin") return;
    admin = user;
    await Promise.all([loadAdminIntelligence(), loadHospitals()]);
  } catch (error) {
    setStatus("admin-intelligence-status", `Admin verification failed: ${error.code || error.message}`, true);
  }
});
