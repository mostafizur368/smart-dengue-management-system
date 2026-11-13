# Task 17 — Smart Knowledge Import & Bulk Upload

## Scope
Task 17 extends only the existing Admin Question Bank panel and its Firestore rules. It does not replace the website or rewrite the existing static question bank. Existing Tasks 1–16 are retained in the project.

## Supported file formats
- CSV
- Excel XLSX
- Legacy Excel XLS

The Admin page uses the SheetJS browser library from a CDN to read Excel/CSV files. CSV template download is available from the Import panel.

## Required columns
- `topic`
- `question`
- `answerBn`
- `answerEn`

Alternative header labels are accepted, including `Topic`, `Question`, `Answer Bangla`, and `Answer English`. First worksheet is read for Excel workbooks.

## Import workflow
1. Select CSV or Excel file.
2. Validate & Preview.
3. System checks each row for required fields, topic slug, question/answer lengths, exact duplicates in the existing Question Bank and duplicates within the upload.
4. Potentially similar questions are flagged for manual review.
5. Admin may allow rows with similar-question warnings using the explicit checkbox. Exact duplicates remain blocked.
6. Admin selects Approve & Publish and confirms.
7. Valid approved rows are written into the existing `chatbot_admin_question_bank` collection with `source: custom`, so Task 16's existing chatbot loader can use them.
8. Public chatbot users receive newly imported questions after refreshing the page.
9. Import history is saved in `chatbot_import_batches`.

## Limits and validation
- Maximum 500 data rows per import.
- Topic must be a lowercase slug of 2–60 English letters, digits, underscore or hyphen.
- Question length: 5–500 characters.
- Bangla answer length: 20–6,000 characters.
- English answer length: 20–6,000 characters.
- Exact duplicates are skipped.
- Similar wording is a warning and requires Admin opt-in.
- Failed and review rows can be downloaded as CSV.

## Firestore
New collection: `chatbot_import_batches`.
Only Admins may read or write import history. Imported knowledge rows use the existing `chatbot_admin_question_bank` rules and collection. No new public write permission is added.

## Deployment
1. Back up the current website and Firestore Rules.
2. Review and merge the Task 17 `chatbot_import_batches` rule into the live rules. Do not overwrite unrelated live rules.
3. Deploy the updated `assets/admin/admin-dashboard.html` and `firestore_rules_current.txt` with the rest of the project.
4. Keep the SheetJS CDN accessible, or use CSV if the browser cannot load the library.
5. Test with the downloadable template first.
6. Preview before publishing; verify a published question on the public chatbot after refresh.

## Important limitations
- The Excel parser library is loaded from a CDN, so Excel parsing requires internet access and the CDN to be reachable. CSV parsing also uses this library.
- The system reads the first worksheet only.
- This task records batch history but does not implement rollback of already-published rows. If a batch is wrong, use Task 16's soft-delete/restore workflow for the affected imported questions.
- The publish process writes in chunks of 400 to stay below Firestore's 500-write batch limit. If a network or permission failure occurs midway, some earlier chunks may already have been committed. The UI reports how many rows were published and warns not to retry blindly.
- Importing a row does not clinically validate its content. Medical answers must be reviewed by a qualified clinician.

## Validation
Task 17:
`npm run test:task17`

Full regression:
`npm run test:full`

The automated Task 17 checks validate file format support wiring, required preview-before-publish flow, 500-row limit, answer validation, duplicate/similarity checks, chunked writes, failed-row export, history and Admin-only history rules. These static checks do not replace browser testing with real files or live Firestore.
