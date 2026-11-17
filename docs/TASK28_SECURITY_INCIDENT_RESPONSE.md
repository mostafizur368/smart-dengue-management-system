# Batch 28 — Security Incident Response

Admin Security Operations Center now includes an Incident Response workflow:
- Create incident with category, severity, title and description.
- List recent incidents and event history.
- Move incidents through open, triaged, investigating, resolved or closed.
- Record append-only incident events.
- Scheduled health probe and backup failures can create automated incidents.

Cloud Functions verify the Admin role server-side and write incident records. Firestore client writes are denied. Do not put patient identifiers, medical information, passwords, OTPs or tokens into incident descriptions.
