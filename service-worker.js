const CACHE_NAME = "smart-dengue-shell-v4-chatbot-ui";
const APP_SHELL_PATHS = [
  "index.html",
  "user-dashboard.html",
  "login.html",
  "register.html",
  "style.css",
  "assets/css/style.css",
  "assets/js/script.js",
  "assets/js/doctors.js",
  "assets/js/dengue-questions.js",
  "assets/js/dengue-search.js",
  "assets/js/patient-dashboard.js",
  "assets/js/patient-intelligence.js",
  "assets/js/patient-care-services.js",
  "assets/js/patient-messaging.js",
  "assets/js/patient-security-data.js",
  "assets/js/doctor-portal.js",
  "assets/js/doctor-messaging.js",
  "assets/js/admin-operations.js",
  "assets/js/pwa-register.js",
  "assets/js/offline-records-viewer.js",
  "assets/images/pwa-icon-192.png",
  "assets/images/pwa-icon-512.png",
  "manifest.webmanifest",
  "offline.html"
];
const BASE_URL = new URL("./", self.registration.scope);
const APP_SHELL = APP_SHELL_PATHS.map(path => new URL(path, BASE_URL).href);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (/firestore|googleapis|identitytoolkit|securetoken|firebaseapp|tesseract/i.test(url.hostname + url.pathname)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(new URL("offline.html", BASE_URL).href))));
    return;
  }
  if (/\.(?:js|css|svg|png|jpg|jpeg|webp|webmanifest)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || network;
    }));
  }
});
