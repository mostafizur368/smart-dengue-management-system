// ===============================
// FIREBASE SETUP
// ===============================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getAuth,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    runTransaction,
    query,
    where,
    serverTimestamp
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


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Firestore
const db = getFirestore(app);


// ===============================
// SAVE SYMPTOM CHECK
// ===============================

async function checkSymptoms() {

    let count = 0;

    // Check symptoms
    let fever = document.getElementById("fever").checked;
    let headache = document.getElementById("headache").checked;
    let joint = document.getElementById("joint").checked;
    let rash = document.getElementById("rash").checked;
    let nausea = document.getElementById("nausea").checked;


    if (fever) {
        count++;
    }

    if (headache) {
        count++;
    }

    if (joint) {
        count++;
    }

    if (rash) {
        count++;
    }

    if (nausea) {
        count++;
    }


    // ===============================
    // SELECTED SYMPTOM NAMES
    // ===============================

    let selectedSymptoms = [];

    if (fever) {
        selectedSymptoms.push("High Fever");
    }

    if (headache) {
        selectedSymptoms.push("Severe Headache");
    }

    if (joint) {
        selectedSymptoms.push("Muscle & Joint Pain");
    }

    if (rash) {
        selectedSymptoms.push("Skin Rash");
    }

    if (nausea) {
        selectedSymptoms.push("Nausea & Vomiting");
    }


    let result = document.getElementById("result");

    result.style.display = "block";
    
const recommendedDoctorsBox = document.getElementById(
    "recommended-doctors-result"
);


if (recommendedDoctorsBox) {
    // Wait until doctors.js has finished loading approved doctors from Firestore.
    if (window.doctorsReady && typeof window.doctorsReady.then === "function") {
        try {
            await window.doctorsReady;
        } catch (doctorLoadError) {
            console.error("Doctor list loading failed:", doctorLoadError);
        }
    }

    const doctorList = Array.isArray(window.doctors) ? window.doctors : [];
    console.log("Recommended doctor list:", doctorList);

    recommendedDoctorsBox.innerHTML = `
        <h2>👨‍⚕️ Recommended Doctors</h2>
        <p>Consult a doctor for proper evaluation of your symptoms.</p>

        <div class="recommended-doctors-grid">
            ${
                doctorList.length > 0
                    ? doctorList.map(function(doctor) {
                        return `
                            <div class="doctor-card">
                                <h3>👨‍⚕️ ${doctor.name}</h3>
                                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                                <p><strong>Hospital:</strong> ${doctor.hospital}</p>
                                <p><strong>Address:</strong> ${doctor.address}</p>
                                <p><strong>Contact:</strong> ${doctor.phone}</p>
                                <p><strong>Available:</strong> ${doctor.availableTime}</p>
                                
<div class="ticket-count" id="recommended-ticket-count-${doctor.id}">
    <p>🎫 Total Tickets: 30</p>
    <p>✅ Booked: হিসাব হচ্ছে...</p>
    <p>🟢 Available: হিসাব হচ্ছে...</p>
</div>


<button
    type="button"
    class="appointment-btn recommended-book-btn"
    data-doctor-id="${doctor.id}">
    📅 Book Appointment
</button>


</div>
`;
}).join("")
: "<p>No doctors available at the moment.</p>"
}
        </div>
    `;

    // Bind recommended-doctor buttons after their cards are rendered.
    recommendedDoctorsBox
        .querySelectorAll(".recommended-book-btn")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const doctorId = this.dataset.doctorId;
                if (typeof window.bookAppointment === "function") {
                    window.bookAppointment(String(doctorId));
                } else {
                    alert("Appointment function is not ready. Please reload the page.");
                }
            });
        });

    recommendedDoctorsBox.style.display = "block";
    const appointmentDateInput = document.getElementById("appointment-date");

const selectedDate = appointmentDateInput
    ? appointmentDateInput.value
    : "";

if (selectedDate && typeof window.updateDoctorTicketCounts === "function") {
    window.updateDoctorTicketCounts(selectedDate);
}
}


    


   // ===============================
// NO SYMPTOMS
// ===============================

if (count == 0) {

    result.style.background = "#d4edda";
    result.style.color = "#155724";

    result.innerHTML = currentLanguage === "bn"
        ? "🟢 কোনো উপসর্গ নির্বাচন করা হয়নি।"
        : "🟢 No symptoms selected.";

}


// ===============================
// LOW RISK
// ===============================

else if (count <= 2) {

    result.style.background = "#d4edda";
    result.style.color = "#155724";

    result.innerHTML = currentLanguage === "bn"
        ? `
            <h3>🟢 কম ঝুঁকি</h3>

            <p>আপনি ${count}টি উপসর্গ নির্বাচন করেছেন।</p>

            <h4>💊 করণীয়</h4>

            <ul>
                <li>💧 প্রচুর পানি পান করুন।</li>
                <li>😴 পর্যাপ্ত বিশ্রাম নিন।</li>
                <li>🦟 মশা থেকে সুরক্ষা নিন।</li>
            </ul>

            <h4>🧪 কখন পরীক্ষা বিবেচনা করবেন</h4>

            <ul>
                <li>🩺 উপসর্গ দীর্ঘস্থায়ী হলে চিকিৎসকের পরামর্শ নিন।</li>
                <li>🌡️ জ্বর হলে বা জ্বর চলতে থাকলে ডেঙ্গু পরীক্ষা বিবেচনা করুন।</li>
            </ul>
        `
        : `
            <h3>🟢 Low Risk</h3>

            <p>You selected ${count} symptoms.</p>

            <h4>💊 Recommended Actions</h4>

            <ul>
                <li>💧 Drink plenty of water.</li>
                <li>😴 Take enough rest.</li>
                <li>🦟 Use mosquito protection.</li>
            </ul>

            <h4>🧪 When to Consider Testing</h4>

            <ul>
                <li>🩺 Consider a doctor consultation if symptoms persist.</li>
                <li>🌡️ Consider dengue testing if fever develops or continues.</li>
            </ul>
        `;
}


// ===============================
// MEDIUM RISK
// ===============================

else if (count <= 4) {

    result.style.background = "#fff3cd";
    result.style.color = "#856404";

    result.innerHTML = currentLanguage === "bn"
        ? `
            <h3>🟡 মাঝারি ঝুঁকি</h3>

            <p>আপনি ${count}টি উপসর্গ নির্বাচন করেছেন।</p>

            <h4>💊 করণীয়</h4>

            <ul>
                <li>💧 বেশি করে পানি পান করুন।</li>
                <li>🩺 আপনার উপসর্গগুলো পর্যবেক্ষণ করুন।</li>
                <li>🏥 জ্বর চলতে থাকলে চিকিৎসকের কাছে যান।</li>
            </ul>

            <h4>🧪 প্রস্তাবিত পরীক্ষা</h4>

            <ul>
                <li>🩸 CBC Test</li>
                <li>🩺 উপসর্গ চলতে থাকলে চিকিৎসকের পরামর্শ নিন।</li>
            </ul>
        `
        : `
            <h3>🟡 Medium Risk</h3>

            <p>You selected ${count} symptoms.</p>

            <h4>💊 Recommended Actions</h4>

            <ul>
                <li>💧 Drink more water.</li>
                <li>🩺 Monitor your symptoms.</li>
                <li>🏥 Visit a doctor if fever continues.</li>
            </ul>

            <h4>🧪 Recommended Tests</h4>

            <ul>
                <li>🩸 CBC Test</li>
                <li>🩺 Consult a doctor if symptoms continue.</li>
            </ul>
        `;
}


// ===============================
// HIGH RISK
// ===============================

else {

    result.style.background = "#f8d7da";
    result.style.color = "#721c24";

    result.innerHTML = currentLanguage === "bn"
        ? `
            <h3>🔴 ডেঙ্গুর উচ্চ ঝুঁকি</h3>

            <p>আপনি ${count}টি উপসর্গ নির্বাচন করেছেন।</p>

            <h4>💊 করণীয়</h4>

            <ul>
                <li>🚑 দ্রুত চিকিৎসকের পরামর্শ নিন।</li>
                <li>💧 ORS এবং প্রচুর পানি পান করুন।</li>
                <li>🛏 সম্পূর্ণ বিশ্রাম নিন।</li>
            </ul>

            <h4>🧪 প্রস্তাবিত পরীক্ষা</h4>

            <ul>
                <li>🩸 CBC Test</li>
                <li>🔴 Platelet Count</li>
                <li>🧪 Dengue NS1 / IgM Test</li>
            </ul>
        `
        : `
            <h3>🔴 High Risk of Dengue</h3>

            <p>You selected ${count} symptoms.</p>

            <h4>💊 Recovery Advice</h4>

            <ul>
                <li>🚑 Visit a doctor immediately.</li>
                <li>💧 Drink ORS and plenty of water.</li>
                <li>🛏 Take complete rest.</li>
            </ul>

            <h4>🧪 Recommended Tests</h4>

            <ul>
                <li>🩸 CBC Test</li>
                <li>🔴 Platelet Count</li>
                <li>🧪 Dengue NS1 / IgM Test</li>
            </ul>
        `;

}

    // ===============================
    // SAVE SYMPTOM CHECK TO FIREBASE
    // ===============================

    try {

        let riskLevel;

        if (count == 0) {
            riskLevel = "No Symptoms";
        }

        else if (count <= 2) {
            riskLevel = "Low Risk";
        }

        else if (count <= 4) {
            riskLevel = "Medium Risk";
        }

        else {
            riskLevel = "High Risk";
        }


        await addDoc(collection(db, "symptom_checks"), {

            // Individual symptom status
            fever: fever,
            headache: headache,
            joint: joint,
            rash: rash,
            nausea: nausea,

            // Selected symptom names
            selectedSymptoms: selectedSymptoms,

            // Total number of symptoms
            symptomCount: count,

            // Risk level
            riskLevel: riskLevel,

            // Date and time
            timestamp: serverTimestamp()

        });


        console.log("Symptom check saved successfully!");

    }

    catch (error) {

        console.error("Symptom Firebase Error:", error);

    }

}


// ===============================
// CONTACT FORM + FIREBASE
// ===============================

async function sendMessage(event) {

    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    let formMessage = document.getElementById("form-message");


    // Empty field check
    if (name === "" || email === "" || message === "") {

        formMessage.style.display = "block";
        formMessage.style.background = "#f8d7da";
        formMessage.style.color = "#721c24";

        formMessage.innerHTML =
            "⚠️ Please fill in all fields.";

        return;
    }


    try {

        // Save message to Firebase
        await addDoc(collection(db, "contact_messages"), {

            name: name,
            email: email,
            message: message,
            timestamp: serverTimestamp()

        });


        // Success message
        formMessage.style.display = "block";
        formMessage.style.background = "#d4edda";
        formMessage.style.color = "#155724";

        formMessage.innerHTML =
            "✅ Message sent successfully!";


        // Clear form
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";


    }

    catch (error) {

        console.error("Firebase Error:", error);

        formMessage.style.display = "block";
        formMessage.style.background = "#f8d7da";
        formMessage.style.color = "#721c24";

        formMessage.innerHTML =
            "❌ Failed to send message. Please try again.";

    }

}


// ===============================
// LANGUAGE SWITCHER
// ===============================

let currentLanguage = "en";


