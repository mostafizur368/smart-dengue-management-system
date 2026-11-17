# Batch 27 — Encryption & Key Management

The existing Task 87 AES-GCM-256 / PBKDF2-SHA-256 encrypted archive remains compatible:
- Decryption accepts legacy format v1 and new format v2.
- New cloud archive writes use format v2 and a `keyVersion`.
- Patients can rotate the cloud archive passphrase in the Patient Dashboard by entering the current and new passphrases.
- The browser decrypts and re-encrypts locally; only ciphertext and version metadata are stored in Firestore.
- The server does not hold a copy of the passphrase or a recovery key.

The offline IndexedDB archive is separate. Patients must save a new offline copy with the new passphrase if they also want to rotate that copy. This does not retroactively encrypt all live Firestore records.
