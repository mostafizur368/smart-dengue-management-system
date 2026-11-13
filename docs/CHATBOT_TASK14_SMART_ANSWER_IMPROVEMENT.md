# Task 14 — Smart Answer Improvement System

## Purpose
Turn explicit `Not Helpful` feedback into an administrator-reviewed correction workflow. The chatbot never changes medical answers automatically from user ratings.

## User flow
1. A user selects `👎 Not helpful` under a chatbot answer.
2. The existing `chatbot_feedback` record is saved.
3. A related `chatbot_answer_issues` record is created with the user's question, matched question-bank entry, previous answer preview, original matched Bangla/English answer, topic, match score and status `pending`.
4. The user is told whether the issue reached the admin review queue.

## Admin flow
1. Sign in using an account with `users/{uid}.role == "admin"`.
2. Open `assets/admin/admin-dashboard.html`.
3. Review pending answer issues, original question-bank answer in both languages, and the answer shown to the user.
4. Write corrected Bangla and English answers.
5. Choose `Approve & Publish Correction`, then confirm.
6. The Firestore transaction:
   - Verifies that the issue is still pending.
   - Increments the correction version for the matched source question.
   - Publishes the approved correction to `chatbot_answer_overrides`.
   - Adds an immutable record to `chatbot_answer_correction_history`.
   - Marks the issue `resolved`.
7. Admin can reject an issue; rejected items are counted separately.

## Live answer behavior
- Public chatbot loads only `status == approved` records from `chatbot_answer_overrides`.
- Approved overrides are matched by a deterministic normalized question key.
- When the hybrid search engine selects that exact source question as its best match and the retrieval score is at least 0.12, the approved corrected answer is returned before the legacy answer.
- The latest approved version for a source question wins.
- Corrections are loaded when the public page loads; a refresh is required for a newly published correction to appear in an already-open browser tab.
- The built-in question bank remains available if Firestore is unavailable.

## Admin reports
- Pending answer issue count.
- Number of approved correction documents.
- Rejected issue count.
- Correction history with version, source question, timestamp and admin UID.
- Most-reported source questions grouped by normalized matched question.

## Firestore collections
### `chatbot_feedback`
The existing collection now also stores `matchedQuestion`, the best matched question-bank entry used as the correction target.

### `chatbot_answer_issues`
- Public create only, with strict field and length validation.
- Only admins can read, update or delete.
- Status values used: `pending`, `resolved`, `rejected`.

### `chatbot_answer_overrides`
- Public read only for documents with `status == approved`.
- Only admins can create, update or delete.
- Each deterministic source-question document stores the current approved version and previous answer fields.

### `chatbot_answer_correction_history`
- Admin-only read and create.
- Client rules deny update and delete to keep the audit trail append-only.
- Each approval writes a new version history record.

## Deployment
1. Back up current Firestore Security Rules.
2. Review the complete updated `firestore_rules_current.txt` against the live rules; it includes previous Task 11–13 collections plus Task 14 additions.
3. Publish the reviewed rules.
4. Deploy the updated website files, especially:
   - `assets/js/answer-overrides.js`
   - `assets/js/script.js`
   - `assets/js/dengue-questions.js`
   - `assets/admin/admin-dashboard.html`
   - `index.html`
5. Confirm the admin account has `role: "admin"` in `users/{uid}`.
6. Test by submitting a Not Helpful rating on a chatbot response.
7. Open the Admin Dashboard, review the issue, enter medically reviewed Bangla and English corrections, and approve.
8. Reload the public website and test the matched question in both languages.

## Medical safety and privacy
- Feedback can contain health-related questions and answers. Restrict dashboard access and explain collection/review in the privacy notice.
- Do not use ratings alone as evidence that an answer is medically wrong.
- Have a qualified clinician review corrections that change diagnosis, warning signs, medicines, tests or treatment advice.
- The system does not autonomously learn or generate new medical advice.
- Admin UID and timestamps are retained for accountability.

## Validation
Run Task 14 tests:
`npm run test:task14`

Run the full suite:
`npm run test:full`

The automated tests validate approved-version selection, live answer override routing, feedback-to-issue wiring, Firestore rule presence and admin correction/history/report wiring. They do not test live Firebase permissions, real browser UI, deployed transactions or clinical accuracy.
