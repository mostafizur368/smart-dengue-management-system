# Tasks 73–92 — Development, Security & Deployment Guide

This cumulative release starts from Task 1–72 and adds the implementation for Tasks 73–92.

## Feature map

| Task | Feature | Implementation |
|---|---|---|
| 73 | Doctor Verification | Existing Admin BMDC registration review and explicit verification/revocation flow retained |
| 74 | Doctor Availability Calendar | Doctor can save weekly availability in their own public profile; Admin schedule page retained |
| 75 | Online Appointment Booking | Existing appointment booking and ticket flow retained |
| 76 | Hospital Directory | Admin-maintained public hospital directory with address, phone, optional coordinates and emergency-services flag |
| 77 | Emergency Hospital Locator | Browser geolocation + Haversine distance ranking of listed hospitals; Google Maps search fallback |
| 78 | Secure Doctor–Patient Messaging | Participant-only conversation documents and immutable messages |
| 79 | Patient Analytics | Bounded Admin counts for patient, doctor and appointment samples |
| 80 | Dengue Case Statistics | Symptom-check risk distribution; explicitly not confirmed dengue cases |
| 81 | Chatbot Question Analytics | Existing chatbot analytics retained and summarized in the new Admin panel |
| 82 | Most Asked 100 Questions | Top 100 normalized chatbot questions from available query-event sample |
| 83 | Unanswered Question Detection | Unmatched and low-score query review queue |
| 84 | Admin Knowledge Base Editor | Existing Admin Knowledge Management / Question Bank editor retained |
| 85 | Doctor Activity Monitoring | Append-only doctor activity events for dashboard sessions, availability and appointment status changes |
| 86 | Two-Factor Authentication | Firebase Phone MFA enrollment/removal and SMS MFA sign-in challenge |
| 87 | Patient Data Encryption | Client-side AES-GCM-256 encrypted archive using PBKDF2-SHA-256; only ciphertext stored in Firestore vault |
| 88 | Audit Log System | Existing append-only Admin activity log retained; doctor activity log added |
| 89 | Automatic Database Backup | Daily scheduled Cloud Function source added; deployment is required before backups run |
| 90 | Progressive Web App | Web manifest, service worker, install icons and offline shell |
| 91 | Offline Health Records | User-triggered encrypted IndexedDB copy; standalone offline unlock page |
| 92 | Data Export & Account Deletion | Patient JSON export and re-authenticated deletion of supported UID-linked records |

## Important implementation boundaries

- Tasks 73, 75, 81, 84 and 88 build on existing project features rather than replacing them.
- Task 80 aggregates anonymous symptom-check risk labels. These are not clinically confirmed dengue cases.
- Task 77 uses browser location only after the user clicks the locator. The nearest result is straight-line distance, not road travel time or an emergency-service guarantee.
- Task 78 only allows a patient to start a conversation with a doctor whose public profile is approved and explicitly BMDC-verified in the existing Admin workflow. Messages are not end-to-end encrypted; Admin access is possible under the Firestore rules. They are not an emergency channel.
- Task 86 uses Firebase Phone MFA. Enable Phone Authentication and Multi-factor Authentication in Firebase Console, add the deployed domain to Authorized domains, and review SMS billing/quotas before enabling it for users.
- Task 87 encrypts a user-triggered archive. It does not retroactively encrypt every existing Firestore record at the application layer. The passphrase is never stored; losing it means the encrypted archive cannot be recovered.
- Task 89 is source code only until Cloud Functions are deployed. Scheduled backups require the Blaze billing plan, Cloud Scheduler/Functions support, a working Storage bucket, and suitable service-account permissions.
- Task 90/91 require HTTPS for installability and WebCrypto. Offline mode caches the static app shell only; Firebase services, live messages, appointments and hospital status require internet. The encrypted offline archive is saved by the user and is not background-synced.
- Task 92 deletes records the application can reliably associate with the signed-in UID. Older anonymous symptom-check/contact records without a UID cannot be identified. Any existing appointment record blocks deletion until Admin cancels/removes it and reconciles ticket capacity. Account deletion requires recent email/password authentication; MFA-enabled accounts may need a fresh MFA sign-in first.

## Firebase Console configuration

### 1. Firestore Rules
The complete cumulative rules are in both:
- `firestore.rules` (Firebase CLI deployment target)
- `firestore_rules_current.txt` (review/copy reference)

Back up the currently deployed rules first. This file is the complete merged rule set for Tasks 1–92; review it in Firebase Rules Playground/Emulator before publishing. Do not paste only the new blocks over the existing rules.

New collections:
- `public_hospitals`
- `doctor_activity_logs`
- `doctor_patient_conversations` and its `messages` subcollection
- `patient_secure_vault`

Existing `public_doctors` rules now permit the matching doctor UID to update only their schedule fields. Patient deletion is permitted only for the user's own `role == "user"` profile and eligible non-active appointments. Users can read/delete only their own chatbot query/feedback events for data export/deletion.

### 2. Firebase Authentication MFA
In Firebase Console:
1. Authentication → Sign-in method → enable Phone.
2. Authentication → Multi-factor → enable SMS MFA.
3. Add your production and test domains under Authorized domains.
4. Test with Firebase test phone numbers before real SMS.
5. Review SMS pricing, quotas and abuse protections.

