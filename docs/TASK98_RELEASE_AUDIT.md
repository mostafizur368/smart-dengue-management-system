# Task 98 — Security Dashboard & Release Audit

## Implemented

- Admin Security Operations Center section with counts for open alerts, active session records and recent events.
- Recent alert review/resolution control.
- Recent active session table with an Admin action to revoke refresh tokens for a target user.
- Recent security event table.
- Server-side Admin authorization is enforced in each privileged callable by reading `users/{uid}.role`; the browser UI is not the authorization boundary.
- Static release tests verify the Firestore Rules, server functions, client integration, role checks and UI wiring.

## Deployment checklist

1. Back up the current deployed Firestore Rules.
2. Run Firebase Emulator Rules tests with the full `firestore.rules` file.
3. Install Functions dependencies from `functions/` and run `npm run lint`.
4. Deploy Firestore Rules and the nine Batch 11 callable functions.
5. Verify Cloud Functions logs and test user self-session listing/revocation.
6. Test Admin overview as Admin and confirm non-Admin callable requests receive `permission-denied`.
7. Test public contact/symptom forms, appointment booking, ticket-capacity contention, doctor status update and patient cancellation.
8. Confirm token-revocation behaviour on a second browser/device; remember existing ID tokens may persist until expiry.
9. Run all repository regression scripts and a manual browser smoke test.
10. Only after those checks, deploy the website to Render.

## Automated test boundary

The included Node checks are static/repository tests. They do not emulate Firestore Rules or prove a live Firebase deployment is secure. The Firebase Emulator suite and real browser/device checks remain mandatory.
