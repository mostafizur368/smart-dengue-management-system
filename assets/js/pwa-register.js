(() => {
  if (!("serviceWorker" in navigator)) return;
  const scriptUrl = document.currentScript?.src || new URL("assets/js/pwa-register.js", document.baseURI).href;
  const rootUrl = new URL("../../", scriptUrl);
  const workerUrl = new URL("service-worker.js", rootUrl);
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(workerUrl.href, { scope: rootUrl.pathname })
      .then(registration => console.info("Smart Dengue offline shell ready:", registration.scope))
      .catch(error => console.warn("PWA registration failed:", error));
  });
})();
