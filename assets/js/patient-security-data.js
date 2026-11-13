import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, multiFactor, PhoneAuthProvider,
  PhoneMultiFactorGenerator, RecaptchaVerifier, getMultiFactorResolver, EmailAuthProvider,
  reauthenticateWithCredential, deleteUser
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, query, where, limit,
  setDoc, deleteDoc, serverTimestamp, writeBatch
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
let recaptchaVerifier = null;
let mfaVerificationId = null;

function setText(id, message, bad = false) {
  const node = $(id);
  if (node) { node.textContent = message; node.style.color = bad ? "#a32620" : "#60747b"; }
}
function bytesToBase64(bytes) {
  let binary = "";
  new Uint8Array(bytes).forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}
function randomBytes(size) {
  return crypto.getRandomValues(new Uint8Array(size));
}
async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptJson(value, passphrase) {
  if (passphrase.length < 12) throw new Error("Use a passphrase with at least 12 characters.");
  const salt = randomBytes(16), iv = randomBytes(12);
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    algorithm: "AES-GCM-256",
    kdf: "PBKDF2-SHA-256",
    iterations: 310000,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(encrypted)
  };
}
async function decryptJson(record, passphrase) {
  if (record.algorithm !== "AES-GCM-256" || record.kdf !== "PBKDF2-SHA-256" || record.iterations !== 310000) {
    throw new Error("Unsupported encrypted archive format.");
  }
  const key = await deriveKey(passphrase, base64ToBytes(record.salt));
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(record.iv) }, key, base64ToBytes(record.ciphertext));
  return JSON.parse(new TextDecoder().decode(plaintext));
}
function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function ownedRecords(name) {
  const snap = await getDocs(query(collection(db, name), where("userId", "==", currentUser.uid), limit(500)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() }));
}
async function collectExportData() {
  const names = ["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders", "patient_medications", "chatbot_query_events", "chatbot_feedback"];
  const [profile, history, ...collectionsData] = await Promise.all([
    getDoc(doc(db, "users", currentUser.uid)),
    getDoc(doc(db, "patient_medical_history", currentUser.uid)),
    ...names.map(ownedRecords)
  ]);
  const appointments = await ownedRecords("appointments");
  const conversationsSnap = await getDocs(query(collection(db, "doctor_patient_conversations"), where("patientUid", "==", currentUser.uid), limit(100)));
  const conversations = [];
  for (const conversation of conversationsSnap.docs) {
    const messageSnap = await getDocs(query(collection(db, "doctor_patient_conversations", conversation.id, "messages"), limit(500)));
    conversations.push({
      id: conversation.id,
      ...conversation.data(),
      messages: messageSnap.docs.map(item => ({ id: item.id, ...item.data() }))
    });
  }
  const namesMap = Object.fromEntries(names.map((name, index) => [name, collectionsData[index]]));
  return {
    exportType: "smart-dengue-patient-data",
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    account: profile.exists() ? profile.data() : { uid: currentUser.uid, email: currentUser.email },
    medicalHistory: history.exists() ? history.data() : null,
    ...namesMap,
    appointments,
    doctorConversations: conversations
  };
}

