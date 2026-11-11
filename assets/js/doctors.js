// =====================================
// SMART DENGUE MANAGEMENT SYSTEM
// DOCTOR LIST
// =====================================
import { initializeApp, getApps, getApp }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnup3vd_NSkSKrhHtuZdQDJ0kuBZAci9o",
    authDomain: "smart-dengue-management-system.firebaseapp.com",
    projectId: "smart-dengue-management-system",
    storageBucket: "smart-dengue-management-system.firebasestorage.app",
    messagingSenderId: "164368465699",
    appId: "1:79fe552bea0b2bfc405696"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const doctors = [
    {
        id: 1,
        name: "Dr. Doctor One",
        specialization: "Medicine Specialist",
        hospital: "Rajshahi Medical College Hospital",
        address: "Rajshahi, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Rajshahi+Medical+College+Hospital"
    },
    {
        id: 2,
        name: "Dr. Doctor Two",
        specialization: "Medicine Specialist",
        hospital: "Dhaka Medical College Hospital",
        address: "Dhaka, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Dhaka+Medical+College+Hospital"
    },
    {
        id: 3,
        name: "Dr. Doctor Three",
        specialization: "Medicine Specialist",
        hospital: "Chittagong Medical College Hospital",
        address: "Chattogram, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Chittagong+Medical+College+Hospital"
    },
    {
        id: 4,
        name: "Dr. Doctor Four",
        specialization: "Medicine Specialist",
        hospital: "Mymensingh Medical College Hospital",
        address: "Mymensingh, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Mymensingh+Medical+College+Hospital"
    },
    {
        id: 5,
        name: "Dr. Doctor Five",
        specialization: "Medicine Specialist",
        hospital: "Sylhet MAG Osmani Medical College Hospital",
        address: "Sylhet, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Sylhet+MAG+Osmani+Medical+College+Hospital"
    },
    {
        id: 6,
        name: "Dr. Doctor Six",
        specialization: "Medicine Specialist",
        hospital: "Rangpur Medical College Hospital",
        address: "Rangpur, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Rangpur+Medical+College+Hospital"
    },
    {
        id: 7,
        name: "Dr. Doctor Seven",
        specialization: "Medicine Specialist",
        hospital: "Khulna Medical College Hospital",
        address: "Khulna, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Khulna+Medical+College+Hospital"
    },
    {
        id: 8,
        name: "Dr. Doctor Eight",
        specialization: "Medicine Specialist",
        hospital: "Rajshahi Medical College Hospital",
        address: "Rajshahi, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Rajshahi+Medical+College+Hospital"
    },
    {
        id: 9,
        name: "Dr. Doctor Nine",
        specialization: "Medicine Specialist",
        hospital: "Cumilla Medical College Hospital",
        address: "Cumilla, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Cumilla+Medical+College+Hospital"
    },
    {
        id: 10,
        name: "Dr. Doctor Ten",
        specialization: "Medicine Specialist",
        hospital: "Sher-e-Bangla Medical College Hospital",
        address: "Barishal, Bangladesh",
        phone: "Contact hospital",
        availableTime: "Please confirm with hospital",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Sher-e-Bangla+Medical+College+Hospital"
    }
];

console.log("Doctor list loaded successfully!");
console.log("Total doctors:", doctors.length);

const doctorsContainer = document.getElementById("doctors-container");

if (doctorsContainer) {
    doctorsContainer.innerHTML = doctors.map(function(doctor) {
        return `
            <div class="doctor-card">
                <h3>👨‍⚕️ ${doctor.name}</h3>
                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                <p><strong>Hospital:</strong> ${doctor.hospital}</p>
                <p><strong>Address:</strong> ${doctor.address}</p>
                <p><strong>Contact:</strong> ${doctor.phone}</p>
                <p><strong>Available:</strong> ${doctor.availableTime}</p>

<div class="ticket-count" id="ticket-count-${doctor.id}">
    <p>🎫 Total Tickets: 30</p>
    <p>✅ Booked: হিসাব হচ্ছে...</p>
    <p>🟢 Available: হিসাব হচ্ছে...</p>
</div>

                <a href="${doctor.mapLink}" target="_blank" rel="noopener noreferrer">
                    📍 View on Google Maps
                </a>
                <button
    type="button"
    class="appointment-btn"
    onclick="bookAppointment('${doctor.id}')">
    📅 Book Appointment
</button>
            </div>
        `;
    }).join("");
}
// Open Appointment Form

