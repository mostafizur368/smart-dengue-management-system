# Batch 11 — Tasks 93–98 Security Foundation

| Task | Feature | Status in this source package |
|---|---|---|
| 93 | Security architecture audit | Source audit documented |
| 94 | Role-based permission hardening | Rules and appointment transaction updated |
| 95 | Security event logging | Callable Functions and append-only collections added |
| 96 | Session management | Browser session registration, heartbeat, listing and revocation controls added |
| 97 | Suspicious activity monitoring | Bounded heuristic signals and Admin alerts added |
| 98 | Security dashboard and release audit | Admin dashboard, static tests and deployment checklist added |

## New Cloud Functions

- `registerSecuritySession`
- `heartbeatSecuritySession`
- `endSecuritySession`
- `listMySecuritySessions`
- `revokeMySecuritySessions`
- `recordSecuritySignal`
- `getSecurityOverview`
- `resolveSecurityAlert`
- `revokeUserSecuritySessions`

All callable functions are configured for `asia-south1`. They verify Firebase ID tokens with revocation checking. Admin-only functions read the authoritative `users/{uid}.role` profile on the server.

## New Firestore collections

- `security_sessions`
- `security_events`
- `security_alerts`
- `security_rate_limits`

The first three are client read-only as permitted by owner/Admin role; all writes are from trusted Cloud Functions. Rate-limit documents are not client-accessible.

## Important operational note

No production Firebase Rules, Cloud Functions or Render deployment was performed by creating this package. Deploy and test these components in a development/staging Firebase project first. Cloud Functions deployment may require the Blaze billing plan and suitable service-account permissions.