// ---------- Task 86: Firebase Phone Multi-Factor Authentication ----------
function renderMfaStatus() {
  const list = $("mfa-enrolled-list");
  if (!list || !currentUser) return;
  list.replaceChildren();
  const factors = multiFactor(currentUser).enrolledFactors;
  if (!factors.length) list.append(document.createTextNode("No second factor is enrolled."));
  factors.forEach(factor => {
    const row = document.createElement("div");
    row.className = "record";
    const label = document.createElement("span");
    label.textContent = `${factor.displayName || "Phone factor"} · ${factor.factorId === PhoneMultiFactorGenerator.FACTOR_ID ? "SMS" : "Other"} · ${factor.uid.slice(0, 8)}`;
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "danger"; remove.textContent = "Remove";
    remove.addEventListener("click", async () => {
      if (!confirm("Remove this second factor from your account? Your account will then rely on your primary sign-in method.")) return;
      try {
        await multiFactor(currentUser).unenroll(factor.uid);
        renderMfaStatus();
        setText("mfa-status", "Second factor removed.");
      } catch (error) { setText("mfa-status", `Could not remove factor: ${error.code || error.message}`, true); }
    });
    row.append(label, remove); list.append(row);
  });
}
async function beginMfaEnrollment() {
  if (currentUser && currentUser.email && !currentUser.emailVerified) {
    setText("mfa-status", "Verify your account email first, then reload this dashboard before enrolling SMS MFA.", true);
    return;
  }
  const phone = $("mfa-phone-number")?.value.trim();
  if (!currentUser || !phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
    setText("mfa-status", "Enter a phone number in international format, e.g. +8801XXXXXXXXX.", true);
    return;
  }
  try {
    if (recaptchaVerifier) { recaptchaVerifier.clear(); recaptchaVerifier = null; }
    recaptchaVerifier = new RecaptchaVerifier(auth, "mfa-recaptcha-container", { size: "normal" });
    const session = await multiFactor(currentUser).getSession();
    const provider = new PhoneAuthProvider(auth);
    mfaVerificationId = await provider.verifyPhoneNumber({ phoneNumber: phone, session }, recaptchaVerifier);
    $("mfa-code-row").hidden = false;
    setText("mfa-status", "SMS code sent. Enter the code to finish enrolling this second factor.");
  } catch (error) {
    setText("mfa-status", `Could not start MFA enrollment: ${error.code || error.message}. Enable Phone provider and MFA in Firebase Console first.`, true);
    if (recaptchaVerifier) { recaptchaVerifier.clear(); recaptchaVerifier = null; }
  }
}
async function finishMfaEnrollment() {
  const code = $("mfa-sms-code")?.value.trim();
  if (!mfaVerificationId || !code) { setText("mfa-status", "Enter the SMS verification code.", true); return; }
  try {
    const credential = PhoneAuthProvider.credential(mfaVerificationId, code);
    const assertion = PhoneMultiFactorGenerator.assertion(credential);
    await multiFactor(currentUser).enroll(assertion, "SMS phone");
    mfaVerificationId = null;
    $("mfa-code-row").hidden = true;
    $("mfa-sms-code").value = "";
    renderMfaStatus();
    setText("mfa-status", "Two-factor authentication is enrolled. Sign-in will require the SMS code.");
  } catch (error) {
    setText("mfa-status", `Could not verify code: ${error.code || error.message}`, true);
  }
}

// ---------- Task 87: client-side encrypted archive ----------
async function saveEncryptedVault() {
  const passphrase = $("vault-passphrase")?.value || "";
  if (!currentUser) return;
  try {
    const data = await collectExportData();
    const encrypted = await encryptJson(data, passphrase);
    const jsonSize = encrypted.ciphertext.length;
    if (jsonSize > 850000) throw new Error("Archive is too large for one Firestore document. Use the local encrypted download instead.");
    await setDoc(doc(db, "patient_secure_vault", currentUser.uid), {
      userId: currentUser.uid,
      ...encrypted,
      encryptedAt: serverTimestamp(),
      formatVersion: 1
    });
    setText("vault-status", "Encrypted archive saved. The passphrase is not stored; without it, the archive cannot be decrypted.");
  } catch (error) {
    setText("vault-status", `Encrypted archive not saved: ${error.code || error.message}`, true);
  }
}
async function restoreEncryptedVault() {
  const passphrase = $("vault-passphrase")?.value || "";
  try {
    const snap = await getDoc(doc(db, "patient_secure_vault", currentUser.uid));
    if (!snap.exists()) throw new Error("No encrypted archive exists for this account.");
    const data = await decryptJson(snap.data(), passphrase);
    downloadJson("smart-dengue-decrypted-health-archive.json", data);
    setText("vault-status", "Archive decrypted in this browser and downloaded. It was not written back to your records.");
  } catch (error) {
    setText("vault-status", `Could not decrypt archive: ${error.message || error.code}. Check your passphrase.`, true);
  }
}

