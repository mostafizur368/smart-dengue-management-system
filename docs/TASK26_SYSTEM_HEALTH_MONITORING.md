# Batch 26 — System Health Monitoring

- Express `/api/health` returns a minimal server status, uptime and timestamp.
- `scheduledSystemHealthProbe` runs every 15 minutes in `asia-south1`.
- Probe checks Firestore Admin connectivity and the configured Cloud Storage bucket.
- Samples are written to `system_health_checks`; Admin callable returns live and recent checks.
- A transition from healthy to degraded creates a security incident.

This is periodic internal monitoring, not continuous uptime monitoring or an external synthetic check. Configure Firestore TTL on `expiresAt` if automatic cleanup is required.
