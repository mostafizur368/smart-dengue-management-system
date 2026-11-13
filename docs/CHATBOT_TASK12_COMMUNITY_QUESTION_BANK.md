# Task 12 — Admin-Reviewed Community Question Bank

## Purpose
Let visitors suggest missing dengue questions. Suggestions remain private and pending until an administrator reviews them and writes both Bangla and English answers. Only approved entries are added to the live hybrid-search index.

This is an admin-in-the-loop knowledge-base workflow, not autonomous self-learning and not AI-generated medical advice.

## Visitor flow
1. Open the chatbot and choose **নতুন প্রশ্ন প্রস্তাব করুন / Suggest a question**.
2. Submit a dengue-related question (8–300 characters).
3. The suggestion is saved in Firestore `question_suggestions` with status `pending`.
4. The visitor sees a message explaining that approval is required.
5. Visitors cannot read other suggestions, approve content, or write directly to the published question bank.

## Admin flow
1. Sign in with an account whose `users/{uid}.role` is `admin`.
2. Open `assets/admin/admin-dashboard.html`.
3. Find **Community Question Bank Review**.
4. Review the proposed question and duplicate warning.
5. Choose the correct topic.
6. Write a medically reviewed Bangla answer and English answer.
7. Select **Approve & Add to Question Bank** and confirm, or reject the suggestion.
8. Approval uses a Firestore transaction to create `community_question_bank/{suggestionId}` and update the suggestion status together.

## Runtime behavior
- The website loads only records with `status == approved`.
- Approved records are merged into `window.dengueQuestionIndex`, so the existing hybrid BM25/TF-IDF/fuzzy search can retrieve them.
- An approved community answer is returned only when it is the top match and meets the existing minimum retrieval score.
- The original static question bank and all existing features remain available if Firebase cannot be reached.
- Exact normalized duplicates are blocked in the visitor form and flagged in the admin review list. Admins must still check meaning-level duplicates manually.

## Firestore collections and access
### `question_suggestions`
- Public create only, with strict field and length validation.
- Only admins can read, update or delete.
- Public visitors cannot see the pending queue.

### `community_question_bank`
- Public read is limited to documents with `status == approved`.
- Only admins can create, update or delete.
- The website reads only approved documents.

## Deployment steps
1. Back up the current Firestore Security Rules.
2. Open Firebase Console → Firestore Database → Rules.
3. Review the complete updated `firestore_rules_current.txt` against your live rules. It contains the previous Task 11 rules plus the Task 12 collections.
4. Publish the reviewed rules.
5. Deploy the updated website files, including:
   - `assets/js/community-question-bank.js`
   - updated `assets/js/script.js`
   - updated `assets/js/dengue-questions.js`
   - updated `assets/js/dengue-search.js`
   - updated `index.html`
   - updated `assets/admin/admin-dashboard.html`
6. Confirm that the admin account has `role: "admin"` in `users/{uid}`.
7. Submit a test question from the public chatbot.
8. Sign in as Admin, add both answers, and approve it.
9. Reload the public site and test the approved question in Bangla and English.

## Privacy and abuse considerations
- The suggestion form collects the question only; it does not request a name, phone number or email.
- If the visitor is signed in, their Firebase UID is recorded for moderation; otherwise it is null.
- A suggested question may contain health-related text. Keep admin access restricted and explain submission/review in the site's privacy notice.
- Firestore rules validate fields but do not provide a robust rate limit. Enable Firebase App Check and consider CAPTCHA or sign-in requirements before opening public submissions widely.
- Never treat community suggestions as medically reviewed until a qualified reviewer has checked the content. Do not approve treatment or medication advice without appropriate clinical review.

## Validation
Run:
`npm run test:task12`

Run all suites:
`npm run test:full`

The Task 12 test checks approved-record merging, duplicate normalization, hybrid-search retrieval, answer routing and rejection of incomplete bilingual records. Automated tests do not verify live Firebase permissions, transaction behavior in the deployed project, browser rendering, rate limits or clinical correctness.