// ---------- Task 91: encrypted IndexedDB offline copy ----------
function openOfflineDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("smart-dengue-offline-v1", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("archives", { keyPath: "uid" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function offlineAccountKey(email) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(email || "").trim().toLowerCase()));
  return bytesToBase64(digest);
}
async function putOfflineArchive(record) {
  const dbLocal = await openOfflineDb();
  await new Promise((resolve, reject) => {
    const tx = dbLocal.transaction("archives", "readwrite");
    tx.objectStore("archives").put(record);
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  });
  dbLocal.close();
}
async function getOfflineArchive(uid) {
  const dbLocal = await openOfflineDb();
  const value = await new Promise((resolve, reject) => {
    const tx = dbLocal.transaction("archives", "readonly");
    const request = tx.objectStore("archives").get(uid);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  dbLocal.close();
  return value;
}
async function saveOfflineCopy() {
  try {
    const passphrase = $("offline-passphrase")?.value || "";
    const data = await collectExportData();
    const encrypted = await encryptJson(data, passphrase);
    const accountKey = await offlineAccountKey(currentUser.email);
    await putOfflineArchive({ uid: accountKey, ...encrypted, savedAt: new Date().toISOString() });
    setText("offline-status", "Encrypted offline copy saved on this device only. Keep the passphrase safe.");
  } catch (error) { setText("offline-status", `Offline copy not saved: ${error.code || error.message}`, true); }
}
async function unlockOfflineCopy() {
  try {
    const passphrase = $("offline-passphrase")?.value || "";
    const accountKey = await offlineAccountKey($("offline-account-email")?.value || currentUser?.email);
    const record = await getOfflineArchive(accountKey);
    if (!record) throw new Error("No offline copy exists on this device.");
    const data = await decryptJson(record, passphrase);
    $("offline-preview").textContent = JSON.stringify(data, null, 2).slice(0, 12000);
    $("offline-preview").hidden = false;
    setText("offline-status", "Offline archive unlocked in this tab. Values are shown locally and are not uploaded.");
  } catch (error) { setText("offline-status", `Could not unlock offline copy: ${error.message}`, true); }
}
async function deleteOfflineCopy() {
  try {
    const accountKey = await offlineAccountKey($("offline-account-email")?.value || currentUser?.email);
    const dbLocal = await openOfflineDb();
    await new Promise((resolve, reject) => {
      const tx = dbLocal.transaction("archives", "readwrite");
      tx.objectStore("archives").delete(accountKey);
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    dbLocal.close();
    $("offline-preview").hidden = true;
    setText("offline-status", "This device's offline archive was deleted.");
  } catch (error) { setText("offline-status", `Could not delete offline copy: ${error.message}`, true); }
}

// ---------- Task 92: export and account deletion ----------
async function exportPatientData() {
  try {
    const data = await collectExportData();
    downloadJson("smart-dengue-personal-data-export.json", data);
    setText("data-export-status", "Your available account-linked data export has been downloaded.");
  } catch (error) { setText("data-export-status", `Export failed: ${error.code || error.message}`, true); }
}
async function deleteOwnedCollection(name, uid) {
  let deleted = 0;
  while (true) {
    const snap = await getDocs(query(collection(db, name), where("userId", "==", uid), limit(450)));
    if (snap.empty) break;
    const batch = writeBatch(db);
    snap.docs.forEach(item => batch.delete(item.ref));
    await batch.commit();
    deleted += snap.size;
    if (snap.size < 450) break;
  }
  return deleted;
}
async function reauthenticateForDeletion(password) {
  const credential = EmailAuthProvider.credential(currentUser.email, password);
  try {
    return await reauthenticateWithCredential(currentUser, credential);
  } catch (error) {
    if (error.code !== "auth/multi-factor-auth-required") throw error;
    const resolver = getMultiFactorResolver(auth, error);
    const phoneHint = resolver.hints.find(item => item.factorId === PhoneMultiFactorGenerator.FACTOR_ID);
    if (!phoneHint) throw new Error("This account uses a second factor that this deletion screen cannot verify.");
    const verifier = new RecaptchaVerifier(auth, "delete-mfa-recaptcha", { size: "normal" });
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        { multiFactorHint: phoneHint, session: resolver.session },
        verifier
      );
      const code = window.prompt("Enter the SMS verification code sent to your enrolled phone:");
      if (!code) throw new Error("SMS verification was cancelled.");
      const phoneCredential = PhoneAuthProvider.credential(verificationId, code.trim());
      const assertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
      return await resolver.resolveSignIn(assertion);
    } finally {
      verifier.clear();
    }
  }
}

async function deletePatientAccount() {
  const password = $("delete-account-password")?.value || "";
  const confirmation = $("delete-account-confirmation")?.value.trim() || "";
  if (!currentUser || !currentUser.email || !password || confirmation !== "DELETE") {
    setText("delete-account-status", "Enter your password and type DELETE exactly to confirm.", true);
    return;
  }
  if (!confirm("This permanently deletes your Firebase login and the account-linked records this app can identify. Export your data first. Continue?")) return;
  try {
    setText("delete-account-status", "Checking appointments and re-authenticating…");
    const appointments = await ownedRecords("appointments");
    if (appointments.length) {
      throw new Error("You still have appointment records. Ask Admin to cancel/remove them first so reserved ticket capacity is reconciled before account deletion.");
    }
    const reauthResult = await reauthenticateForDeletion(password);
    currentUser = reauthResult.user || auth.currentUser;

    const conversations = await getDocs(query(collection(db, "doctor_patient_conversations"), where("patientUid", "==", currentUser.uid), limit(100)));
    for (const conversation of conversations.docs) {
      const messages = await getDocs(query(collection(db, "doctor_patient_conversations", conversation.id, "messages"), limit(500)));
      for (let index = 0; index < messages.docs.length; index += 450) {
        const batch = writeBatch(db);
        messages.docs.slice(index, index + 450).forEach(item => batch.delete(item.ref));
        await batch.commit();
      }
      await deleteDoc(conversation.ref);
    }
    for (const name of ["symptom_logs", "blood_reports", "hydration_logs", "patient_reminders", "patient_medications", "chatbot_query_events", "chatbot_feedback"]) {
      await deleteOwnedCollection(name, currentUser.uid);
    }
    await deleteDoc(doc(db, "patient_medical_history", currentUser.uid));
    await deleteDoc(doc(db, "patient_secure_vault", currentUser.uid));
    await deleteOfflineCopy().catch(() => {});
    await deleteDoc(doc(db, "users", currentUser.uid));
    await deleteUser(currentUser);
    setText("delete-account-status", "Account deletion completed. Redirecting…");
    window.location.href = "index.html";
  } catch (error) {
    setText("delete-account-status", `Account was not fully deleted: ${error.code || error.message}. If MFA is enabled, complete the SMS challenge and retry.`, true);
  }
}

$("mfa-start-enrollment")?.addEventListener("click", beginMfaEnrollment);
$("mfa-finish-enrollment")?.addEventListener("click", finishMfaEnrollment);
$("vault-save")?.addEventListener("click", saveEncryptedVault);
$("vault-restore")?.addEventListener("click", restoreEncryptedVault);
$("offline-save")?.addEventListener("click", saveOfflineCopy);
$("offline-unlock")?.addEventListener("click", unlockOfflineCopy);
$("offline-delete")?.addEventListener("click", deleteOfflineCopy);
$("data-export-button")?.addEventListener("click", exportPatientData);
$("delete-account-button")?.addEventListener("click", deletePatientAccount);

onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user && $("mfa-enrolled-list")) renderMfaStatus();
  if (user && $("offline-account-email") && !$("offline-account-email").value) $("offline-account-email").value = user.email || "";
});
