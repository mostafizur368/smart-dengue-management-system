import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, getDocs, query, where, limit
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
let currentUser = null;
let hospitals = [];

function textNode(tag, text, cls = "") {
  const node = document.createElement(tag);
  node.textContent = String(text ?? "");
  if (cls) node.className = cls;
  return node;
}
function hasCoordinates(item) {
  return item?.lat !== null && item?.lat !== undefined && item?.lng !== null && item?.lng !== undefined
    && item.lat !== "" && item.lng !== ""
    && Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng))
    && Number(item.lat) >= -90 && Number(item.lat) <= 90
    && Number(item.lng) >= -180 && Number(item.lng) <= 180;
}
function kmBetween(lat1, lon1, lat2, lon2) {
  const rad = value => value * Math.PI / 180;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function renderHospitals(items) {
  const box = $("hospital-directory-list");
  if (!box) return;
  box.replaceChildren();
  if (!items.length) {
    box.append(textNode("p", "No active hospitals found in the directory yet.", "empty"));
    return;
  }
  items.forEach(hospital => {
    const card = textNode("article", "");
    card.className = "record";
    card.append(textNode("strong", hospital.name || "Hospital"));
    card.append(textNode("p", hospital.address || "Address not entered"));
    if (hospital.emergencyServices) card.append(textNode("p", "Emergency services listed"));
    if (hospital.phone) {
      const phone = document.createElement("a");
      phone.href = `tel:${String(hospital.phone).replace(/[^\d+]/g, "")}`;
      phone.textContent = `Call ${hospital.phone}`;
      card.append(phone);
    }
    if (hasCoordinates(hospital)) {
      const map = document.createElement("a");
      map.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.lat},${hospital.lng}`)}`;
      map.target = "_blank"; map.rel = "noopener noreferrer";
      map.textContent = "Open directions";
      card.append(map);
    }
    if (hospital.distanceKm !== undefined) card.append(textNode("p", `${hospital.distanceKm.toFixed(1)} km away`, "muted"));
    box.append(card);
  });
}
async function loadHospitals() {
  const status = $("hospital-directory-status");
  if (!status) return;
  status.textContent = "Loading hospital directory…";
  try {
    const snap = await getDocs(query(collection(db, "public_hospitals"), where("status", "==", "active"), limit(100)));
    hospitals = snap.docs.map(item => ({ id: item.id, ...item.data() }));
    renderHospitals(hospitals);
    status.textContent = `${hospitals.length} active hospital listing(s). Confirm emergency availability by phone before travelling.`;
  } catch (error) {
    status.textContent = `Could not load directory: ${error.code || error.message}.`;
  }
}
function locateNearestHospitals() {
  const status = $("hospital-locator-status");
  if (!navigator.geolocation) {
    status.textContent = "This browser does not support location. Search the directory or use the map links.";
    return;
  }
  status.textContent = "Requesting your location…";
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const ranked = hospitals
      .filter(hasCoordinates)
      .map(item => ({ ...item, distanceKm: kmBetween(latitude, longitude, Number(item.lat), Number(item.lng)) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    if (!ranked.length) {
      status.textContent = "No directory entries have verified map coordinates yet. Use the emergency map search below.";
      const link = $("hospital-emergency-map");
      if (link) {
        link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("emergency hospital near me")}`;
        link.hidden = false;
      }
      return;
    }
    renderHospitals(ranked.slice(0, 10));
    status.textContent = "Nearest listed hospitals by straight-line distance. Road travel time may be different; call ahead to confirm emergency services.";
    const link = $("hospital-emergency-map");
    if (link) {
      link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("emergency hospital near me")}`;
      link.hidden = false;
    }
  }, error => {
    status.textContent = error.code === 1
      ? "Location permission was not granted. You can still use the directory and map search."
      : "Could not determine your location. Use the directory and map search.";
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
}
$("hospital-locate-nearest")?.addEventListener("click", locateNearestHospitals);
$("hospital-search")?.addEventListener("input", () => {
  const needle = $("hospital-search").value.trim().toLowerCase();
  renderHospitals(hospitals.filter(item => [item.name, item.address, item.district, item.city].join(" ").toLowerCase().includes(needle)));
});
onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) loadHospitals();
});
