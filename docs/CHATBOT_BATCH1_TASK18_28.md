# Batch 1 — Tasks 18–28 (Knowledge Management + Intelligent Chatbot)

## Scope and preservation
This batch is based on the supplied Task 17 project ZIP. It extends the existing Question Bank, search engine, chatbot answer flow and Admin Dashboard. It does not replace the website or rewrite the original static question-bank data. Existing site modules (authentication, doctors, appointments, contact forms and other pages) are retained.

No paid AI API is added. Retrieval and language normalization run in the browser.

## Task 18 — Import rollback
- New imports store their published question IDs in the import batch record.
- Admin can soft-delete all questions in a selected batch from Import History.
- Legacy Task 17 batches can be recovered by querying their `batchId` field.
- Rollback is reversible: Admin can restore individual questions from the Question Bank.
- A rollback writes version-history events.

## Task 19 — Question version history
- Create, edit, approve, delete/restore, bulk actions, import and rollback write immutable history records to `chatbot_question_versions`.
- Each record captures the action, before/after values, Admin UID and client timestamp.
- Admin can open History for an individual question.
- Changes made before this batch are not reconstructable.

## Task 20 — Advanced duplicate detection
- Similarity combines concept-token overlap, containment and character n-gram similarity.
- Bangla/English aliases and common Banglish phrases are normalized.
- Exact duplicates remain blocked; likely semantic duplicates are shown as review warnings.
- Similarity is a text comparison, not a medical correctness score.

## Task 21 — Bulk edit
- Admin can select entries on the current paginated page.
- Bulk actions: change topic, approve, soft-delete and restore.
- Operations are committed in chunks below Firestore's 500-write batch limit.
- Bulk actions also write version history.

## Task 22 — Question approval
- New Admin-created questions default to `pending`.
- Pending entries are visible to Admin but are not loaded by the public chatbot.
- Admin can approve a pending entry to make it active, or edit/delete it.
- Existing active entries can be edited and published directly by an Admin using the explicit status selector.
- Bulk-import Task 17 remains an explicit Admin "Approve & Publish" action.

## Task 23 — Automatic backup
- When the Admin Question Bank loads, the system checks for a daily backup.
- If none exists for the current UTC date, a snapshot is saved to `chatbot_question_bank_backups`.
- Backup contents are split into 20-entry chunk documents to stay comfortably below Firestore's 1 MiB per-document limit.
- Admin can also create a manual Firestore backup.
- This is a Firestore snapshot, not a full Firebase project backup. It does not back up users, appointments, Storage files or Rules.

## Task 24 — Top 15 similar questions
- The existing Top-15 display is retained and strengthened.
- Search returns up to 15 ranked results and fills remaining slots from a lower relevance band when needed.
- Results are sorted by score after diversity selection.
- Lower-ranked results may have low similarity; the score is linguistic relevance only.

## Task 25 — Bangla, English and Banglish search
- Adds common transliteration and mixed-language aliases for dengue, fever, body pain, headache, platelet, vomiting, bleeding, medicine and food.
- Keeps existing BM25, TF-IDF cosine and character n-gram retrieval.
- Adds question-intent signals such as cause and action.

## Task 26 — Smart answer selection
- Admin-managed and approved community entries can return their own bilingual answers when they are the selected strong match.
- Existing built-in entries continue using the established topic-level bilingual answer.
- Approved answer corrections retain priority.
- Pending entries are not included in the public index.

## Task 27 — In-session context
- The chatbot remembers the latest matched question/topic in the current page session.
- Short follow-ups containing cues such as "এটা", "তাহলে", "it", "this" or "what about" are searched with the previous matched question.
- Context expires after 15 minutes and is cleared for unrelated questions.
- Context is kept in browser memory only; it is not persisted as a user profile or sent to a third-party AI.

## Task 28 — Missed-question detection
- Query analytics now record `isUnmatched`, `topMatchCount` and `contextUsed`.
- Admin can view distinct low-match/unanswered question wordings from the latest 1,000 query events.
- The report can be exported as CSV.
- Only Admins can read analytics events. Public question events remain subject to the existing privacy disclosure and Firestore field limits.

## Firestore Rules added/updated
- `chatbot_question_versions`: Admin-only read/create; immutable after creation.
- `chatbot_question_bank_backups` and its `chunks` subcollection: Admin-only access.
- `chatbot_query_events`: optional Task 28 fields are accepted and type-validated.
- Existing Task 1–17 rules are retained in `firestore_rules_current.txt`.

## Deployment steps
1. Back up the live website and the current Firestore Rules.
2. Review `firestore_rules_current.txt` against the currently published Task 17 Rules. Publish the merged Rules so the new version-history and backup collections work and the Task 28 analytics fields are accepted.
3. Deploy the updated project files to your hosting/GitHub workflow only after local testing.
4. Keep the Admin account's existing `users/{uid}.role == "admin"` setting.
5. Open Admin Dashboard → Question Bank. The first Admin load may create the daily backup.
6. Test a new pending question, approve it, search it on the public chatbot, inspect version history, test bulk edit, and create a manual backup.
7. Import a small test batch and verify rollback before using large production imports.

## Validation
- `npm run test:task18-28` — 21/21 Task 18–28 checks pass.
- `npm run test:full` — 20/20 test suites pass.
- JavaScript and Admin module syntax checks pass.
- Admin HTML ID check found no duplicate IDs or missing `kb-*` controls.

Automated tests do not replace live Firebase permission testing, a real browser test on the deployed host, or clinician review of medical answers.
