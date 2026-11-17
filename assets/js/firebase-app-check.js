import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-check.js";
import { FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY } from "./firebase-app-check-config.js";

const initializedApps = new WeakMap();

export function initializeAppCheckIfConfigured(app) {
  if (!app) return { enabled: false, reason: "firebase-app-missing" };
  if (initializedApps.has(app)) return initializedApps.get(app);

  const siteKey = String(
    window.SMART_DENGUE_APPCHECK_SITE_KEY || FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY || ""
  ).trim();

  if (!siteKey) {
    const result = { enabled: false, reason: "site-key-not-configured" };
    initializedApps.set(app, result);
    return result;
  }

  try {
    const instance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
    const result = { enabled: true, instance };
    initializedApps.set(app, result);
    window.dispatchEvent(new CustomEvent("smart-dengue:app-check-status", {
      detail: { enabled: true }
    }));
    return result;
  } catch (error) {
    const result = { enabled: false, reason: error?.code || "initialization-failed" };
    initializedApps.set(app, result);
    console.warn("Firebase App Check was not initialized:", error?.code || error?.message || error);
    window.dispatchEvent(new CustomEvent("smart-dengue:app-check-status", {
      detail: { enabled: false, reason: result.reason }
    }));
    return result;
  }
}
