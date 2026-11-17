# Task 93 — Security Architecture Audit

**Project:** Smart Dengue Management System  
**Source:** `dengue-project-v2(1).zip` uploaded by the project owner  
**Audit scope:** Firebase deployment configuration, Firestore Rules, booking transaction, Cloud Functions, browser authentication entry points and existing release checks.

## Audit result

The uploaded source contains a cumulative Firestore Rules file. `firebase.json` identifies root `firestore.rules` as the Firebase CLI deploy target, and `firestore_rules_current.txt` is maintained as its review copy. The source has 34 Firestore match blocks before Batch 11 changes.

### Positive controls observed

- Patient-owned health records are UID-scoped.
- Doctor schedule updates are restricted to the matching doctor UID and schedule fields.
- Doctor–patient conversation creation checks participant UIDs and the approved/verified doctor profile.
- Conversation messages are participant-only and immutable after creation.
- Patient encrypted vault records are owner-scoped.
- Admin and doctor activity logs are append-only in the Rules.
- Ticket capacity updates already increment by one and preserve the configured total.
- Daily Firestore backup is implemented as a scheduled Cloud Function source; it requires deployment and restore testing.

### Risks carried into Task 94

1. Appointment creation originally checked ownership but did not validate a strict document field allowlist, field types or initial status.
2. Anonymous contact and symptom submissions were intentionally open, but their Rules had no field-level schema bounds.
3. Ticket counter writes were not cryptographically/transactionally bound by Rules to a newly created matching appointment document.
4. CORS in the current Express static server is permissive. The inspected server does not expose a privileged data API, so this is a hardening item rather than proof of an active exploit.
5. Doctor application submission is Admin-only in the current Rules. This remains unchanged because the intended self-service application flow was not established by the inspected code.

## Audit boundary

This is a source-based static architecture audit. It is not a penetration test, live Firebase Console review, Firebase Emulator Rules test, MFA test, or production deployment certification. See `TASK94_ROLE_PERMISSION_HARDENING.md` through `TASK98_RELEASE_AUDIT.md` for changes and remaining deployment gates.
