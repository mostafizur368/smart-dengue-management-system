# Batch 11 — GitHub Upload & Deployment Guide

## 1. Upload to GitHub Web

1. Extract the updated Batch 11 ZIP on your computer.
2. Open the repository `smart-dengue-management-system` on GitHub.
3. Switch to a new branch named `feature/tasks-93-98-security-foundation` (or create it from `main`).
4. Use **Add file → Upload files** and upload the updated project files, preserving their folder paths.
5. Commit to the feature branch, not directly to `main`.
6. Open a Pull Request and review the Rules, Cloud Functions and dashboard changes before merging.

Do not upload only `firestore.rules`. The booking transaction, Cloud Functions, browser modules, Admin UI, tests and docs are connected parts of this Batch.

## 2. Local checks

From the project root:

```bash
npm run test:task93-98
npm run audit:release
npm run test:task73-92
npm run test:chatbot-ui
```

For Cloud Functions source syntax:

```bash
cd functions
npm install
npm run lint
cd ..
```

## 3. Firebase deployment — only after staging tests

Before deploying, export/backup the currently deployed Firestore Rules. Test the full Rules file in Firebase Emulator or a separate staging Firebase project. Verify booking, concurrent ticket reservation, doctor status updates, patient cancellation, public contact form and public symptom checker.

The project uses Firebase project alias `smart-dengue-management-system`. Deploy the new Rules and callable functions only after confirming the active Firebase project and billing plan:

```bash
firebase use smart-dengue-management-system
firebase deploy --only firestore:rules,functions:registerSecuritySession,functions:heartbeatSecuritySession,functions:endSecuritySession,functions:listMySecuritySessions,functions:revokeMySecuritySessions,functions:recordSecuritySignal,functions:getSecurityOverview,functions:resolveSecurityAlert,functions:revokeUserSecuritySessions
```

Cloud Functions may require the Blaze plan and suitable service-account permissions. Review expected billing before deployment.

## 4. Render website deployment

After Firebase Rules and callable functions are verified in staging, merge the reviewed Pull Request into `main`. Render auto-deploy may then publish the website source. Confirm the Render deployment succeeded and manually test patient, doctor and Admin flows.

**No production deployment is performed by this ZIP.**