function toggleLanguage() {

    let elements = document.querySelectorAll("[data-en][data-bn]");

    let languageBtn = document.getElementById("languageBtn");


    if (currentLanguage === "en") {

        elements.forEach(function (element) {

            element.textContent =
                element.getAttribute("data-bn");

        });

        languageBtn.textContent = "English";

        currentLanguage = "bn";

    }

    else {

        elements.forEach(function (element) {

            element.textContent =
                element.getAttribute("data-en");

        });

        languageBtn.textContent = "বাংলা";

        currentLanguage = "en";

    }

}


// ===============================
// START PAGE FROM HOME
// ===============================

window.addEventListener("load", function () {

    window.scrollTo(0, 0);

});


// ===============================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ===============================

window.checkSymptoms = checkSymptoms;
window.sendMessage = sendMessage;
window.toggleLanguage = toggleLanguage;
window.detectChatbotLanguage = detectLanguage;
// ===============================
// LOAD DENGUE DATASET
// ===============================

async function loadDengueDataset() {

    try {

        const response = await fetch("dataset/dataset.csv");

        const csvText = await response.text();

        const rows = csvText.split("\n");
       const headers = rows[0].split(",");

const data = rows.slice(1).map(row => {
    const values = row.split(",");

    let obj = {};

    headers.forEach((header, index) => {
        obj[header] = values[index];
    });

    return obj;
}); 

        console.log("Dataset loaded successfully!");
        console.log("Total rows:", rows.length);

        console.log("First row:", rows[0]);
        console.log("Second row:", rows[1]);
        console.log("First data object:", data[0]);
        const outcome0 = data.filter(row => row.Outcome === "0").length;
const outcome1 = data.filter(row => row.Outcome === "1").length;
document.getElementById("total-records").textContent = data.length;
document.getElementById("outcome-zero").textContent = outcome0;
document.getElementById("outcome-one").textContent = outcome1;
const ageGroups = [0, 0, 0, 0, 0, 0, 0];

data.forEach(row => {

    const age = Number(row.Age);

    if (age >= 0 && age <= 10) {
        ageGroups[0]++;
    }
    else if (age >= 11 && age <= 20) {
        ageGroups[1]++;
    }
    else if (age >= 21 && age <= 30) {
        ageGroups[2]++;
    }
    else if (age >= 31 && age <= 40) {
        ageGroups[3]++;
    }
    else if (age >= 41 && age <= 50) {
        ageGroups[4]++;
    }
    else if (age >= 51 && age <= 60) {
        ageGroups[5]++;
    }
    else if (age >= 61) {
        ageGroups[6]++;
    }

});

console.log("Age Groups:", ageGroups);

const ageChart = Chart.getChart("ageChart");

if (ageChart) {

    ageChart.data.datasets[0].data = ageGroups;

    ageChart.update();

}

console.log("Outcome 0:", outcome0);
console.log("Outcome 1:", outcome1);
console.log("Sample Outcome 0:", data.find(row => row.Outcome === "0"));
console.log("Sample Outcome 1:", data.find(row => row.Outcome === "1"));
    }

    catch (error) {

        console.error("Dataset Error:", error);

    }

}

loadDengueDataset();
const ctx = document.getElementById("dengueChart");

new Chart(ctx, {
    type: "bar",

    data: {
        labels: ["Dengue Negative", "Dengue Positive"],

        datasets: [{
            label: "Number of Records",

            data: [467, 533]
        }]
    },

    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
const percentageCtx = document.getElementById("denguePercentageChart");

new Chart(percentageCtx, {
    type: "doughnut",

    data: {
        labels: [
            "Dengue Negative",
            "Dengue Positive"
        ],

        datasets: [{
            data: [467, 533]
        }]
    },

    options: {
        responsive: true
    }
});
const ageCtx = document.getElementById("ageChart");

new Chart(ageCtx, {
    type: "bar",

    data: {
        labels: [
            "0-10",
            "11-20",
            "21-30",
            "31-40",
            "41-50",
            "51-60",
            "61+"
        ],

        datasets: [{
            label: "Number of Records",

            data: [0, 0, 0, 0, 0, 0, 0]
        }]
    },

    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
async function loadDengueDB() {

    try {

        const response = await fetch("dataset/Dengue_db.csv");

        const csvText = await response.text();

        const rows = csvText.split("\n");

        console.log("Dengue_db.csv loaded successfully!");

        console.log("Total rows:", rows.length);

        console.log("Header:", rows[0]);

        console.log("First data row:", rows[1]);
        const headers = rows[0].split(",");

const data = rows.slice(1).map(row => {

    const values = row.split(",");

    let obj = {};

    headers.forEach((header, index) => {
        obj[header] = values[index];
    });

    return obj;

});

const predictionCounts = {};

data.forEach(row => {

    const prediction = row.Prediction;

    predictionCounts[prediction] =
        (predictionCounts[prediction] || 0) + 1;

});

console.log(
    "Prediction Counts:",
    JSON.stringify(predictionCounts, null, 2)

);

const predictionCtx = document.getElementById("predictionChart");

new Chart(predictionCtx, {
    type: "bar",

    data: {
        labels: [
             "Dengue Negative",
           "Dengue Positive"
        ],

        datasets: [{
            label: "Number of Records",

            data: [
                predictionCounts["0"] || 0,
                predictionCounts["1"] || 0
            ]
        }]
    },

    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
    } catch (error) {

        console.error("Dengue_db Dataset Error:", error);

    }

}

loadDengueDB();

// Aggregate ticket counts only; no patient details are stored here.
function ticketCountDocId(doctorId, appointmentDate) {
    return `${String(doctorId)}_${String(appointmentDate)}`;
}

async function readTicketCount(doctorId, appointmentDate, defaultTotal = 30) {
    const ref = doc(db, "ticket_counts", ticketCountDocId(doctorId, appointmentDate));
    const snap = await getDoc(ref);
    return snap.exists()
        ? { booked: Number(snap.data().booked || 0), total: Number(snap.data().total || defaultTotal) }
        : { booked: 0, total: defaultTotal };
}

async function reserveAppointmentAndCreateTicket(appointmentData) {
    const { ticketLimit = 30, ...appointmentRecord } = appointmentData;
    const doctorId = String(appointmentRecord.doctorId);
    const appointmentDate = String(appointmentRecord.appointmentDate);
    const countRef = doc(db, "ticket_counts", ticketCountDocId(doctorId, appointmentDate));
    const appointmentRef = doc(collection(db, "appointments"));
    const configuredLimit = Number.isInteger(Number(ticketLimit)) ? Math.min(30, Math.max(1, Number(ticketLimit))) : 30;

    await runTransaction(db, async (transaction) => {
        const countSnapshot = await transaction.get(countRef);
        const booked = countSnapshot.exists() ? Number(countSnapshot.data().booked || 0) : 0;
        // Capacity is fixed for a doctor/date after the first reservation.
        const total = countSnapshot.exists() ? Number(countSnapshot.data().total || configuredLimit) : configuredLimit;
        if (booked >= total) {
            throw new Error("This doctor's tickets are full for the selected date. Choose another date.");
        }

        transaction.set(countRef, {
            doctorId,
            appointmentDate,
            booked: booked + 1,
            total,
            updatedAt: serverTimestamp()
        });

        transaction.set(appointmentRef, {
            ...appointmentRecord,
            doctorId,
            appointmentDate,
            status: "Pending",
            timestamp: serverTimestamp()
        });
    });

    return appointmentRef;
}

 // ===============================
 // APPOINTMENT BOOKING
 // ===============================

document.getElementById("appointment-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    if (!auth.currentUser) {
        const wantsRegister = confirm(
            "Appointment booking করতে আগে Login করতে হবে.\n\nনতুন account তৈরি করতে OK চাপো, আর আগে account থাকলে Cancel চাপো।"
        );

        if (wantsRegister) {
            window.location.href = "register.html?return=appointment";
        } else {
            window.location.href = "login.html?return=appointment";
        }

        return;
    }


    const patientName = document.getElementById("patient-name").value.trim();
    const patientPhone = document.getElementById("patient-phone").value.trim();
    const doctorName = document.getElementById("selected-doctor").value;
   const doctorId =
    document.getElementById("selected-doctor").dataset.doctorId;
    const appointmentDate = document.getElementById("appointment-date").value;
    
    const appointmentTime = document.getElementById("appointment-time").value;

    if (!patientName || !patientPhone || !doctorName || !appointmentDate || !appointmentTime) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        
const selectedDoctor = (window.doctors || []).find(
    doctor => String(doctor.id) === String(doctorId)
);

const bookingDoctorId = selectedDoctor
    ? selectedDoctor.id
    : doctorId;
    
    const bookingDoctorUid = selectedDoctor?.uid || null;

// Respect the doctor's published weekly availability when a schedule exists.
// This is a client-side booking check; the server-side appointment flow still
// needs a transaction/Cloud Function to guarantee race-free slot reservation.
if (selectedDoctor?.schedule?.days) {
    const date = new Date(`${appointmentDate}T12:00:00`);
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    const availableDays = String(selectedDoctor.schedule.days).split(",").map(day => day.trim());
    const startTime = String(selectedDoctor.schedule.startTime || "");
    const endTime = String(selectedDoctor.schedule.endTime || "");
    if (!availableDays.includes(weekday)) {
        alert(`This doctor is not listed as available on ${weekday}. Choose another date.`);
        return;
    }
    if (startTime && endTime && (appointmentTime < startTime || appointmentTime >= endTime)) {
        alert(`This doctor's listed hours are ${startTime}–${endTime}. Choose a time within that window.`);
        return;
    }
}
//     const bookingCheckQuery = query(
//     collection(db, "appointments"),
//     where("doctorId", "==", bookingDoctorId),
//     where("appointmentDate", "==", appointmentDate)
// );

// console.log("Checking appointment availability...");
// const bookingCheckSnapshot = await getDocs(bookingCheckQuery);

// console.log("Booking count:", bookingCheckSnapshot.size);

//if (bookingCheckSnapshot.size >= 30) {
 // alert("Sorry! This doctor's tickets are full for this date. Please select another date.");
  //return;
//}

console.log("Saving appointment now...");

const appointmentRef = await reserveAppointmentAndCreateTicket({
    userId: auth.currentUser.uid,
    patientName,
    patientPhone,
    doctorName,
    doctorUid: bookingDoctorUid,
    appointmentTime,
    doctorId: bookingDoctorId,
    appointmentDate,
    ticketLimit: Number(selectedDoctor?.schedule?.dailyTicketLimit) || 30
});

        const ticket = document.getElementById("appointment-ticket");
        const escapeTicketText = value => String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[character]));

        ticket.style.display = "block";
        ticket.innerHTML = `
            <h2>🎫 Appointment Ticket</h2>
            <p><strong>Ticket ID:</strong> ${appointmentRef.id}</p>
            <p><strong>Patient:</strong> ${escapeTicketText(patientName)}</p>
            <p><strong>Phone:</strong> ${escapeTicketText(patientPhone)}</p>
            <p><strong>Doctor:</strong> ${escapeTicketText(doctorName)}</p>
            <p><strong>Date:</strong> ${escapeTicketText(appointmentDate)}</p>
            <p><strong>Time:</strong> ${escapeTicketText(appointmentTime)}</p>
            <p><strong>Status:</strong> Pending — the hospital/doctor must confirm this request.</p>
            <div style="margin-top:14px;padding:12px;border:1px dashed #087f8c;border-radius:10px;text-align:center">
              <h3>QR Code Appointment Ticket</h3>
              <div id="appointment-qr" style="display:flex;justify-content:center;margin:10px"></div>
              <small>Reference ticket only. It is not a confirmed appointment until the doctor accepts it.</small>
            </div>
            <button type="button" id="print-appointment-ticket" style="margin-top:10px;padding:10px 16px;cursor:pointer">Print Ticket</button>
        `;
        const qrTarget = document.getElementById("appointment-qr");
        if (qrTarget && window.QRCode) {
            qrTarget.innerHTML = "";
            new window.QRCode(qrTarget, { text: JSON.stringify({ticketId: appointmentRef.id, doctor: doctorName, date: appointmentDate, time: appointmentTime}), width: 150, height: 150 });
        } else if (qrTarget) {
            qrTarget.textContent = "QR library could not load. Ticket ID: " + appointmentRef.id;
        }
        document.getElementById("print-appointment-ticket")?.addEventListener("click", () => window.print());

        document.getElementById("appointment-section").scrollIntoView({
            behavior: "smooth"
        });
} catch (error) {
    console.error("Appointment Error Code:", error.code);
    console.error("Appointment Error Message:", error.message);

    alert(
        "Booking failed!\nCode: " +
        (error.code || "unknown") +
        "\nReason: " +
        error.message
    );
}
    
});

async function updateDoctorTicketCounts(selectedDate) {
    for (const doctor of window.doctors || []) {
        const configuredLimit = Number(doctor.schedule?.dailyTicketLimit) || 30;
        const boxes = [
            document.getElementById(`ticket-count-${doctor.id}`),
            document.getElementById(`recommended-ticket-count-${doctor.id}`)
        ].filter(Boolean);
        if (!boxes.length) continue;
        try {
            const counts = await readTicketCount(doctor.id, selectedDate, configuredLimit);
            const totalTickets = counts.total;
            const booked = counts.booked;
            const available = Math.max(0, totalTickets - booked);
            boxes.forEach(box => {
                box.innerHTML = `<p>🎫 Total Tickets: ${totalTickets}</p>
                    <p>✅ Booked: ${booked}</p><p>🟢 Available: ${available}</p>`;
            });
        } catch (error) {
            console.error("Ticket count error:", error);
            boxes.forEach(box => box.innerHTML = "<p>টিকিটের হিসাব পাওয়া যায়নি।</p>");
        }
    }
}

window.updateDoctorTicketCounts = updateDoctorTicketCounts;

async function updateSelectedDateAvailability() {
    const dateInput = document.getElementById("appointment-date");
    const box = document.getElementById("date-availability");
    const doctorInput = document.getElementById("selected-doctor");
    if (!dateInput || !box || !doctorInput) return;

    const selectedDate = dateInput.value;
    const doctorId = doctorInput.dataset.doctorId;
    if (!selectedDate || !doctorId) {
        box.style.display = "none";
        return;
    }
    box.style.display = "block";
    try {
        const selectedDoctor = (window.doctors || []).find(doctor => String(doctor.id) === String(doctorId));
        const configuredLimit = Number(selectedDoctor?.schedule?.dailyTicketLimit) || 30;
        const counts = await readTicketCount(doctorId, selectedDate, configuredLimit);
        document.getElementById("date-total").textContent = counts.total;
        document.getElementById("date-booked").textContent = counts.booked;
        document.getElementById("date-available").textContent = Math.max(0, counts.total - counts.booked);
    } catch (error) {
        console.error("Date availability error:", error);
        document.getElementById("date-booked").textContent = "—";
        document.getElementById("date-available").textContent = "হিসাব পাওয়া যায়নি";
    }
}

window.updateSelectedDateAvailability = updateSelectedDateAvailability;


const appointmentDateInput = document.getElementById("appointment-date");

if (appointmentDateInput) {
    appointmentDateInput.addEventListener("change", function () {
        if (this.value) {
            updateDoctorTicketCounts(this.value);
updateSelectedDateAvailability();

        }
    });
}

const authContainer = document.querySelectorAll(
    'a[href="login.html"], a[href="register.html"]'
);

onAuthStateChanged(auth, (user) => {
    const dashboardLink = document.getElementById("dashboard-link");

if (dashboardLink) {
    dashboardLink.style.display = user ? "" : "none";
}
    const nav = document.querySelector("nav ul");
    if (!nav) return;

    const oldLogout = document.getElementById("logout-link");

    if (oldLogout) {
        oldLogout.parentElement.remove();
    }
const oldWelcome = document.getElementById("welcome-user");


if (oldWelcome) {
    oldWelcome.remove();
}

if (user) {

    if (window.location.hash === "#doctor-list") {
        const doctorList = document.getElementById("doctor-list");
        const selectedDoctorId = sessionStorage.getItem("selectedDoctorId");

        if (doctorList) {
            doctorList.style.display = "block";
        }

        if (
            selectedDoctorId &&
            typeof window.bookAppointment === "function"
        ) {
            setTimeout(() => {
                window.bookAppointment(selectedDoctorId);
            }, 500);
        } else if (doctorList) {
            setTimeout(() => {
                doctorList.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 300);
        }
    }

    
const welcomeLi = document.createElement("li");
welcomeLi.id = "welcome-user";

const welcomeText = document.createElement("span");
welcomeText.textContent = "Welcome, " + (user.displayName || user.email);
welcomeText.style.color = "white";
welcomeText.style.fontWeight = "bold";
welcomeText.style.padding = "8px";

welcomeLi.appendChild(welcomeText);
nav.appendChild(welcomeLi);

authContainer.forEach((link) => {
    link.parentElement.style.display = "none";
});

const li = document.createElement("li");
const logoutLink = document.createElement("a");

logoutLink.id = "logout-link";
logoutLink.href = "#";
logoutLink.textContent = "Logout";

logoutLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        alert("Logout failed: " + error.message);
    }
});

li.appendChild(logoutLink);
nav.appendChild(li);

} else {
    authContainer.forEach((link) => {
        link.parentElement.style.display = "";
    });
}
});



