# Task 95 — Security Event Logging

## Implemented

Trusted Cloud Functions create append-only `security_events` for session start/end, all-session revocation, Admin revocation, alert resolution and approved client-reported security signals. Client input is allowlisted and bounded; logs store a UID, event type, severity, short summary, session reference and limited route/error metadata.

## Privacy safeguards

- Do not log passwords, OTPs, Firebase ID tokens, raw request bodies, full patient records, symptom narratives or lab results.
- Device labels are coarse browser/platform descriptions, not full browser fingerprints.
- Security event writes are performed by Firebase Admin SDK; browser clients cannot create, update or delete the event collection.
- Event records are readable by the affected account and Admin according to Firestore Rules.

## Limits

A client-reported permission/role signal is not proof of an attack. Unauthenticated failed login attempts are not recorded by this callable; use Firebase Authentication monitoring/audit facilities for provider-side sign-in abuse analysis.
