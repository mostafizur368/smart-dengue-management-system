# Batches 22–28 — Advanced Security, Privacy & Reliability

**Scope:** Implement Features 2–8 from the approved feature list. Feature 1 (MFA) is deliberately deferred to Batch 29. Existing Task 86 Firebase SMS MFA remains in the project and was not redesigned here.

## Implementation map

| Batch | Feature | Main implementation |
|---|---|---|
| 22 | Firebase App Check | Optional reCAPTCHA v3 client bootstrap; callable enforcement is environment-gated |
| 23 | Backup & Disaster Recovery | SHA-256 backup manifests, backup run status, Admin verification, safe staging restore CLI |
| 24 | Patient Privacy & Consent | Patient opt-in/out for optional chatbot question analytics; append-only consent history |
| 25 | API Rate Limiting | Express API throttling, security headers, CORS origin allowlist, callable per-Admin quotas |
| 26 | System Health Monitoring | 15-minute Firestore/Storage probes, web health endpoint, Admin health panel |
| 27 | Encryption & Key Management | Versioned AES-GCM archive metadata and client-side passphrase rotation |
| 28 | Incident Response | Admin incident create/list/status workflow, immutable incident events, automated health/backup incidents |
| 29 | MFA | Deferred by request; existing Task 86 SMS MFA remains unchanged |

## Important deployment gates

This package is source implementation only. App Check enforcement, Cloud Functions schedules, Firestore Rules, Cloud Storage backup and Render environment settings require separate configuration and deployment.

### App Check setup
1. Create a reCAPTCHA v3 site key for the production web domain.
2. Register the web app in Firebase Console → App Check.
3. Add the public site key to `assets/js/firebase-app-check-config.js`.
4. Deploy frontend and Functions.
5. Test valid traffic and monitor App Check metrics.
6. Only after verification, set `ENFORCE_APP_CHECK=true` in the Functions environment and redeploy callable Functions.
7. Enable Firestore App Check enforcement in Firebase Console only after monitoring confirms all production clients send valid tokens.

Do not turn on enforcement while the site key is blank.

### Backup / recovery setup
- Use a private Cloud Storage bucket and set `BACKUP_BUCKET` to its bucket name in the Functions environment.
- Deploy `scheduledFirestoreBackup`.
- Deploy `getBackupOverview` and `verifyBackupRun`.
- Check backup run history in Admin → Reliability & Data Protection Center.
- New backups use schema v2 with SHA-256 per object.
- The restore CLI is dry-run by default and only permits targets ending in `-staging` or `-test`. It refuses to overwrite existing documents.
- Use a service account with read access to the source backup bucket and write access to the separate staging Firestore project.
- Do not use the restore script against the production project.
- Configure a Cloud Storage lifecycle rule only after deciding the required retention period and verifying recovery requirements.

### Privacy / consent
- Optional chatbot question analytics is off by default for signed-in users.
- Raw chatbot question events are recorded only after the patient opts in.
- Explicit feedback remains stored when the user deliberately submits it.
- Withdrawal stops future optional question-event collection; it does not automatically erase historical records.
- Existing Task 92 export/deletion now includes consent history and privacy preferences.

### Rate limiting
- Express rate limits are in-memory per server process and reset on restart. They are a first-line abuse control, not a distributed/global limit.
- For multiple Render instances, add a shared Redis/edge rate limiter or platform-level protection.
- Set `ALLOWED_ORIGINS` in Render only if the frontend must call the API from a different origin; comma-separate exact origins. Same-origin website requests do not need CORS.
- Set `TRUST_PROXY=1` on Render so Express uses the platform-provided client IP for process-local limits.
- Cloud Functions admin operations have per-UID Firestore quotas.

### System health
- `scheduledSystemHealthProbe` runs every 15 minutes in `asia-south1`.
- It checks Firestore Admin connectivity and the configured Storage bucket.
- It records one health sample per run and raises an incident on a transition into degraded state.
- Configure Firestore TTL for `system_health_checks.expiresAt` (90 days) and `operations_rate_limits.expiresAt` (24 hours), if TTL cleanup is desired.
- Scheduled Functions / Cloud Scheduler may require the Blaze billing plan.

### Encryption / key management
- Existing AES-GCM-256 + PBKDF2-SHA-256 encrypted archive format v1 remains decryptable.
- New archive writes use format v2 and a monotonically increasing `keyVersion`.
- Key rotation happens in the patient's browser: current passphrase decrypts, new passphrase re-encrypts, and Firestore receives only ciphertext.
- The passphrase is never uploaded or stored by the app. There is no server-side key escrow or recovery.
- The offline IndexedDB archive is separate and must be saved again if the patient wants to rotate its passphrase too.
- This does not encrypt every ordinary Firestore health record at the application layer.

### Incident response
- Admins can create and update incidents in the new Security Incident Response panel.
- Incident descriptions must not contain patient names, phone numbers, passwords, OTPs, Firebase tokens or medical details.
- Automated incident records are indicators for investigation, not proof of compromise.
- Incident data is written by trusted Cloud Functions; browser clients have read-only Admin-gated access.

## Required test and deploy sequence

```bash
npm run test:batch22-28
npm run test:task73-92
npm run audit:release
cd functions
npm install
npm run lint
cd ..
```

Then:
1. Run Firestore Rules tests in the Firebase Emulator.
2. Test patient consent opt-in/out and verify no future chatbot query event is created after opt-out.
3. Test key rotation with a test account; old passphrase must fail for the new cloud archive and new passphrase must succeed.
4. Deploy Functions to a staging project.
5. Run one scheduled/manual backup and verify its SHA-256 manifest.
6. Run restore CLI in dry-run mode against a blank staging/test project.
7. Test Admin health and incident screens with an Admin account; test denial with Patient and Doctor accounts.
8. Test rate-limit 429 responses and same-origin website functionality.
9. Only after all staging checks pass, review production deployment.

## Known limits

- App Check remains unconfigured until a reCAPTCHA v3 site key is added and Console enforcement is deliberately enabled.
- No production Firebase or Render deployment is performed by this source package.
- In-memory Express rate limiting is not shared across instances.
- The backup restore CLI only supports schema v2 backups and only targets a separate staging/test project.
- Health monitoring is periodic, not a guarantee of continuous uptime or external synthetic monitoring.
- Key rotation applies to the encrypted archive, not all live patient records or the offline copy.
