import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, query, where, limit,
  addDoc, updateDoc, serverTimestamp, orderBy, onSnapshot
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
let user = null;
let activeConversationId = null;
let stopMessages = null;

function el(tag, value, cls = "") {
  const node = document.createElement(tag);
  node.textContent = String(value ?? "");
  if (cls) node.className = cls;
  return node;
}
function status(message, bad = false) {
  const node = $("doctor-message-status");
  if (node) { node.textContent = message; node.style.color = bad ? "#a32620" : "#60747b"; }
}
async function loadVerifiedDoctors() { return; }
async function startConversation() { return; }
async function loadConversations() {
  const box = $("doctor-conversation-list");
  if (!box || !user) return;
  box.replaceChildren();
  try {
    const snap = await getDocs(query(collection(db, "doctor_patient_conversations"), where("doctorUid", "==", user.uid), limit(50)));
    if (snap.empty) box.append(el("p", "No doctor conversations yet."));
    snap.docs.forEach(item => {
      const data = item.data();
      const button = el("button", `${data.patientDisplayName || "Patient"} · ${data.status || "open"}`);
      button.type = "button";
      button.className = "secondary";
      button.addEventListener("click", () => openConversation(item.id));
      box.append(button);
    });
  } catch (error) {
    box.append(el("p", `Could not load conversations: ${error.code || error.message}`));
  }
}
function renderMessages(snapshot) {
  const box = $("doctor-message-thread");
  if (!box) return;
  box.replaceChildren();
  snapshot.docs.forEach(item => {
    const data = item.data();
    const card = el("article", "");
    card.className = "record";
    card.append(el("strong", data.senderUid === user?.uid ? "You" : "Patient"));
    card.append(el("p", data.text || ""));
    const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : "";
    card.append(el("small", date, "muted"));
    box.append(card);
  });
  box.scrollTop = box.scrollHeight;
}
async function openConversation(id) {
  activeConversationId = id;
  if (stopMessages) stopMessages();
  try {
    const ref = collection(db, "doctor_patient_conversations", id, "messages");
    stopMessages = onSnapshot(query(ref, orderBy("createdAt", "asc"), limit(100)), renderMessages, error => status(`Message stream failed: ${error.code || error.message}`, true));
  } catch (error) {
    status(`Could not open conversation: ${error.code || error.message}`, true);
  }
}
async function sendMessage(event) {
  event.preventDefault();
  const text = $("doctor-message-text").value.trim();
  if (!text || text.length > 2000 || !activeConversationId) {
    status("Open a conversation and enter a message of up to 2,000 characters.", true);
    return;
  }
  try {
    const conversationRef = doc(db, "doctor_patient_conversations", activeConversationId);
    await addDoc(collection(conversationRef, "messages"), {
      senderUid: user.uid,
      text,
      createdAt: serverTimestamp()
    });
    await updateDoc(conversationRef, {
      lastMessagePreview: text.slice(0, 120),
      lastMessageAt: serverTimestamp()
    });
    $("doctor-message-text").value = "";
    status("Message sent.");
  } catch (error) {
    status(`Message not sent: ${error.code || error.message}.`, true);
  }
}
$("doctor-message-start")?.addEventListener("click", startConversation);
$("doctor-message-form")?.addEventListener("submit", sendMessage);
onAuthStateChanged(auth, async current => {
  user = current;
  if (!user) return;
  if ($("doctor-conversation-list")) {
    await loadVerifiedDoctors();
    await loadConversations();
  }
});
