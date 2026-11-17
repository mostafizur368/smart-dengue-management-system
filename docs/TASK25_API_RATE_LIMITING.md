# Batch 25 — API Rate Limiting & Abuse Protection

- Added a dependency-free in-memory Express rate limiter.
- `/api` has a general per-IP process-local limit; `/api/health` and disabled `/api/chat` have tighter limits.
- Excess requests receive HTTP 429 and `Retry-After`.
- Added response security headers and exact-origin CORS allowlisting via `ALLOWED_ORIGINS`.
- Admin Cloud Function operations use per-UID Firestore quotas.

Limit: the Express limiter is process-local and resets on restart. For multiple Render instances, use a shared Redis/edge rate limiter or hosting-provider protection. Firestore direct client requests are not throttled by Express; App Check and Firestore Rules remain separate controls.