// ===== Task 12: community question suggestions and approved bank sync =====
async function loadApprovedCommunityQuestions() {
    if (typeof window.mergeApprovedCommunityQuestions !== "function") return;
    try {
        const snapshot = await getDocs(
            query(collection(db, "community_question_bank"), where("status", "==", "approved"))
        );
        const records = snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));
        const added = window.mergeApprovedCommunityQuestions(records);
        if (added && typeof window.searchDengueCandidates === "function") {
            // Search index rebuilds automatically when its record count changes.
            console.info(`Loaded ${added} approved community question(s).`);
        }
    } catch (error) {
        // The built-in local bank remains available if Firebase is offline or rules are not deployed.
        console.warn("Approved community questions could not be loaded:", error);
    }
}

async function loadAdminQuestionBankChanges() {
    if (typeof window.applyAdminQuestionBankChanges !== "function") return;
    try {
        const snapshot = await getDocs(
            query(collection(db, "chatbot_admin_question_bank"), where("status", "in", ["active", "deleted"]))
        );
        const records = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
        const count = window.applyAdminQuestionBankChanges(records);
        console.info(`Applied Admin knowledge-base changes. Active index entries: ${count}.`);
    } catch (error) {
        // Static and already-approved community questions remain available.
        console.warn("Admin knowledge-base changes could not be loaded:", error);
    }
}

async function loadApprovedAnswerCorrections() {
    if (typeof window.loadApprovedAnswerOverrides !== "function") return;
    try {
        const snapshot = await getDocs(
            query(collection(db, "chatbot_answer_overrides"), where("status", "==", "approved"))
        );
        const records = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
        const count = window.loadApprovedAnswerOverrides(records);
        console.info(`Loaded ${count} approved answer correction(s).`);
    } catch (error) {
        console.warn("Approved answer corrections could not be loaded:", error);
    }
}

// Tasks 32 + 37: load active official sources and clinician-approved answer reviews.
async function loadMedicalSourcesAndClinicalReviews() {
    try {
        const [sourceSnapshot, reviewSnapshot] = await Promise.all([
            getDocs(query(collection(db, "medical_sources"), where("status", "==", "active"))),
            getDocs(query(collection(db, "chatbot_clinical_reviews"), where("status", "==", "approved")))
        ]);
        const sources = sourceSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
        if (typeof window.loadMedicalSourceRegistry === "function") window.loadMedicalSourceRegistry(sources);
        window.approvedMedicalReviews = reviewSnapshot.docs.map(item => ({ id: item.id, ...item.data() }))
            .sort((a, b) => new Date(b.reviewedAtClient || 0).getTime() - new Date(a.reviewedAtClient || 0).getTime());
        console.info(`Loaded ${sources.length} active medical source(s) and ${window.approvedMedicalReviews.length} approved clinical review(s).`);
    } catch (error) {
        // Built-in reference links remain available; no answer is marked clinician-reviewed without a matching approval record.
        console.warn("Medical source/review metadata could not be loaded:", error);
        window.approvedMedicalReviews = Array.isArray(window.approvedMedicalReviews) ? window.approvedMedicalReviews : [];
    }
}

function setupQuestionSuggestionForm() {
    const openButton = document.getElementById("open-question-suggestion");
    const form = document.getElementById("question-suggestion-form");
    const input = document.getElementById("question-suggestion-input");
    const status = document.getElementById("question-suggestion-status");
    const cancel = document.getElementById("cancel-question-suggestion");
    const submit = document.getElementById("submit-question-suggestion");
    if (!openButton || !form || !input || !status || !submit) return;

    openButton.addEventListener("click", () => {
        form.hidden = !form.hidden;
        if (!form.hidden) input.focus();
    });
    if (cancel) cancel.addEventListener("click", () => {
        form.reset();
        form.hidden = true;
        status.textContent = "";
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const question = input.value.trim();
        const language = /[\u0980-\u09FF]/.test(question) ? "bn" : "en";
        const normalizedQuestion = question.toLocaleLowerCase().normalize("NFKC")
            .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
            .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
            .replace(/\s+/g, " ").trim();

        if (question.length < 8 || question.length > 300) {
            status.textContent = "প্রশ্ন ৮–৩০০ অক্ষরের মধ্যে লিখুন। / Enter 8–300 characters.";
            return;
        }
        if (!/ডেঙ্গু|dengue|জ্বর|fever|মশা|mosquito|platelet|প্লেটলেট/i.test(question)) {
            status.textContent = "শুধু ডেঙ্গু-সম্পর্কিত প্রশ্ন প্রস্তাব করুন। / Please suggest dengue-related questions only.";
            return;
        }

        const existing = Array.isArray(window.dengueQuestionIndex)
            ? window.dengueQuestionIndex.some(item =>
                item.question.toLocaleLowerCase().normalize("NFKC")
                    .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
                    .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
                    .replace(/\s+/g, " ").trim() === normalizedQuestion
            )
            : false;

        if (existing) {
            status.textContent = "এই প্রশ্নটি ইতিমধ্যে Question Bank-এ আছে। / This question is already in the question bank.";
            return;
        }

        submit.disabled = true;
        status.textContent = "প্রস্তাব পাঠানো হচ্ছে... / Submitting...";
        try {
            await addDoc(collection(db, "question_suggestions"), {
                question,
                normalizedQuestion,
                language,
                status: "pending",
                submittedBy: auth.currentUser ? auth.currentUser.uid : null,
                createdAt: serverTimestamp()
            });
            status.textContent = "ধন্যবাদ! Admin যাচাই করার পর অনুমোদিত প্রশ্ন যুক্ত হবে। / Thank you! The question will be added only after admin approval.";
            form.reset();
        } catch (error) {
            console.error("Question suggestion submission failed:", error);
            status.textContent = "প্রস্তাব পাঠানো যায়নি। পরে আবার চেষ্টা করুন। / Could not submit. Please try again later.";
        } finally {
            submit.disabled = false;
        }
    });
}

