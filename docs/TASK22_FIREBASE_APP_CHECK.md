# Batch 22 — Firebase App Check

- Added `assets/js/firebase-app-check-config.js` for the public reCAPTCHA v3 site key.
- Added `assets/js/firebase-app-check.js` to initialize App Check once per Firebase app when a site key exists.
- Added initialization to browser Firebase entry points and inline Login, Register, Admin and Doctor modules.
- Callable Cloud Functions use `ENFORCE_APP_CHECK=true` as an opt-in enforcement switch.

## Required Console work
Create/register the reCAPTCHA v3 key and web app in Firebase Console. Add the key to the config file, deploy, monitor App Check metrics, then enable enforcement. Do not enable enforcement while the key is blank or before testing all production pages.
