# Task 97 — Suspicious Activity Monitoring

## Implemented heuristic signals

1. Five or more recently active registered sessions on one account create a medium-severity review alert.
2. Three or more client-reported role-mismatch signals for one account within 15 minutes create a high-severity review alert.
3. More than 12 security signals in a one-minute user window are rate-limited and create a high-severity event-rate alert.
4. Alerts are de-duplicated into 15-minute buckets to avoid uncontrolled repeated alert documents.

## Important interpretation

These are review signals, not an intrusion-detection guarantee and not proof that an account was compromised. Legitimate multi-device use, stale browser tabs, permission misconfiguration or client bugs can create signals. Admins must investigate before taking action.

## Not included

The project does not attempt to capture unauthenticated password failures through a client-callable endpoint. Use Firebase Authentication's own monitoring and provider-side abuse controls for failed sign-in analysis.