loadApprovedCommunityQuestions().then(loadAdminQuestionBankChanges);
loadApprovedAnswerCorrections();
loadMedicalSourcesAndClinicalReviews();
setupQuestionSuggestionForm();


// ===== Free Dengue Chatbot =====

// Chatbot Elements
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");

function scrollChatToLatest() {
    if (!chatbotMessages) return;
    const scroll = () => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };
    if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => requestAnimationFrame(scroll));
    } else {
        scroll();
    }
}

function syncChatbotStarterVisibility() {
    const starter = document.getElementById("chatbot-starter-questions");
    if (!starter || !chatbotMessages) return;
    const hasUserMessage = Boolean(chatbotMessages.querySelector(".user-message"));
    starter.hidden = hasUserMessage;
    starter.setAttribute("aria-hidden", String(hasUserMessage));
    if (hasUserMessage) {
        // Inline display also protects against older cached CSS overriding [hidden].
        starter.style.setProperty("display", "none", "important");
    } else {
        starter.style.removeProperty("display");
    }
}


// Open Chatbot
if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", function () {
        chatbotWindow.style.display = "flex";
        chatbotToggle.style.display = "none";
        chatbotInput.focus();
    });
}


// Close Chatbot
if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener("click", function () {
        chatbotWindow.style.display = "none";
        chatbotToggle.style.display = "block";
    });
}


// Add Message
function addChatMessage(message, className, shouldSave = true) {
    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.dataset.chatHistoryItem = "true";
    messageElement.dataset.chatText = String(message || "");
    messageElement.style.whiteSpace = "pre-line";
    messageElement.textContent = className === "bot-message"
        ? String(message || "").replace(/([০-৯0-9]+)[.।]\s*/g, "\n$1. ").trim()
        : String(message || "");
    if (className === "bot-message") addChatbotSpeechButton(messageElement, message);
    chatbotMessages.appendChild(messageElement);
    scrollChatToLatest();
    if (shouldSave) saveLocalChatHistory();
    return messageElement;
}

// Task 38: chat history is opt-in and remains only in this browser.
const CHAT_HISTORY_KEY = "smartDengueLocalChatHistoryV1";
const CHAT_HISTORY_CONSENT_KEY = "smartDengueLocalChatHistoryConsentV1";
function saveLocalChatHistory() {
    const toggle = document.getElementById("chatbot-save-history");
    if (!toggle || !toggle.checked || !chatbotMessages) return;
    try {
        const records = [...chatbotMessages.querySelectorAll('[data-chat-history-item="true"]')]
            .map(item => ({ role: item.classList.contains("user-message") ? "user" : "bot", text: String(item.dataset.chatText || "").slice(0, 3000) }))
            .slice(-50);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(records));
    } catch (error) {
        console.warn("Local chat history could not be saved:", error);
    }
}
function setupLocalChatHistory() {
    const toggle = document.getElementById("chatbot-save-history");
    const clear = document.getElementById("chatbot-clear-history");
    const status = document.getElementById("chatbot-history-status");
    if (!toggle || !clear || !chatbotMessages) return;
    try {
        toggle.checked = localStorage.getItem(CHAT_HISTORY_CONSENT_KEY) === "true";
        if (toggle.checked) {
            const records = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "[]");
            if (Array.isArray(records)) records.slice(-50).forEach(record => {
                if (record && ["user", "bot"].includes(record.role) && typeof record.text === "string") {
                    addChatMessage(record.text, record.role === "user" ? "user-message" : "bot-message", false);
                }
            });
            if (status) status.textContent = "Saved locally on this device.";
        }
    } catch (error) {
        console.warn("Local chat history could not be restored:", error);
        try { localStorage.removeItem(CHAT_HISTORY_KEY); } catch (_) { /* storage may be disabled */ }
    }
    toggle.addEventListener("change", () => {
        try {
            localStorage.setItem(CHAT_HISTORY_CONSENT_KEY, String(toggle.checked));
            if (toggle.checked) {
                saveLocalChatHistory();
                if (status) status.textContent = "Chat history saving is on for this browser only.";
            } else {
                localStorage.removeItem(CHAT_HISTORY_KEY);
                if (status) status.textContent = "Local chat history saving is off; saved history was cleared.";
            }
        } catch (error) {
            toggle.checked = false;
            if (status) status.textContent = "This browser does not allow local storage; chat history was not saved.";
        }
    });
    clear.addEventListener("click", () => {
        try {
            localStorage.removeItem(CHAT_HISTORY_KEY);
            chatbotMessages.querySelectorAll('[data-chat-history-item="true"]').forEach(item => item.remove());
            syncChatbotStarterVisibility();
            if (typeof window.clearDengueConversationContext === "function") window.clearDengueConversationContext();
            if (status) status.textContent = "Saved chat history and in-session topic context cleared from this browser.";
        } catch (error) {
            if (status) status.textContent = "This browser did not allow the saved history to be cleared.";
        }
    });
}
setupLocalChatHistory();
syncChatbotStarterVisibility();

const clearContextButton = document.getElementById("chatbot-clear-context");
if (clearContextButton) {
    clearContextButton.addEventListener("click", () => {
        if (typeof window.clearDengueConversationContext === "function") window.clearDengueConversationContext();
        const status = document.getElementById("chatbot-history-status");
        if (status) status.textContent = "Conversation topic context reset. Your visible chat messages were not deleted.";
    });
}

// Task 33: structured emergency-signal detection with negation handling.
function addEmergencyAlert(messageElement, userQuestion) {
    if (!messageElement || !userQuestion) return { isEmergency: false, signals: [] };
    const basicResult = typeof window.detectDengueEmergencySignals === "function"
        ? window.detectDengueEmergencySignals(userQuestion) : { isEmergency: false, signals: [] };
    const advancedResult = window.DengueClinicalAssistant && window.DengueClinicalAssistant.detectWarningSigns
        ? window.DengueClinicalAssistant.detectWarningSigns(userQuestion)
        : { hasWarningSigns: false, signals: [] };
    const mergedSignals = [...(basicResult.signals || []), ...(advancedResult.signals || [])]
        .filter((item, index, list) => list.findIndex(candidate => candidate.id === item.id) === index);
    const result = {
        isEmergency: Boolean(basicResult.isEmergency || advancedResult.hasWarningSigns),
        signals: mergedSignals,
        level: mergedSignals.length ? "urgent" : "none"
    };
    if (!result.isEmergency) return result;
    const language = detectLanguage(userQuestion);
    const alert = document.createElement("div");
    alert.className = "dengue-emergency-alert";
    alert.setAttribute("role", "alert");
    alert.setAttribute("aria-live", "assertive");
    const heading = document.createElement("strong");
    heading.textContent = language === "bn" ? "জরুরি সতর্কতা — এখনই চিকিৎসা নিন" : "Emergency warning — seek care now";
    const message = document.createElement("p");
    message.textContent = language === "bn"
        ? "আপনার বার্তায় ডেঙ্গুর একটি বিপদসংকেতের উল্লেখ আছে। এটি রোগ নির্ণয় নয়। লক্ষণটি যদি এখন রোগীর থাকে, Chatbot-এর উত্তরের জন্য অপেক্ষা করবেন না—এখনই নিকটস্থ হাসপাতালের জরুরি বিভাগে যান বা জরুরি সহায়তা নিন।"
        : "Your message mentions a dengue warning sign. This is not a diagnosis. If the symptom is happening now, do not wait for the chatbot—go to the nearest hospital emergency department or seek emergency help now.";
    alert.append(heading, message);
    messageElement.insertBefore(alert, messageElement.firstChild);
    return result;
}

// Task 34: medicine safety prompts; no prescribing or personalized dosing.
function addMedicineSafetyAlert(messageElement, userQuestion, answer) {
    if (!messageElement || typeof window.detectDengueMedicineRisks !== "function") return;
    const result = window.detectDengueMedicineRisks(userQuestion, answer);
    if (!result.hasWarnings) return;
    const language = detectLanguage(userQuestion);
    const ids = new Set(result.warnings.map(item => item.id));
    const alert = document.createElement("div");
    alert.className = "dengue-medicine-alert";
    alert.setAttribute("role", "note");
    const heading = document.createElement("strong");
    heading.textContent = language === "bn" ? "ওষুধ ব্যবহারে সতর্কতা" : "Medicine safety reminder";
    const text = document.createElement("p");
    if (ids.has("nsaid_bleeding_risk")) text.textContent = language === "bn"
        ? "ডেঙ্গু সন্দেহ বা নিশ্চিত হলে Aspirin, Ibuprofen, Naproxen, Diclofenac ও অনুরূপ NSAID নিজে থেকে খাবেন না—রক্তপাতের ঝুঁকি বাড়তে পারে। আগে থেকে চিকিৎসকের দেওয়া Aspirin বা রক্ত পাতলা করার ওষুধ নিজে বন্ধ করবেন না; দ্রুত prescriber-এর সঙ্গে যোগাযোগ করুন।"
        : "With suspected or confirmed dengue, do not self-medicate with aspirin, ibuprofen, naproxen, diclofenac or similar NSAIDs because bleeding risk may increase. Do not independently stop prescribed aspirin or blood thinners; contact the prescriber promptly.";
    else if (ids.has("prescribed_anticoagulant_caution")) text.textContent = language === "bn"
        ? "Warfarin, Apixaban, Rivaroxaban, Clopidogrel বা অন্য prescribed blood thinner নিজে থেকে বন্ধ বা পরিবর্তন করবেন না। ডেঙ্গু সন্দেহ হলে দ্রুত prescriber বা হাসপাতালে যোগাযোগ করুন, বিশেষত রক্তপাত থাকলে জরুরি বিভাগে যান।"
        : "Do not independently stop or change warfarin, apixaban, rivaroxaban, clopidogrel or another prescribed blood thinner. If dengue is suspected, contact the prescriber or hospital promptly; bleeding requires emergency assessment.";
    else if (ids.has("child_dose_requires_clinician")) text.textContent = language === "bn"
        ? "শিশুর ওষুধের ডোজ বয়স, ওজন ও ওষুধের concentration-এর ওপর নির্ভর করে। এই Chatbot ব্যক্তিগত ডোজ দিতে পারে না—চিকিৎসক বা ফার্মাসিস্টের মাধ্যমে নিশ্চিত করুন।"
        : "A child's dose depends on age, weight and product concentration. This chatbot cannot provide a personalized dose; confirm it with a clinician or pharmacist.";
    else if (ids.has("paracetamol_dose_caution")) text.textContent = language === "bn"
        ? "Paracetamol কেবল চিকিৎসকের পরামর্শ ও পণ্যের নির্দেশনা অনুযায়ী নিন। একই উপাদান থাকা একাধিক ওষুধ একসঙ্গে খাবেন না; অতিরিক্ত গ্রহণে লিভারের ক্ষতি হতে পারে।"
        : "Use paracetamol only as advised by a clinician and according to the product label. Avoid multiple products containing the same ingredient; overdose can injure the liver.";
    else if (ids.has("antibiotic_not_routine")) text.textContent = language === "bn"
        ? "Antibiotic ডেঙ্গু ভাইরাসের চিকিৎসা নয় এবং সাধারণত ডেঙ্গুতে নিয়মিত প্রয়োজন হয় না। অন্য সংক্রমণ সন্দেহ হলে চিকিৎসক সিদ্ধান্ত নেবেন।"
        : "Antibiotics do not treat dengue virus and are not routinely needed for dengue. A clinician should decide if a separate infection is suspected.";
    else if (ids.has("steroid_not_routine")) text.textContent = language === "bn"
        ? "ডেঙ্গুতে Steroid নিজে থেকে শুরু বা বন্ধ করবেন না। দীর্ঘদিনের prescribed steroid থাকলে prescriber-এর পরামর্শ নিন।"
        : "Do not start or stop steroids yourself for dengue. If you take long-term prescribed steroids, contact your prescriber.";
    else text.textContent = language === "bn"
        ? "ওষুধের সিদ্ধান্ত রোগীর অবস্থা ও অন্য রোগের ওপর নির্ভর করে। ব্যক্তিগত পরামর্শের জন্য চিকিৎসকের সঙ্গে কথা বলুন।"
        : "Medication decisions depend on the patient's condition and other illnesses. Ask a clinician for individualized advice.";
    alert.append(heading, text);
    messageElement.appendChild(alert);
}

