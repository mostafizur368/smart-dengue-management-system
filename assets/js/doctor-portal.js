import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
let doctorUser = null;

function status(message, bad = false) {
  const node = $("doctor-availability-status");
  if (node) { node.textContent = message; node.style.color = bad ? "#a32626" : "#475569"; }
}
async function loadDoctorSchedule() {
  const profile = await getDoc(doc(db, "public_doctors", doctorUser.uid));
  if (!profile.exists()) {
    status("Your public doctor profile is not set up. Ask Admin to create it before setting availability.", true);
    return;
  }
  const schedule = profile.data().schedule || {};
  const savedDays = String(schedule.days || "Mon, Tue, Wed, Thu, Fri").split(",").map(value => value.trim());
  document.querySelectorAll('input[name="doctor-availability-day"]').forEach(input => {
    input.checked = savedDays.includes(input.value);
  });
  $("doctor-availability-start").value = schedule.startTime || "09:00";
  $("doctor-availability-end").value = schedule.endTime || "17:00";
  $("doctor-availability-limit").value = schedule.dailyTicketLimit || 30;
}
async function saveDoctorSchedule(event) {
  event.preventDefault();
  const days = [...document.querySelectorAll('input[name="doctor-availability-day"]:checked')].map(input => input.value).join(", ");
  const startTime = $("doctor-availability-start").value;
  const endTime = $("doctor-availability-end").value;
  const dailyTicketLimit = Number($("doctor-availability-limit").value);
  if (!days || !startTime || !endTime || endTime <= startTime || !Number.isInteger(dailyTicketLimit) || dailyTicketLimit < 1 || dailyTicketLimit > 30) {
    status("Enter valid days, a start time before the end time, and a ticket limit from 1 to 30.", true);
    return;
  }
  try {
    await updateDoc(doc(db, "public_doctors", doctorUser.uid), {
      schedule: { days: days.slice(0, 100), startTime, endTime, dailyTicketLimit },
      scheduleUpdatedAt: serverTimestamp()
    });
    await addDoc(collection(db, "doctor_activity_logs"), {
      doctorUid: doctorUser.uid, action: "availability_updated",
      summary: `Updated weekly availability: ${days} ${startTime}-${endTime}.`,
      createdAt: serverTimestamp(), createdAtClient: new Date().toISOString()
    });
    status("Availability saved. Patients can see the schedule; appointment capacity must still be confirmed at booking.");
  } catch (error) {
    status(`Could not save availability: ${error.code || error.message}. Ask Admin to merge the doctor schedule Rules.`, true);
  }
}
$("doctor-availability-form")?.addEventListener("submit", saveDoctorSchedule);

onAuthStateChanged(auth, async user => {
  if (!user) return;
  try {
    const profile = await getDoc(doc(db, "users", user.uid));
    if (!profile.exists() || profile.data().role !== "doctor") {
      status("Doctor account required.", true);
      return;
    }
    doctorUser = user;
    await loadDoctorSchedule();
    await addDoc(collection(db, "doctor_activity_logs"), {
      doctorUid: user.uid, action: "doctor_dashboard_opened",
      summary: "Doctor dashboard session opened.",
      createdAt: serverTimestamp(), createdAtClient: new Date().toISOString()
    }).catch(() => {});
  } catch (error) {
    status(`Could not verify doctor account: ${error.code || error.message}`, true);
  }
});
