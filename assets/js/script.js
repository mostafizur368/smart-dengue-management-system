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

async function readTicketCount(doctorId, appointmentDate) {
    const ref = doc(db, "ticket_counts", ticketCountDocId(doctorId, appointmentDate));
    const snap = await getDoc(ref);
    return snap.exists() ? Number(snap.data().booked || 0) : 0;
}

async function incrementTicketCount(doctorId, appointmentDate) {
    const ref = doc(db, "ticket_counts", ticketCountDocId(doctorId, appointmentDate));
    await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        const booked = snap.exists() ? Number(snap.data().booked || 0) : 0;
        if (booked >= 30) throw new Error("This doctor's tickets are full for the selected date.");
        transaction.set(ref, {
            doctorId: String(doctorId),
            appointmentDate: String(appointmentDate),
            booked: booked + 1,
            total: 30,
            updatedAt: serverTimestamp()
        });
    });
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

const appointmentRef = await addDoc(collection(db, "appointments"), {
    userId: auth.currentUser.uid,
    patientName: patientName,
    patientPhone: patientPhone,
    doctorName: doctorName,
    doctorId: bookingDoctorId,
    doctorUid: bookingDoctorUid,
    appointmentDate: appointmentDate,
    appointmentTime: appointmentTime,
    status: "Demo booking - not hospital confirmed",
    timestamp: serverTimestamp()
});

try {
    await incrementTicketCount(bookingDoctorId, appointmentDate);
} catch (countError) {
    console.error("Ticket count sync failed:", countError);
}

        const ticket = document.getElementById("appointment-ticket");

        ticket.style.display = "block";
        ticket.innerHTML = `
            <h2>🎫 Appointment Ticket</h2>
            <p><strong>Ticket ID:</strong> ${appointmentRef.id}</p>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Phone:</strong> ${patientPhone}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Status:</strong> Demo booking — not confirmed by hospital.</p>
            <div style="margin-top:14px;padding:12px;border:1px dashed #087f8c;border-radius:10px;text-align:center">
              <h3>QR Code Appointment Ticket</h3>
              <div id="appointment-qr" style="display:flex;justify-content:center;margin:10px"></div>
              <small>Show this QR code to the admin for ticket reference.</small>
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
    const totalTickets = 30;
    for (const doctor of window.doctors || []) {
        const boxes = [
            document.getElementById(`ticket-count-${doctor.id}`),
            document.getElementById(`recommended-ticket-count-${doctor.id}`)
        ].filter(Boolean);
        if (!boxes.length) continue;
        try {
            const booked = await readTicketCount(doctor.id, selectedDate);
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
        const booked = await readTicketCount(doctorId, selectedDate);
        document.getElementById("date-total").textContent = 30;
        document.getElementById("date-booked").textContent = booked;
        document.getElementById("date-available").textContent = Math.max(0, 30 - booked);
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



// ===== Free Dengue Chatbot =====

// Chatbot Elements
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");


// Open Chatbot
if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", function () {
        chatbotWindow.style.display = "block";
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
function addChatMessage(message, className) {
    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.textContent = className === "bot-message"
    ? message
        .replace(/([০-৯0-9]+)[.।]\s*/g, "\n$1. ")
        .trim()
    : message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return messageElement;
}


// Detect Language
function detectLanguage(text) {
    const banglaPattern = /[\u0980-\u09FF]/;

    return banglaPattern.test(text) ? "bn" : "en";
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


// Send Message
if (chatbotForm) {

    chatbotForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = chatbotInput.value.trim();

        if (!message) return;

        addChatMessage(message, "user-message");

        chatbotInput.value = "";

       const answer = getDengueAnswer(message);

        addChatMessage(answer, "bot-message");

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        chatbotInput.focus();
    });
}
