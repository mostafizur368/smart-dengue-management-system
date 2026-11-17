SMART DENGUE MANAGEMENT SYSTEM
BATCHES 22–28 — FEATURES 2–8 IMPLEMENTATION PACKAGE

Feature 1 (MFA) is deferred to Batch 29 as requested. Existing Task 86 Firebase SMS MFA code was preserved unchanged.

INCLUDED IMPLEMENTATIONS
22. Firebase App Check client bootstrap (reCAPTCHA v3; site key placeholder)
23. Backup and Disaster Recovery (v2 checksums, backup status, Admin verify/manual backup, safe staging restore CLI)
24. Patient Privacy & Consent Center (optional chatbot analytics opt-in/out, consent history, export/delete)
25. API Rate Limiting (Express per-process limits, Cloud Functions quotas, CORS allowlist, security headers)
26. System Health Monitoring (15-minute Firebase probes, Render health endpoint, Admin dashboard)
27. Encryption & Key Management (versioned AES-GCM archive metadata and passphrase rotation)
28. Security Incident Response (Admin incident management, immutable events, automated health/backup incidents)

IMPORTANT DEPLOYMENT NOTES
- This ZIP contains source code only. It does not change your live Firebase or Render deployment.
- App Check is NOT active until a reCAPTCHA v3 site key is added to:
    assets/js/firebase-app-check-config.js
  and App Check is registered in Firebase Console.
- Do not set ENFORCE_APP_CHECK=true until the frontend site key is configured and all production pages have valid App Check tokens.
- Firebase Rules, Cloud Functions and Render environment variables must be deployed/configured separately.
- Firebase Emulator Rules tests were not run because Firebase CLI is not installed in the build environment.
- The restore utility is dry-run by default and blocks production targets. It only allows a separate project ending in -staging or -test.
- The Express limiter is per process. Use a shared Redis/edge limiter if you scale to multiple Render instances.

TEST COMMANDS (run from project root)
    npm run test:batch22-28
    npm run test:task73-92
    npm run audit:release
    npm run test:task93-98
    cd functions
    npm install
    npm run lint

GITHUB WEB UPLOAD
1. Create branch: feature/batches-22-28-security-reliability
2. Extract the Changed Files ZIP and upload/replace files using their original folder paths.
3. Review the diff and create a Pull Request.
4. Merge only after review and staging checks.
5. Deploy Firestore Rules and Functions only after Emulator tests and configuration review.