### 3. Scheduled backups (Task 89)
The deployable function is in `functions/index.js`.
1. Ensure the project is on the Blaze plan.
2. Ensure the default Firebase Storage bucket exists and is private, or set `BACKUP_BUCKET` to a dedicated private bucket.
3. Give the Cloud Functions runtime service account Firestore read access and Storage object create access. If applying lifecycle cleanup, use a Storage lifecycle rule rather than broad delete permissions.
4. From the project root, run:
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions:scheduledFirestoreBackup
   ```
5. Confirm the first successful execution in Firebase Functions logs and verify the private object prefix `smart-dengue-firestore-backups/`.
6. Configure a Storage lifecycle rule (for example, delete backup objects older than 30 days) only after confirming retention requirements.

The function is scheduled daily at 02:00 Asia/Dhaka. It exports top-level collections and nested subcollections to private JSON files, then writes a manifest. A restore test is still required before treating the backup as disaster recovery.

### 4. PWA
- Serve over HTTPS (or localhost for development).
- Service worker scope is calculated from the PWA registration script path to support root hosting and GitHub Pages project subpaths.
- After deploying a new release, users may need one reload for the new service worker cache to activate.
- The service worker does not cache Firebase API responses or patient data.

## Suggested test commands

```bash
npm run test:task73-92
npm run audit:release
npm run test:full
```

Also run:
```bash
cd functions
npm install
npm run lint
```

## Required manual verification before production

1. Test doctor schedule update as Doctor A and confirm Doctor B cannot edit Doctor A's schedule.
2. Test hospital directory with valid and invalid coordinates; deny location permission and verify the fallback message.
3. Start a conversation with a verified doctor; test read/write as Patient, assigned Doctor, unrelated Patient and Admin.
4. Verify Admin analytics use bounded samples and clearly label symptom-check risk as unconfirmed.
5. Enroll and sign in with a Firebase test phone number; verify MFA challenge and unenrollment.
6. Encrypt an archive with a test passphrase; confirm Firestore contains ciphertext only; test wrong and correct passphrases.
7. Save an encrypted offline copy, disconnect network, open `offline.html`, and unlock using the same email/passphrase.
8. Export account data; test deletion with pending appointments, then test that accepted appointments block deletion.
9. Deploy the scheduled backup function only after reviewing billing and bucket access; verify logs and test restoring to a separate test project.
10. Test PWA installation and offline shell on a real HTTPS deployment.

Automated static tests do not replace Firebase Emulator Rules tests, browser tests, MFA SMS tests, backup restore drills, or clinical review.


## Validation run for this cumulative package
- Task 17: 15/15
- Task 18–28: 21/21
- Task 29–39: 42/42
- Task 40–53: 54/54
- Task 54–58: 25/25
- Task 59–62: 28/28
- Task 63–67: 23/23
- Task 68–72: 31/31
- Task 73–92: 25/25
- Release audit: 43/43
- Changed JS/inline module syntax: 18/18
- HTML duplicate-ID/local-script checks and Firestore Rules brace-balance check: passed

These are repository-level automated/static checks. They do not simulate a live Firebase project or replace the manual deployment tests above.


## Post-package chatbot UI refinement

Chatbot UI refinement (post Task 1–92 package)
- Moved chat history, voice settings, privacy notice, language hint and question suggestion into one compact, collapsed-by-default Chat Settings panel.
- Kept the original controls and element IDs so existing JavaScript behavior remains connected.
- Kept the message composer visible at the bottom and allowed the answer area to use the available height.
- Starter questions now wrap without a horizontal scrollbar and disappear after the first user message; they return after clearing the visible chat.
- Chat auto-scroll is scheduled after the browser renders the newly added answer and related safety/quality content.
- Added responsive styles for narrow screens and moved empty voice-status text out of the layout.
- Bumped the PWA shell cache to v3-chatbot-ui so the updated UI is fetched after deployment.
- Firebase configuration and Firestore Rules were not changed in this UI refinement.
- UI layout checks: 15/15; Task 73–92 regression: 25/25; release audit: 43/43; Task 40–53 regression: 54/54; Task 68–72 regression: 31/31. JavaScript syntax and HTML duplicate-ID checks passed.


## Chatbot UI refinement v2

Chatbot UI refinement v2 (after user screenshot review)
- Starter suggestions now use a responsive two-column grid (single column on very narrow screens), with horizontal overflow explicitly disabled.
- Starter suggestions are hidden using both the HTML hidden state and an important inline display rule after the first user message; they reappear when the visible chat is cleared.
- Removed the extra "History · Voice" hint from the Settings summary to prevent crowding; all history and voice controls remain inside the disclosure panel.
- Suppressed the browser's native disclosure marker and retained a clear plus/minus affordance.
- Chat auto-scroll now waits two animation frames so answer feedback, citations and suggested follow-ups are included in the final scroll height.
- Bumped PWA shell cache to v4-chatbot-ui.
- Firebase configuration and Firestore Rules remain unchanged.
- Validation: chatbot UI 15/15; Task 73–92 25/25; release audit 43/43. JS syntax and HTML duplicate-ID checks passed.
