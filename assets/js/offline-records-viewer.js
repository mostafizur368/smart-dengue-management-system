(() => {
  const $ = id => document.getElementById(id);
  const status = message => { $("offline-viewer-status").textContent = message; };
  const bytesToBase64 = bytes => {
    let binary = "";
    new Uint8Array(bytes).forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };
  const base64ToBytes = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  async function accountKey(email) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(email || "").trim().toLowerCase()));
    return bytesToBase64(digest);
  }
  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("smart-dengue-offline-v1", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("archives", { keyPath: "uid" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function readArchive(key) {
    const db = await openDb();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction("archives", "readonly");
      const request = tx.objectStore("archives").get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return record;
  }
  async function unlock() {
    try {
      if (!crypto?.subtle) throw new Error("WebCrypto is unavailable. Use a secure HTTPS connection.");
      const email = $("offline-viewer-email").value.trim();
      const passphrase = $("offline-viewer-passphrase").value;
      if (!email || passphrase.length < 12) throw new Error("Enter the account email and the 12-character-or-longer passphrase.");
      const record = await readArchive(await accountKey(email));
      if (!record) throw new Error("No encrypted offline archive was found for this account on this device.");
      const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: base64ToBytes(record.salt), iterations: record.iterations, hash: "SHA-256" },
        material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
      );
      const clear = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(record.iv) }, key, base64ToBytes(record.ciphertext));
      const data = JSON.parse(new TextDecoder().decode(clear));
      $("offline-viewer-output").textContent = JSON.stringify(data, null, 2);
      $("offline-viewer-output").hidden = false;
      status(`Encrypted offline archive unlocked. Saved ${record.savedAt || "date unknown"}. This data is displayed only in this browser tab.`);
    } catch (error) {
      status(`Could not unlock offline archive: ${error.message || error}`);
    }
  }
  $("offline-viewer-unlock")?.addEventListener("click", unlock);
})();