function bookAppointment(doctorId) {
    const doctor = doctors.find(function(item) {
        return String(item.id) === String(doctorId);
    });

    // Remember selected doctor
    sessionStorage.setItem("selectedDoctorId", doctorId);

    if (!doctor) {
        alert("Doctor not found!");
        return;
    }

    const appointmentSection =
        document.getElementById("appointment-section");

    const selectedDoctor =
        document.getElementById("selected-doctor");

    if (!appointmentSection || !selectedDoctor) {
        alert("Appointment form not found! Check index.html.");
        return;
    }

    // Hide only the doctor list
    document.getElementById("doctor-list").style.display = "none";

    // Show appointment form
    appointmentSection.style.display = "block";

    // Set selected doctor
    selectedDoctor.value =
        doctor.name + " - " + doctor.hospital;
        selectedDoctor.dataset.doctorId = doctor.id;
        if (window.updateSelectedDateAvailability) {
    window.updateSelectedDateAvailability();
}

    // Scroll to booking form
    appointmentSection.scrollIntoView({ block: "start" });
}

window.bookAppointment = bookAppointment;
window.doctors = doctors;

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("appointment-date");

    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (dateInput && !dateInput.value) {
        dateInput.value = localDate;
    }

    if (typeof window.updateDoctorTicketCounts === "function") {
        window.updateDoctorTicketCounts(
            dateInput && dateInput.value ? dateInput.value : localDate
        );
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("appointment-date");

    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (dateInput && !dateInput.value) {
        dateInput.value = localDate;
    }

    if (typeof window.updateDoctorTicketCounts === "function") {
        window.updateDoctorTicketCounts(
            dateInput && dateInput.value ? dateInput.value : localDate
        );
    }
});

/* =====================================
   APPROVED DOCTORS FROM FIRESTORE
===================================== */

// Create a card for a newly approved doctor
function appendApprovedDoctorCard(doctor) {
    const container = document.getElementById("doctors-container");

    if (!container) return;

    const card = document.createElement("div");
    card.className = "doctor-card";

    const heading = document.createElement("h3");
    heading.textContent = "👨‍⚕️ " + doctor.name;
    card.appendChild(heading);

    const details = [
        ["Specialization", doctor.specialization],
        ["Hospital", doctor.hospital],
        ["Address", doctor.address],
        ["Contact", doctor.phone],
        ["Available", doctor.availableTime]
    ];

    details.forEach(function (item) {
        const p = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = item[0] + ": ";
        p.appendChild(label);
        p.appendChild(
            document.createTextNode(item[1] || "Not provided")
        );

        card.appendChild(p);
    });

    const ticketBox = document.createElement("div");
    ticketBox.className = "ticket-count";
    ticketBox.id = "ticket-count-" + doctor.id;

    ticketBox.innerHTML = `
        <p>🎫 Total Tickets: 30</p>
        <p>✅ Booked: হিসাব হচ্ছে...</p>
        <p>🟢 Available: হিসাব হচ্ছে...</p>
    `;

    card.appendChild(ticketBox);

    const map = document.createElement("a");
    map.href = doctor.mapLink;
    map.target = "_blank";
    map.rel = "noopener noreferrer";
    map.textContent = "📍 View on Google Maps";
    card.appendChild(map);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "appointment-btn";
    button.textContent = "📅 Book Appointment";

    button.addEventListener("click", function () {
        bookAppointment(doctor.id);
    });

    card.appendChild(button);
    container.appendChild(card);
}


// Load only approved applications from Firestore
async function loadApprovedDoctors() {
    try {

const snapshot = await getDocs(
    collection(db, "public_doctors")
);
        const existingEmails = new Set(
            doctors
                .map(function (doctor) {
                    return (doctor.email || "").trim().toLowerCase();
                })
                .filter(Boolean)
        );

        snapshot.forEach(function (docSnap) {
            const data = docSnap.data();
            const email = (data.email || "").trim().toLowerCase();

            // Avoid adding the same doctor twice
if (existingEmails.has(docSnap.id)) {
    return;
}
const doctor = {
    id: docSnap.id,
    uid: data.doctorUid || null,
    email: email,
            
                name: data.name || "Doctor",
                specialization:
                    data.qualification || "Medicine Specialist",
                hospital:
                    data.hospital || "Hospital information unavailable",
                address: data.address || data.hospital || "Bangladesh",
                phone: data.phone || "Contact hospital",
                availableTime: "Please confirm with hospital",
                mapLink:
                    "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(
                        data.hospital || data.name || "hospital"
                    )
            };

            doctors.push(doctor);
            existingEmails.add(docSnap.id);

            appendApprovedDoctorCard(doctor);
        });

        console.log(
            "Approved applications found:",
            snapshot.size
        );

        // Refresh ticket counts if the existing project provides this function
        if (typeof window.updateDoctorTicketCounts === "function") {
            const dateInput =
                document.getElementById("appointment-date");

            if (dateInput && dateInput.value) {
                window.updateDoctorTicketCounts(dateInput.value);
            }
        }

    } catch (error) {
        console.error(
            "Could not load approved doctors:",
            error
        );
    }
}


// Start loading approved doctors and expose the promise for symptom recommendations.
window.doctorsReady = loadApprovedDoctors();
