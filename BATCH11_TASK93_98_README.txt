SMART DENGUE MANAGEMENT SYSTEM — BATCH 11 (TASKS 93–98)

This is the complete updated project source for Batch 11.

Implemented:
- Task 93: Security architecture audit and findings documentation.
- Task 94: Firestore role/field hardening, doctor-role checks, and atomic appointment/ticket binding.
- Task 95: Server-side append-only security event logging.
- Task 96: Browser session registration, heartbeat, listing, current-device sign-out and all-device refresh-token revocation.
- Task 97: Rate-limited suspicious-activity signals and review alerts.
- Task 98: Admin Security Operations Center, static tests and deployment guide.

Important:
- No production Firebase Rules, Cloud Functions or Render deployment was performed.
- Deploy the Rules and Functions to a staging Firebase project first.
- Refresh-token revocation does not instantly invalidate already-issued ID tokens; this limitation is documented in the UI and docs.
- The included Node checks are static tests, not a Firebase Emulator test or penetration test.

Run from the project root:
  npm run test:task93-98
  npm run audit:release
  npm run test:task73-92
  npm run test:chatbot-ui

Run Functions syntax checks:
  cd functions
  npm install
  npm run lint

Read docs/BATCH11_GITHUB_UPLOAD_AND_DEPLOY.md before uploading/deploying.
