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
  const node = $("patient-message-status");
  if (node) { node.textContent = message; node.style.color = bad ? "#a32620" : "#60747b"; }
}
async function loadVerifiedDoctors() {
  const select = $("patient-message-doctor");
  if (!select) return;
  select.replaceChildren(new Option("Choose a verified doctor", ""));
  try {
    const snap = await getDocs(query(collection(db, "public_doctors"), where("status", "==", "approved"), where("chatbotVerified", "==", true), limit(100)));
    snap.docs.forEach(item => {
      const data = item.data();
      select.add(new Option(`${data.name || "Doctor"} · ${data.hospital || "Hospital"}`, item.id));
    });
  } catch (error) {
    status(`Doctor list unavailable: ${error.code || error.message}`, true);
  }
}
async function startConversation() {
  const doctorUid = $("patient-message-doctor")?.value;
  if (!doctorUid || !user) { status("Choose a verified doctor first.", true); return; }
  try {
    const existing = await getDocs(query(
      collection(db, "doctor_patient_conversations"),
      where("patientUid", "==", user.uid),
      where("doctorUid", "==", doctorUid),
      limit(1)
    ));
    if (!existing.empty) {
      await loadConversations();
      await openConversation(existing.docs[0].id);
      status("Opened your existing secure conversation.");
      return;
    }
    const doctorSnap = await getDoc(doc(db, "public_doctors", doctorUid));
    if (!doctorSnap.exists() || doctorSnap.data().status !== "approved" || doctorSnap.data().chatbotVerified !== true) {
      status("This doctor is not currently verified for patient messaging.", true);
      return;
    }
    const ref = await addDoc(collection(db, "doctor_patient_conversations"), {
      patientUid: user.uid,
      doctorUid,
      participants: [user.uid, doctorUid],
      patientDisplayName: user.displayName || user.email || "Patient",
      doctorDisplayName: doctorSnap.data().name || "Doctor",
      status: "open",
      lastMessagePreview: "",
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp()
    });
    await loadConversations();
    await openConversation(ref.id);
    status("Secure conversation created. Avoid sending emergency requests or unnecessary sensitive details.");
  } catch (error) {
    status(`Could not start conversation: ${error.code || error.message}. Check the merged Firestore Rules.`, true);
  }
}
async function loadConversations() {
  const box = $("patient-conversation-list");
  if (!box || !user) return;
  box.replaceChildren();
  try {
    const snap = await getDocs(query(collection(db, "doctor_patient_conversations"), where("patientUid", "==", user.uid), limit(50)));
    if (snap.empty) box.append(el("p", "No doctor conversations yet."));
    snap.docs.forEach(item => {
      const data = item.data();
      const button = el("button", `${data.doctorDisplayName || "Doctor"} · ${data.status || "open"}`);
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
  const box = $("patient-message-thread");
  if (!box) return;
  box.replaceChildren();
  snapshot.docs.forEach(item => {
    const data = item.data();
    const card = el("article", "");
    card.className = "record";
    card.append(el("strong", data.senderUid === user?.uid ? "You" : "Doctor"));
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
  const text = $("patient-message-text").value.trim();
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
    $("patient-message-text").value = "";
    status("Message sent.");
  } catch (error) {
    status(`Message not sent: ${error.code || error.message}.`, true);
  }
}
$("patient-message-start")?.addEventListener("click", startConversation);
$("patient-message-form")?.addEventListener("submit", sendMessage);
onAuthStateChanged(auth, async current => {
  user = current;
  if (!user) return;
  if ($("patient-message-doctor")) {
    await loadVerifiedDoctors();
    await loadConversations();
  }
});