// Tasks 32 + 36: reference links and transparent clinical-review freshness.
function addMedicalReviewAndReferences(messageElement, userQuestion) {
    if (!messageElement) return;
    const matches = typeof window.getTopDengueMatches === "function" ? window.getTopDengueMatches(userQuestion, 1) : [];
    const best = matches[0] || null;
    if (!best) return;
    const language = detectLanguage(userQuestion);
    const correction = typeof window.getApprovedAnswerOverride === "function" ? window.getApprovedAnswerOverride(best.question) : null;
    const effectiveMatch = correction ? { ...best, answerBn: correction.answerBn, answerEn: correction.answerEn } : best;
    const review = typeof window.getMedicalAnswerReviewStatus === "function"
        ? window.getMedicalAnswerReviewStatus(effectiveMatch) : { status: "unreviewed" };
    const status = document.createElement("div");
    status.className = "medical-review-status";
    if (review.status === "verified") {
        const reviewer = review.review && review.review.reviewerName ? ` · ${review.review.reviewerName}` : "";
        const reviewedDate = review.review && review.review.reviewedAtClient ? new Date(review.review.reviewedAtClient).toLocaleDateString() : "";
        const dateText = reviewedDate ? ` · ${reviewedDate}` : "";
        status.textContent = language === "bn" ? `চিকিৎসক দ্বারা পর্যালোচিত${reviewer}${dateText}। এটি ব্যক্তিগত চিকিৎসা পরামর্শ নয়।` : `Clinician-reviewed${reviewer}${dateText}. This is not individualized medical advice.`;
    } else if (review.status === "outdated") {
        status.textContent = language === "bn" ? "সতর্কতা: এই উত্তরের চিকিৎসক-পর্যালোচনা পুরোনো বা উত্তর পরিবর্তিত হয়েছে। সর্বশেষ নির্দেশনার জন্য চিকিৎসকের সঙ্গে নিশ্চিত করুন।" : "Caution: this answer's clinical review is overdue or the answer has changed. Confirm current guidance with a clinician.";
        status.classList.add("is-outdated");
    } else {
        status.textContent = language === "bn" ? "চিকিৎসক-পর্যালোচনার অনুমোদন রেকর্ডে পাওয়া যায়নি। তথ্যটি শিক্ষামূলক; চিকিৎসার সিদ্ধান্ত চিকিৎসকের সঙ্গে নিন।" : "No clinician approval is recorded for this answer. This is educational information; make care decisions with a clinician.";
    }
    messageElement.appendChild(status);
    const refs = typeof window.getMedicalReferencesForAnswer === "function" ? window.getMedicalReferencesForAnswer(effectiveMatch) : [];
    if (!refs.length) return;
    const wrapper = document.createElement("div"); wrapper.className = "medical-reference-list";
    const title = document.createElement("strong"); title.textContent = language === "bn" ? "তথ্যসূত্র" : "Reference links"; wrapper.appendChild(title);
    refs.forEach(source => {
        const link = document.createElement("a"); link.href = source.url; link.target = "_blank"; link.rel = "noopener noreferrer";
        const freshness = source.stale ? (language === "bn" ? " · পর্যালোচনার সময় পেরিয়েছে" : " · source review overdue") : "";
        const published = source.publicationDate ? ` · Published ${source.publicationDate}` : "";
        link.textContent = `${source.organization || "Source"}: ${source.title}${published}${freshness}`; wrapper.appendChild(link);
    });
    const note = document.createElement("small");
    note.textContent = language === "bn" ? "লিংকগুলো আরও পড়ার জন্য। এগুলো দেখানো মানেই এই নির্দিষ্ট উত্তর চিকিৎসক যাচাই করেছেন—এমন নয়।" : "Links are for further reading; their display does not mean this specific answer has been clinically verified.";
    wrapper.appendChild(note); messageElement.appendChild(wrapper);
}

// Task 35: recommend only Admin-verified doctor profiles.
async function addDoctorRecommendation(messageElement, userQuestion, emergencyResult) {
    if (!messageElement) return;
    const asksForDoctor = /doctor|physician|specialist|hospital|appointment|consult|ডাক্তার|চিকিৎসক|হাসপাতাল|অ্যাপয়েন্টমেন্ট|অ্যাপয়েন্টমেন্ট/i.test(String(userQuestion || ""));
    if (!asksForDoctor && !(emergencyResult && emergencyResult.isEmergency)) return;
    const language = detectLanguage(userQuestion);
    const panel = document.createElement("div"); panel.className = "chatbot-doctor-recommendation";
    const heading = document.createElement("strong");
    heading.textContent = emergencyResult && emergencyResult.isEmergency ? (language === "bn" ? "জরুরি চিকিৎসা" : "Emergency care") : (language === "bn" ? "যাচাইকৃত চিকিৎসক" : "Verified clinicians");
    panel.appendChild(heading);
    if (emergencyResult && emergencyResult.isEmergency) {
        const urgent = document.createElement("p"); urgent.textContent = language === "bn" ? "Appointment বুক করার জন্য অপেক্ষা করবেন না। নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।" : "Do not wait for an appointment. Go to the nearest hospital emergency department.";
        panel.appendChild(urgent); messageElement.appendChild(panel); return;
    }
    try { if (window.doctorsReady && typeof window.doctorsReady.then === "function") await window.doctorsReady; } catch (error) { console.warn("Doctor list load failed:", error); }
    const doctors = Array.isArray(window.chatbotVerifiedDoctors) ? window.chatbotVerifiedDoctors : [];
    if (!doctors.length) {
        const note = document.createElement("p"); note.textContent = language === "bn" ? "এখনো কোনো চিকিৎসককে Chatbot সুপারিশের জন্য Admin কর্তৃক যাচাইকৃত হিসেবে চিহ্নিত করা হয়নি। নিকটস্থ হাসপাতাল বা সরকারি স্বাস্থ্যসেবা কেন্দ্রের সঙ্গে যোগাযোগ করুন।" : "No doctor profile has yet been Admin-verified for chatbot recommendations. Contact a nearby hospital or public health service.";
        panel.appendChild(note); messageElement.appendChild(panel); return;
    }
    doctors.slice(0, 3).forEach(doctor => {
        const card = document.createElement("div"); card.className = "chatbot-doctor-card";
        const name = document.createElement("strong"); name.textContent = doctor.name || "Verified clinician";
        const details = document.createElement("p"); details.textContent = [doctor.specialization, doctor.hospital, doctor.address].filter(Boolean).join(" · ");
        card.append(name, details);
        if (doctor.phone && doctor.phone !== "Contact hospital") { const phone = document.createElement("p"); phone.textContent = `Contact: ${doctor.phone}`; card.appendChild(phone); }
        if (doctor.id && typeof window.bookAppointment === "function") {
            const button = document.createElement("button"); button.type = "button"; button.textContent = language === "bn" ? "অ্যাপয়েন্টমেন্ট বুক করুন" : "Book appointment";
            button.addEventListener("click", () => window.bookAppointment(String(doctor.id))); card.appendChild(button);
        }
        panel.appendChild(card);
    });
    messageElement.appendChild(panel);
}


