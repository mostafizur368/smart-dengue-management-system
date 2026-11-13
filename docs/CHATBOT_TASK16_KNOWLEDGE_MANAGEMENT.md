# Task 16 — Smart Admin Control & Knowledge Management

## Scope and preservation
Task 16 extends the existing Smart Dengue chatbot and its existing Admin Dashboard. It does not replace the website or rewrite the existing question-bank source file. The existing Login, Registration, Doctor, Appointment, and other website features are not intentionally modified.

The built-in JavaScript question bank remains the baseline. Admin changes are stored as Firestore overlay records in `chatbot_admin_question_bank`. This makes built-in entries editable/deactivatable from the Admin UI while keeping the original source data intact and reversible.

## Admin features
- View built-in question-bank entries.
- View approved community questions.
- Add Admin-created questions.
- Edit built-in, community and Admin-created entries.
- Soft-delete and restore questions.
- Search by question, topic, or answer.
- Filter by topic and status.
- Paginate the question list (30 entries per page).
- Add a new topic by entering a new topic slug in the editor; topics are automatically included in the topic filter.
- Warn on exact duplicate wording and ask for confirmation on likely similar questions.
- Export the current bank as JSON or CSV.
- Download a JSON backup with export metadata.

Both Bangla and English answers are required for every saved entry. Topic values must be lowercase slugs using English letters, digits, underscores or hyphens.

## Public chatbot behavior
On page load, the public chatbot:
1. Loads the built-in question bank.
2. Loads approved community questions.
3. Reads active/deleted Admin overlay records from `chatbot_admin_question_bank`.
4. Applies Admin edits and soft-deletions to built-in and community entries.
5. Adds active Admin-created questions.
6. Invalidates the hybrid search index so updated questions and answers are used by search.

If Firestore is unavailable or rules are not deployed, the static question bank and previously available community/approved answer flows remain available. Newly created or edited Admin entries will not be loaded until Firebase access is working.

## Firestore overlay document
Collection: `chatbot_admin_question_bank`

Fields:
- `entryId`: stable ID of the source question or Admin-created question.
- `source`: `builtin`, `community`, or `custom`.
- `topic`: topic slug.
- `question`: question wording.
- `answerBn`: Bangla answer.
- `answerEn`: English answer.
- `status`: `active` or `deleted`.
- `updatedBy`, `updatedAt`, `createdAt`: audit metadata.

Built-in and community changes use stable overlay document IDs. Admin-created entries use a generated stable ID. Deletion is a soft-delete; the record remains available to Admin for restore and backup.

## Security
- Admin users are verified through the existing `users/{uid}.role == "admin"` check.
- Only Admins can create, update, or delete overlay records.
- Public clients can read only records whose status is `active` or `deleted`, because the chatbot needs both active overrides and deletion markers.
- The Admin Dashboard can read all overlay records.
- Review the complete `firestore_rules_current.txt` against the live project's Rules before publishing; do not replace live Rules blindly. Back up current rules first.

## Deployment
1. Back up the current website and Firestore Rules.
2. Review the updated `firestore_rules_current.txt` and merge/publish the Task 16 rule for `chatbot_admin_question_bank`.
3. Deploy the updated `assets/js/community-question-bank.js`, `assets/js/dengue-search.js`, `assets/js/script.js`, and `assets/admin/admin-dashboard.html` with the project.
4. Confirm the Admin account has `role: "admin"`.
5. Open Admin Dashboard → Smart Question Bank & Knowledge Management.
6. Test Add, Edit, Delete, Restore, search, topic filter, JSON export and CSV export.
7. Refresh the public website and test a changed and a newly added question in both languages.

## Important behavior and limitations
- Admin changes are stored in Firestore; the original static JavaScript source remains unchanged.
- A public page already open in a browser must be refreshed to load new Admin changes.
- Exact duplicate wording is blocked; semantic similarity is a warning and still requires Admin judgment.
- Topic creation is implicit: entering a new valid topic slug while saving an entry makes it available in the topic filter.
- The JSON/CSV export is a downloadable snapshot, not an automatic cloud backup or restore/import feature.
- The system does not automatically verify medical accuracy. A qualified clinician should review changes involving diagnosis, warning signs, medicines, tests or treatment.
- The Admin UI currently loads the full static question bank and Firestore overlay for management; pagination limits rendered rows, not the initial static source data.

## Validation
Task 16:
`npm run test:task16`

Full regression suite:
`npm run test:full`

The automated Task 16 test validates static edit overlays, soft-delete behavior, community question updates, custom question insertion, search-index invalidation, Admin UI wiring and Firestore rule presence. The full suite passes 18/18 test suites. These checks do not replace live Firebase permission testing or manual browser testing.
