# Batch 24 — Patient Privacy & Consent Center

The Patient Dashboard now has an optional chatbot question analytics preference. It is off by default. When enabled, submitted question text plus retrieval topic/match metadata may be stored to improve the chatbot question bank. Chatbot answer text is not part of this query event.

Consent changes are written to:
- `patient_privacy_preferences/{userId}` — current setting.
- `patient_consent_records/{autoId}` — append-only grant/withdrawal history.

Patients can read and delete their own consent records. The existing account export includes privacy preferences and consent history; account deletion removes these records and the preference document. Withdrawing consent stops future optional query analytics but does not erase older events automatically.
