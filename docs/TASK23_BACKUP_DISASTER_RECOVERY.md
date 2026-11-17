# Batch 23 — Backup & Disaster Recovery

The previous daily backup was upgraded to schema v2:
- Firestore Timestamp, GeoPoint, Bytes and DocumentReference values use typed markers.
- Every page object is recorded in the manifest with SHA-256 and byte size.
- Each run is recorded in `system_backup_runs` with running/completed/failed status.
- A failed scheduled backup creates an Admin incident.
- Admin callable functions list runs and verify checksums.

## Restore procedure
`functions/restore-firestore-backup.js` is dry-run by default. It verifies every object checksum and checks that the target has no existing documents. Actual writes require `--apply`, a target project ending in `-staging` or `-test`, and `CONFIRM_RESTORE_PROJECT_ID` exactly matching the target. It refuses production targets and refuses to overwrite existing documents.

Legacy v1 backups do not have per-object checksums and are not accepted by this restore tool. Keep the original backup objects until a migration/restore plan is reviewed.
