# Task 96 — Session Management

## Implemented

- Login, registration and authenticated home/patient/doctor/Admin pages attempt to register a browser session through a callable Cloud Function.
- A random per-tab session ID is stored in `sessionStorage`; server records include a coarse device label, created time, last heartbeat, active flag and end/revoke metadata.
- The active page sends a five-minute heartbeat.
- Patient, Doctor and Admin pages receive an account security panel with session listing, refresh, current-device sign-out and sign-out-all-devices controls.
- Users can read only their own session records; Admin can read all records. All writes are server-side.

## Token revocation limitation

`revokeRefreshTokens(uid)` revokes refresh tokens. It does **not** instantly invalidate an ID token already issued to a browser; that token can remain usable until it expires unless a protected backend verifies revocation. The callable endpoints in this package do verify revocation. Direct Firestore SDK access continues to be governed by Firestore Rules and the lifetime of the already-issued ID token. The UI and documentation explicitly disclose this limitation.

## Deployment dependency

Session controls become active only after the Batch 11 callable Cloud Functions are deployed. If they are not deployed, the website continues to work and the panel reports that the service is unavailable.