// Task 29 + 39: retrieval confidence and structured feedback reasons.
function addAnswerQualityAndFeedback(messageElement, userQuestion, answer) {
    if (!messageElement) return;
    const quality = typeof window.getChatbotAnswerQuality === "function" ? window.getChatbotAnswerQuality(userQuestion) : { level: "low", score: 0, intent: "Unmatched", matchCount: 0 };
    const language = detectLanguage(userQuestion);
    const note = document.createElement("div"); note.className = "chatbot-quality-note";
    const level = language === "bn" ? ({ high: "উচ্চ", medium: "মাঝারি", low: "কম" }[quality.level] || "কম") : ({ high: "High", medium: "Medium", low: "Low" }[quality.level] || "Low");
    const label = document.createElement("span");
    label.textContent = language === "bn" ? `প্রশ্নের মিল: ${level} (${quality.score}%) · বিষয়: ${quality.intent} · এটি চিকিৎসার নির্ভুলতার স্কোর নয়` : `Retrieval confidence: ${level} (${quality.score}% text match) · Topic: ${quality.intent} · Not medical certainty`;
    note.appendChild(label);
    if (quality.level !== "high") {
        const caution = document.createElement("p");
        caution.textContent = quality.level === "low"
            ? (language === "bn" ? "প্রশ্নের সঙ্গে নির্ভরযোগ্য মিল পাওয়া যায়নি। উত্তরটি সাধারণ বা অসম্পূর্ণ হতে পারে—আরও নির্দিষ্ট করে লিখুন এবং চিকিৎসা সিদ্ধান্তের জন্য চিকিৎসকের পরামর্শ নিন।" : "No reliable question match was found. The response may be general or incomplete—rephrase your question and consult a clinician for care decisions.")
            : (language === "bn" ? "একাধিক কাছাকাছি বিষয় পাওয়া গেছে। আপনার পরিস্থিতি আলাদা হলে প্রশ্নটি আরও স্পষ্ট করুন; জরুরি লক্ষণ থাকলে হাসপাতালে যান।" : "Several related topics were found. Clarify your question if your situation differs; seek urgent care for warning signs.");
        note.appendChild(caution);
    }
    const disclosure = document.createElement("small"); disclosure.textContent = language === "bn" ? "আপনার প্রশ্ন পারফরম্যান্স বিশ্লেষণের জন্য সংরক্ষিত হতে পারে। চ্যাট ইতিহাস সংরক্ষণ আলাদা এবং ডিফল্টভাবে বন্ধ।" : "Your question may be stored for performance analytics. Local chat-history saving is separate and off by default.";
    note.appendChild(disclosure); messageElement.appendChild(note);

    const feedback = document.createElement("div"); feedback.className = "chatbot-feedback"; feedback.setAttribute("role", "group");
    const prompt = document.createElement("span"); prompt.className = "chatbot-feedback-prompt"; prompt.textContent = language === "bn" ? "এই উত্তরটি কি সহায়ক ছিল?" : "Was this answer helpful?"; feedback.appendChild(prompt);
    const status = document.createElement("span"); status.className = "chatbot-feedback-status"; status.setAttribute("aria-live", "polite");
    const reasonPanel = document.createElement("div"); reasonPanel.className = "chatbot-feedback-reason-panel"; reasonPanel.hidden = true;
    const reasonLabel = document.createElement("label"); reasonLabel.textContent = language === "bn" ? "কেন সহায়ক হয়নি?" : "What was wrong with this answer?";
    const reason = document.createElement("select");
    const choices = language === "bn"
        ? [["", "কারণ নির্বাচন করুন (ঐচ্ছিক)"], ["inaccurate", "তথ্য ভুল মনে হয়েছে"], ["irrelevant", "প্রশ্নের সঙ্গে মেলেনি"], ["unclear", "বোঝা কঠিন"], ["outdated", "তথ্য পুরোনো"], ["safety_concern", "নিরাপত্তা/চিকিৎসা-ঝুঁকি"], ["other", "অন্যান্য"]]
        : [["", "Choose a reason (optional)"], ["inaccurate", "Possibly inaccurate"], ["irrelevant", "Did not answer my question"], ["unclear", "Hard to understand"], ["outdated", "Outdated information"], ["safety_concern", "Medical safety concern"], ["other", "Other"]];
    choices.forEach(([value, text]) => { const option = document.createElement("option"); option.value = value; option.textContent = text; reason.appendChild(option); });
    reasonLabel.appendChild(reason);
    const comment = document.createElement("textarea"); comment.maxLength = 300; comment.rows = 2; comment.placeholder = language === "bn" ? "অতিরিক্ত মন্তব্য (ঐচ্ছিক, সর্বোচ্চ ৩০০ অক্ষর; নাম/ফোন দেবেন না)" : "Optional comment (max 300 characters; no names or phone numbers)";
    const send = document.createElement("button"); send.type = "button"; send.textContent = language === "bn" ? "মতামত পাঠান" : "Submit feedback";
    reasonPanel.append(reasonLabel, comment, send);

    async function submitRating(rating) {
        if (feedback.dataset.submitted === "true") return;
        feedback.querySelectorAll("button").forEach(button => button.disabled = true);
        const matched = window.getTopDengueMatches ? window.getTopDengueMatches(userQuestion, 1)[0] : null;
        const record = {
            question: String(userQuestion || "").slice(0, 500), answerPreview: String(answer || "").slice(0, 400),
            matchedQuestion: String(matched && matched.question || userQuestion || "").slice(0, 300), rating,
            feedbackReason: rating === "not_helpful" ? reason.value : "", feedbackComment: rating === "not_helpful" ? comment.value.trim().slice(0, 300) : "",
            intent: String(quality.intent || "Unmatched").slice(0, 80), matchScore: quality.score, matchLevel: quality.level,
            language: language === "bn" ? "bn" : "en", userId: auth.currentUser ? auth.currentUser.uid : null,
            createdAt: serverTimestamp(), createdAtClient: new Date().toISOString()
        };
        try {
            const feedbackRef = await addDoc(collection(db, "chatbot_feedback"), record);
            let issueSaved = true;
            if (rating === "not_helpful") {
                try {
                    await addDoc(collection(db, "chatbot_answer_issues"), {
                        feedbackId: feedbackRef.id, question: record.question, sourceQuestion: record.matchedQuestion,
                        answerPreview: record.answerPreview, matchedAnswerBn: String(matched && matched.answerBn || "").slice(0, 4000),
                        matchedAnswerEn: String(matched && matched.answerEn || "").slice(0, 4000), intent: record.intent,
                        matchScore: record.matchScore, language: record.language, feedbackReason: record.feedbackReason,
                        feedbackComment: record.feedbackComment, status: "pending", reporterUid: record.userId,
                        createdAt: serverTimestamp(), createdAtClient: record.createdAtClient
                    });
                } catch (error) { issueSaved = false; console.error("Answer issue queue save failed:", error); }
            }
            feedback.dataset.submitted = "true"; reasonPanel.hidden = true;
            status.textContent = rating === "not_helpful"
                ? (language === "bn" ? (issueSaved ? "ধন্যবাদ! মতামতটি Admin Review Queue-তে পাঠানো হয়েছে।" : "Feedback সংরক্ষিত হয়েছে, তবে Review Queue-তে পাঠানো যায়নি।") : (issueSaved ? "Thank you! Your feedback was sent for review." : "Feedback saved, but the review item could not be created."))
                : (language === "bn" ? "ধন্যবাদ! আপনার মতামত সংরক্ষণ করা হয়েছে।" : "Thank you! Your feedback was saved.");
        } catch (error) {
            console.error("Chatbot feedback save failed:", error);
            try {
                const key = "smartDengueFeedbackPending"; const pending = JSON.parse(localStorage.getItem(key) || "[]");
                pending.push({ ...record, createdAt: null, savedLocally: true }); localStorage.setItem(key, JSON.stringify(pending.slice(-50)));
                feedback.dataset.submitted = "true"; reasonPanel.hidden = true;
                status.textContent = language === "bn" ? "সার্ভারে পাঠানো যায়নি। মতামতটি এই ব্রাউজারে সাময়িকভাবে রাখা হয়েছে।" : "Could not reach the server. Feedback was kept temporarily in this browser only.";
            } catch (storageError) {
                feedback.querySelectorAll("button").forEach(button => button.disabled = false);
                status.textContent = language === "bn" ? "মতামত সংরক্ষণ করা যায়নি। পরে আবার চেষ্টা করুন।" : "Feedback could not be saved. Please try again later.";
            }
        }
    }
    function makeButton(rating, label, onClick) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chatbot-feedback-button";
        button.textContent = label;
        button.addEventListener("click", onClick);
        return button;
    }
    const helpful = makeButton("helpful", language === "bn" ? "👍 সহায়ক" : "👍 Helpful", () => submitRating("helpful"));
    const notHelpful = makeButton("not_helpful", language === "bn" ? "👎 সহায়ক নয়" : "👎 Not helpful", () => { reasonPanel.hidden = false; notHelpful.disabled = true; });
    send.addEventListener("click", () => submitRating("not_helpful"));
    feedback.append(helpful, notHelpful, reasonPanel, status); messageElement.appendChild(feedback);
}

// Task 30: clickable follow-up prompts continue the current conversation.
function addSuggestedFollowUps(messageElement, userQuestion) {
    if (!messageElement || typeof window.getChatbotSuggestedFollowUps !== "function") return;
    const suggestions = window.getChatbotSuggestedFollowUps(userQuestion, 3); if (!suggestions.length) return;
    const wrapper = document.createElement("div"); wrapper.className = "chatbot-followups";
    const heading = document.createElement("strong"); heading.textContent = detectLanguage(userQuestion) === "bn" ? "এরপর জানতে পারেন" : "You can also ask"; wrapper.appendChild(heading);
    suggestions.forEach(question => { const button = document.createElement("button"); button.type = "button"; button.textContent = question; button.addEventListener("click", () => { if (!chatbotInput || !chatbotForm) return; chatbotInput.value = question; chatbotForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }); wrapper.appendChild(button); });
    messageElement.appendChild(wrapper);
}


// Task 3: show the 15 closest question-bank matches under each bot answer.
function addTopMatchesDisclosure(messageElement, userQuestion) {
    if (!messageElement || typeof window.getTopDengueMatches !== "function") return;
    const matches = window.getTopDengueMatches(userQuestion, 15);
    if (!matches.length) return;

    const language = detectLanguage(userQuestion);
    const wrapper = document.createElement("div");
    wrapper.className = "top-matches-wrapper";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "top-matches-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = language === "bn"
        ? `আরও ${matches.length}টি মিল পাওয়া প্রশ্ন দেখুন`
        : `View ${matches.length} similar questions`;

    const list = document.createElement("ol");
    list.className = "top-matches-list";
    list.hidden = true;

    const topicLabels = language === "bn"
        ? { symptoms:"লক্ষণ", prevention:"প্রতিরোধ", tests:"পরীক্ষা", platelets:"প্লেটলেট", food:"খাবার", medicine:"ওষুধ", recovery:"সুস্থতা", warning:"বিপদের লক্ষণ", transmission:"সংক্রমণ", general:"সাধারণ" }
        : { symptoms:"Symptoms", prevention:"Prevention", tests:"Tests", platelets:"Platelets", food:"Food", medicine:"Medicine", recovery:"Recovery", warning:"Warning signs", transmission:"Transmission", general:"General" };

    matches.forEach(match => {
        const item = document.createElement("li");
        item.className = "top-match-item";
        const question = document.createElement("span");
        question.className = "top-match-question";
        question.textContent = match.question;
        const meta = document.createElement("span");
        meta.className = "top-match-meta";
        meta.textContent = `${topicLabels[match.topic] || match.topic} · ${match.similarityPercent}% ${language === "bn" ? "মিল" : "match"}`;
        const reason = document.createElement("small");
        reason.className = "top-match-reason";
        const signalLabels = language === "bn"
            ? { exact: "হুবহু প্রশ্ন", concept: "অর্থগত মিল", spelling: "বানান/উচ্চারণের মিল", keywords: "গুরুত্বপূর্ণ শব্দের মিল", "weak-overlap": "আংশিক শব্দের মিল" }
            : { exact: "Exact wording", concept: "Meaning/concept overlap", spelling: "Spelling or wording similarity", keywords: "Keyword overlap", "weak-overlap": "Partial wording overlap" };
        const signals = Array.isArray(match.matchSignals) ? match.matchSignals : [];
        reason.textContent = (language === "bn" ? "মিলের কারণ: " : "Why it matched: ") +
            (signals.length ? signals.map(signal => signalLabels[signal] || signal).join(language === "bn" ? " + " : " + ")
                : (language === "bn" ? "শব্দের মিল" : "Text overlap"));
        item.appendChild(question);
        item.appendChild(meta);
        item.appendChild(reason);
        list.appendChild(item);
    });

    const note = document.createElement("p");
    note.className = "top-matches-note";
    note.textContent = language === "bn"
        ? "নোট: এই স্কোর শুধু প্রশ্নের ভাষাগত মিল বোঝায়; এটি রোগ নির্ণয় বা চিকিৎসার নির্ভুলতার স্কোর নয়।"
        : "Note: Scores indicate text similarity only, not diagnostic or medical accuracy.";

    toggle.addEventListener("click", function () {
        const willOpen = list.hidden;
        list.hidden = !willOpen;
        toggle.setAttribute("aria-expanded", String(willOpen));
        toggle.textContent = willOpen
            ? (language === "bn" ? "মিল পাওয়া প্রশ্নগুলো লুকান" : "Hide similar questions")
            : (language === "bn" ? `আরও ${matches.length}টি মিল পাওয়া প্রশ্ন দেখুন` : `View ${matches.length} similar questions`);
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(list);
    wrapper.appendChild(note);
    messageElement.appendChild(wrapper);
}


// Task 42 / Task 67: use the shared Bangla/English/Banglish detector.
function detectLanguage(text) {
    if (typeof window.detectDengueLanguage === "function") {
        return window.detectDengueLanguage(text);
    }
    const value = String(text || "").toLowerCase().normalize("NFKC");
    if (/[\u0980-\u09FF]/.test(value)) return "bn";
    const tokens = value.match(/[a-z]+/g) || [];
    const banglish = new Set(["ki","keno","kivabe","kibhabe","amr","amar","ami","apni","tumi","betha","batha","jor","jhor","matha","shorir","sorir","rokto","bomi","oshud","osud","khabar","khaoa","komse","komche","hoise","tahole","ekhon","ache","ase"]);
    return tokens.some(token => banglish.has(token)) ? "bn" : "en";
}

// Normalize Question
function normalizeQuestion(text) {
    return text.toLowerCase()
        .replace(/[.,!?;:।\-()[\]{}"'“”‘’]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// Dengue Knowledge Base
const dengueKnowledge = [

    {
        topic: "symptoms",

        keywords: [
            "symptom", "symptoms", "লক্ষণ", "উপসর্গ",
            "চিহ্ন", "fever", "জ্বর", "headache",
            "মাথাব্যথা", "মাথা ব্যথা", "body pain",
            "শরীর ব্যথা", "গা ব্যথা", "চোখের ব্যথা",
            "joint pain", "rash", "ফুসকুড়ি",
            "বমি বমি ভাব", "nausea", "গায়ে ব্যথা",
            "চোখ ব্যথা", "ব্যথা করছে"
        ],

        answerBn: "ডেঙ্গুর সাধারণ লক্ষণ:\n\n১. হঠাৎ উচ্চ জ্বর\n২. তীব্র মাথাব্যথা\n৩. চোখের পেছনে ব্যথা\n৪. শরীর ও জয়েন্টে ব্যথা\n৫. বমি বমি ভাব বা বমি\n৬. ত্বকে র‍্যাশ\n\nশুধু লক্ষণ দেখে ডেঙ্গু নিশ্চিত করা যায় না। চিকিৎসকের পরামর্শ নিন।",

        answerEn: "Common dengue symptoms include:\n\n1. Sudden high fever\n2. Severe headache\n3. Pain behind the eyes\n4. Muscle and joint pain\n5. Nausea or vomiting\n6. Skin rash\n\nSymptoms alone cannot confirm dengue. Consult a healthcare professional."
    },

    {
        topic: "prevention",

        keywords: [
    "prevention", "prevent", "প্রতিরোধ",
    "বাঁচব", "বাঁচার", "বাঁচার উপায়",
    "উপায়", "রক্ষা", "মশা", "mosquito",
    "মশারি", "এডিস", "aedes", "জমা পানি",
    "মশার কামড়", "mosquito bite",
    "মশা থেকে বাঁচা", "repellent",
    "মশার ওষুধ", "পানি জমা"
],

        answerBn: "ডেঙ্গু প্রতিরোধে:\n\n১. বাড়ির আশপাশে জমে থাকা পানি পরিষ্কার করুন।\n২. মশারি ব্যবহার করুন।\n৩. লম্বা হাতার পোশাক পরুন।\n৪. পানির পাত্র ঢেকে রাখুন।\n৫. ফুলের টব ও ড্রেন নিয়মিত পরিষ্কার রাখুন।",

        answerEn: "Dengue prevention tips:\n\n1. Remove standing water around your home.\n2. Use mosquito nets and repellents.\n3. Wear full-sleeved clothing.\n4. Keep water containers covered.\n5. Clean flower pots and drains regularly."
    },

    {
        topic: "test",

        keywords: [
            "test", "tests", "পরীক্ষা", "রক্ত পরীক্ষা",
            "ns1", "cbc", "igm", "igg",
            "blood test", "রিপোর্ট", "report",
            "ডেঙ্গু পরীক্ষা", "কোন পরীক্ষা",
            "কোন টেস্ট", "রক্তের রিপোর্ট"
        ],

        answerBn: "ডেঙ্গু পরীক্ষার মধ্যে থাকতে পারে:\n\n১. NS1 Antigen Test — সংক্রমণের প্রাথমিক পর্যায়ে কাজে লাগে।\n২. IgM Antibody Test — পরবর্তী পর্যায়ের সংক্রমণ শনাক্ত করতে সাহায্য করতে পারে।\n৩. CBC — প্লাটিলেট ও হেমাটোক্রিটসহ রক্তের বিভিন্ন বিষয় পর্যবেক্ষণে সাহায্য করে।\n\nকোন পরীক্ষা কখন প্রয়োজন, তা চিকিৎসক নির্ধারণ করবেন।",

        answerEn: "Dengue tests may include:\n\n1. NS1 Antigen test - useful during the early phase.\n2. IgM antibody test - may help identify a later infection.\n3. CBC - helps monitor blood counts, including platelets and hematocrit.\n\nA doctor should determine which test is appropriate and when."
    },

    {
        topic: "platelet",

        keywords: [
            "platelet", "platelets", "প্লাটিলেট",
            "প্লেটলেট", "রক্তের কণিকা",
            "platelet count", "প্লাটিলেট কম",
            "প্লাটিলেট কমে", "রক্তের প্লাটিলেট",
            "low platelet", "platelet low",
            "কত প্লাটিলেট"
        ],

        answerBn: "প্লাটিলেট রক্ত জমাট বাঁধতে সাহায্য করে। ডেঙ্গুতে প্লাটিলেট কমতে পারে। তবে শুধু প্লাটিলেটের সংখ্যা দিয়ে রোগের তীব্রতা নির্ধারণ করা যায় না। চিকিৎসক লক্ষণ, রক্তপাত, হেমাটোক্রিট এবং সামগ্রিক অবস্থা বিবেচনা করেন।",

        answerEn: "Platelets help blood clot. In dengue, platelet counts may decrease. However, platelet count alone does not determine disease severity. Doctors also assess symptoms, bleeding, hematocrit and overall condition."
    },

    {
        topic: "food",

        keywords: [
            "food", "foods", "খাবার", "খাওয়া",
            "খাব", "খেতে", "diet", "পানি",
            "water", "ors", "ডাব", "ডাবের পানি",
            "coconut", "coconut water", "fruit",
            "ফল", "juice", "জুস", "দুধ",
            "milk", "ভাত", "খেতে পারি",
            "খাওয়া যাবে", "কি খাব", "কি খেতে",
            "কি পান করব", "drink"
        ],

        answerBn: "ডেঙ্গুতে:\n\n১. পর্যাপ্ত তরল পান করুন।\n২. চিকিৎসকের পরামর্শ অনুযায়ী ORS পান করুন।\n৩. সহজে হজম হয় এমন পুষ্টিকর খাবার খান।\n৪. ক্ষুধা কম থাকলে অল্প অল্প করে খাবার খান।\n৫. চিকিৎসকের খাদ্যসংক্রান্ত পরামর্শ অনুসরণ করুন।",

        answerEn: "During dengue recovery:\n\n1. Drink adequate fluids.\n2. Take ORS if advised by your healthcare professional.\n3. Eat nutritious, easily digestible food.\n4. Take small meals if you have a poor appetite.\n5. Follow your doctor's dietary advice."
    },

    {
        topic: "recovery",

        keywords: [
            "recovery", "recover", "সুস্থ", "সেরে",
            "বিশ্রাম", "rest", "কতদিন", "কত দিন",
            "ভালো হব", "দুর্বলতা", "weakness",
            "কত দিনে সুস্থ", "কতদিন লাগে",
            "কত দিন লাগে", "সুস্থ হতে",
            "জ্বর কমেছে", "fever gone"
        ],

        answerBn: "ডেঙ্গু থেকে সুস্থ হওয়ার সময়:\n\n১. পর্যাপ্ত বিশ্রাম নিন।\n২. পর্যাপ্ত তরল পান করুন।\n৩. চিকিৎসকের পরামর্শ অনুযায়ী পরীক্ষা করান।\n৪. শরীরের অবস্থা পর্যবেক্ষণ করুন।\n৫. চিকিৎসকের নির্দেশনা অনুসরণ করুন।\n\nসুস্থ হতে কতদিন লাগবে তা ব্যক্তিভেদে আলাদা হতে পারে।",

        answerEn: "Dengue recovery advice:\n\n1. Take adequate rest.\n2. Drink enough fluids.\n3. Monitor symptoms and follow-up blood tests as advised.\n4. Follow your doctor's instructions.\n\nRecovery time varies from person to person."
    },

    {
        topic: "warning",

        keywords: [
            "warning", "danger", "বিপদ",
            "রক্তপাত", "bleeding", "পেট ব্যথা",
            "abdominal pain", "vomiting", "বমি",
            "শ্বাসকষ্ট", "breathing", "অতিরিক্ত দুর্বল",
            "রক্ত পড়া", "blood in vomit",
            "রক্ত বমি", "বারবার বমি",
            "তীব্র পেটব্যথা", "অজ্ঞান"
        ],

        answerBn: "ডেঙ্গুর বিপদের লক্ষণ:\n\n১. তীব্র পেটব্যথা\n২. বারবার বমি\n৩. নাক বা মাড়ি দিয়ে রক্তপাত\n৪. বমি বা পায়খানায় রক্ত\n৫. শ্বাসকষ্ট\n৬. অতিরিক্ত দুর্বলতা, অস্থিরতা বা ঝিমুনি\n\nএগুলোর যেকোনো একটি দেখা দিলে অবিলম্বে হাসপাতালে যান। জ্বর কমে গেলেও অপেক্ষা করবেন না।",

        answerEn: "WARNING SIGNS OF SEVERE DENGUE:\n\n- Severe abdominal pain\n- Persistent vomiting\n- Bleeding from gums or nose\n- Blood in vomit or stool\n- Difficulty breathing\n- Extreme weakness, restlessness or drowsiness\n\nSeek emergency medical care immediately if any warning sign appears. Do not wait for the fever to return."
    },

    {
        topic: "medicine",

        keywords: [
            "medicine", "medication", "ওষুধ",
            "paracetamol", "প্যারাসিটামল",
            "aspirin", "ibuprofen", "painkiller",
            "ব্যথার ওষুধ", "জ্বরের ওষুধ",
            "কোন ওষুধ", "ওষুধ খেতে"
        ],

        answerBn: "ডেঙ্গু হলে চিকিৎসকের পরামর্শ ছাড়া ওষুধ খাবেন না। প্রয়োজন হলে চিকিৎসকের নির্দেশ অনুযায়ী Paracetamol ব্যবহার করা যেতে পারে। ডেঙ্গু সন্দেহ হলে Aspirin ও Ibuprofen এড়িয়ে চলুন, কারণ এগুলো রক্তপাতের ঝুঁকি বাড়াতে পারে।",

        answerEn: "Do not take medicines without medical advice. Paracetamol may be used for fever when appropriate, but follow your doctor's instructions. Avoid aspirin and ibuprofen in suspected dengue because they may increase bleeding risk."
    },

    {
        topic: "spread",

        keywords: [
            "spread", "transmission", "ছড়ায়",
            "ছড়ায় কীভাবে", "কীভাবে হয়",
            "কিভাবে হয়", "কামড়", "bite",
            "mosquito bite", "এডিস মশা",
            "একজন থেকে আরেকজন",
            "how transmitted"
        ],

        answerBn: "সংক্রমিত এডিস মশার কামড়ে ডেঙ্গু ছড়ায়। সাধারণত একজন মানুষের কাছ থেকে সরাসরি আরেকজন মানুষের শরীরে ডেঙ্গু ছড়ায় না।",

        answerEn: "Dengue spreads mainly through the bite of an infected Aedes mosquito. It does not normally spread directly from one person to another."
    }
];


// Greeting Messages
const greetingKeywords = [
    "hello", "hi", "hey", "হ্যালো",
    "আসসালামু", "সালাম"
];


// Find Dengue Answer
function getDengueAnswer(message) {

    const question = normalizeQuestion(message);
    const language = detectLanguage(message);

    // Greeting
    if (greetingKeywords.some(word => question.includes(word))) {
        return language === "bn"
            ? "আসসালামু আলাইকুম! আমি Dengue Assistant। ডেঙ্গু সম্পর্কে কী জানতে চান?"
            : "Hello! I am Dengue Assistant. What would you like to know about dengue?";
    }

    // Find the best matching topic
    let bestMatch = null;
    let bestScore = 0;

    for (const item of dengueKnowledge) {

        let score = 0;

        for (const keyword of item.keywords) {

            const key = normalizeQuestion(keyword);

            // Exact phrase matching
            if (question.includes(key)) {
                score += key.includes(" ") ? 4 : 2;
            }

            // Partial word matching
            const questionWords = question.split(" ");
            const keywordWords = key.split(" ");

            for (const word of keywordWords) {
                if (
                    word.length >= 4 &&
                    questionWords.some(qWord =>
                        qWord.length >= 4 &&
                        (qWord.includes(word) || word.includes(qWord))
                    )
                ) {
                    score += 1;
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    // Reject unrelated or unmatched questions
    if (!bestMatch || bestScore < 2) {

        return language === "bn"
            ? "দুঃখিত! আমি শুধুমাত্র ডেঙ্গু সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। আপনার প্রশ্নটি আরেকটু বিস্তারিতভাবে লিখুন।"
            : "Sorry! I can only answer dengue-related questions. Please try asking your question with a little more detail.";
    }

    // Return answer in user's language
    return language === "bn"
        ? bestMatch.answerBn
        : bestMatch.answerEn;
}


// Task 15: record one lightweight analytics event per submitted chatbot question.
// The raw question is retained to calculate popular questions; no answer body is stored.
async function recordChatbotQueryEvent(userQuestion) {
    try {
        const matches = typeof window.getTopDengueMatches === "function"
            ? window.getTopDengueMatches(userQuestion, 15)
            : [];
        const best = matches[0] || null;
        const quality = typeof window.getChatbotAnswerQuality === "function"
            ? window.getChatbotAnswerQuality(userQuestion)
            : { score: 0, level: "low", intent: "Unmatched" };
        const resolvedQuery = typeof window.resolveDengueFollowUpQuery === "function"
            ? window.resolveDengueFollowUpQuery(userQuestion)
            : userQuestion;
        const contextUsed = String(resolvedQuery) !== String(userQuestion);

        await addDoc(collection(db, "chatbot_query_events"), {
            question: String(userQuestion || "").slice(0, 500),
            matchedQuestion: String(best && best.question || "").slice(0, 300),
            topic: String(best && best.topic || quality.intent || "Unmatched").slice(0, 80),
            matchScore: Math.max(0, Math.min(100, Number(quality.score) || 0)),
            matchLevel: ["high", "medium", "low"].includes(quality.level) ? quality.level : "low",
            language: detectLanguage(userQuestion) === "bn" ? "bn" : "en",
            isUnmatched: !best || quality.level === "low",
            topMatchCount: matches.length,
            contextUsed,
            userId: auth.currentUser ? auth.currentUser.uid : null,
            createdAt: serverTimestamp(),
            createdAtClient: new Date().toISOString()
        });
    } catch (error) {
        console.warn("Chatbot analytics event could not be saved:", error);
    }
}


// Task 40 / Task 66: browser-provided voice input; no custom paid speech API is integrated. Browser/provider processing may vary.
function setupChatbotVoiceInput() {
    const button = document.getElementById("chatbot-voice-button");
    const status = document.getElementById("chatbot-voice-status");
    if (!button || !chatbotInput) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        button.disabled = true;
        button.title = "Voice input is not supported in this browser";
        if (status) status.textContent = "Voice input is not supported in this browser. You can type your question.";
        return;
    }
    let recognition = null;
    let listening = false;
    button.addEventListener("click", () => {
        if (listening && recognition) { recognition.stop(); return; }
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        const languageChoice = document.getElementById("chatbot-voice-language")?.value || "auto";
        recognition.lang = languageChoice === "auto"
            ? (chatbotInput.value.trim() ? (detectLanguage(chatbotInput.value) === "bn" ? "bn-BD" : "en-US") : "bn-BD")
            : languageChoice;
        recognition.onstart = () => {
            listening = true;
            button.textContent = "⏹";
            button.setAttribute("aria-label", "Stop voice input");
            if (status) status.textContent = recognition.lang === "bn-BD" ? "শুনছি… প্রশ্নটি বলুন।" : "Listening… speak your question.";
        };
        recognition.onresult = event => {
            const transcript = Array.from(event.results || []).map(result => result[0]?.transcript || "").join(" ").trim();
            if (transcript) {
                chatbotInput.value = transcript.slice(0, 300);
                chatbotInput.focus();
                if (typeof updateChatbotLanguageStatus === "function") updateChatbotLanguageStatus();
                if (status) status.textContent = detectLanguage(transcript) === "bn"
                    ? "কথা থেকে লেখা তৈরি হয়েছে। পাঠানোর আগে দেখে নিন।"
                    : "Transcript ready. Review it before sending.";
            }
        };
        recognition.onerror = event => {
            if (status) status.textContent = event.error === "not-allowed"
                ? "Microphone permission was denied. Allow microphone access or type your question."
                : `Voice input error: ${event.error || "unknown"}. Please type your question.`;
        };
        recognition.onend = () => {
            listening = false;
            button.textContent = "🎙️";
            button.setAttribute("aria-label", "Speak your question");
        };
        try { recognition.start(); }
        catch (error) {
            listening = false;
            button.textContent = "🎙️";
            if (status) status.textContent = "Voice input could not start. Try again or type your question.";
        }
    });
}

// Task 41 / Task 66: use the browser/device speech synthesis engine; no custom speech API is called by this app.
let activeChatbotSpeechButton = null;
function speakChatbotAnswer(message, button = null) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return false;
    if (activeChatbotSpeechButton && activeChatbotSpeechButton !== button) activeChatbotSpeechButton.textContent = "🔊 Listen";
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    activeChatbotSpeechButton = button;
    const utterance = new SpeechSynthesisUtterance(String(message || "").slice(0, 5000));
    utterance.lang = detectLanguage(message) === "bn" ? "bn-BD" : "en-US";
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2)));
    if (preferred) utterance.voice = preferred;
    if (button) {
        utterance.onstart = () => { button.textContent = "⏹ Stop"; };
        utterance.onend = utterance.onerror = () => {
            button.textContent = "🔊 Listen";
            if (activeChatbotSpeechButton === button) activeChatbotSpeechButton = null;
        };
    }
    window.speechSynthesis.speak(utterance);
    return true;
}

function addChatbotSpeechButton(messageElement, message) {
    if (!messageElement || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chatbot-speech-button";
    button.textContent = "🔊 Listen";
    button.setAttribute("aria-label", "Read this answer aloud");
    button.addEventListener("click", () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            button.textContent = "🔊 Listen";
            if (activeChatbotSpeechButton === button) activeChatbotSpeechButton = null;
            return;
        }
        speakChatbotAnswer(message, button);
    });
    messageElement.appendChild(button);
}

// Task 44: clickable starter prompts use the existing submit pipeline.
function setupChatbotStarterQuestions() {
    const wrapper = document.getElementById("chatbot-starter-questions");
    if (!wrapper || !chatbotForm || !chatbotInput) return;
    wrapper.querySelectorAll("[data-starter-question]").forEach(button => {
        button.addEventListener("click", () => {
            chatbotInput.value = button.dataset.starterQuestion || "";
            if (typeof updateChatbotLanguageStatus === "function") updateChatbotLanguageStatus();
            chatbotForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
    });
}

// Task 67: show the language hint without changing or translating user text.
function updateChatbotLanguageStatus() {
    const status = document.getElementById("chatbot-language-status");
    if (!status || !chatbotInput) return;
    const value = chatbotInput.value.trim();
    if (!value) {
        status.textContent = "Language auto-detection ready / ভাষা স্বয়ংক্রিয়ভাবে শনাক্ত হবে";
        return;
    }
    const details = typeof window.detectDengueLanguageDetails === "function"
        ? window.detectDengueLanguageDetails(value)
        : { language: detectLanguage(value), confidence: null, mixed: false };
    const languageLabel = details.language === "bn"
        ? (details.mixed ? "Bangla/Banglish or mixed input" : "Bangla/Banglish")
        : "English";
    const confidence = Number.isFinite(details.confidence)
        ? ` · ${Math.round(details.confidence * 100)}% language-hint confidence` : "";
    status.textContent = `Detected language: ${languageLabel}${confidence}. This is only a language hint.`;
}

// Send Message
setupChatbotVoiceInput();
setupChatbotStarterQuestions();
if (chatbotInput) chatbotInput.addEventListener("input", updateChatbotLanguageStatus);
updateChatbotLanguageStatus();

if (chatbotForm) {

    chatbotForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = chatbotInput.value.trim();

        if (!message) return;

        addChatMessage(message, "user-message");
        syncChatbotStarterVisibility();

        chatbotInput.value = "";
        updateChatbotLanguageStatus();

        const answer = getDengueBankAnswer(message);
        // Fire-and-forget: do not delay the answer while analytics are written.
        recordChatbotQueryEvent(message);

        const botMessageElement = addChatMessage(answer, "bot-message");
        const emergencyResult = addEmergencyAlert(botMessageElement, message);
        addMedicineSafetyAlert(botMessageElement, message, answer);
        addAnswerQualityAndFeedback(botMessageElement, message, answer);
        addMedicalReviewAndReferences(botMessageElement, message);
        addSuggestedFollowUps(botMessageElement, message);
        addDoctorRecommendation(botMessageElement, message, emergencyResult);
        addTopMatchesDisclosure(botMessageElement, message);

        const autoSpeak = document.getElementById("chatbot-auto-speak");
        if (autoSpeak && autoSpeak.checked) {
            const spokenText = emergencyResult.isEmergency
                ? (detectLanguage(message) === "bn"
                    ? "জরুরি সতর্কতা। এখনই চিকিৎসা নিন। " + answer
                    : "Emergency warning. Seek medical care now. " + answer)
                : answer;
            speakChatbotAnswer(spokenText);
        }

        scrollChatToLatest();

        chatbotInput.focus();
    });
}
