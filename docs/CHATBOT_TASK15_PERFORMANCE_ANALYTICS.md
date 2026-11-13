# Task 15 — Chatbot Performance Analytics Dashboard

## Purpose
Provide Admin with a measurable view of chatbot usage and answer relevance. The dashboard uses the existing free Firestore project and browser-side aggregation; no paid AI or analytics API is added.

## What is collected
Each submitted chatbot question creates one `chatbot_query_events` document containing:
- Question text (up to 500 characters), to calculate popular questions.
- Best matched question-bank entry (up to 300 characters).
- Topic, text-match score and match level.
- Language (`bn` or `en`).
- Firebase UID when the user is signed in, otherwise null.
- Firestore server timestamp and client timestamp.

The answer body is not copied into the analytics event. Explicit Helpful / Not Helpful ratings continue to use the existing `chatbot_feedback` collection.

The chatbot now displays a notice that questions may be stored for performance analytics. Update the website Privacy Policy to describe this processing and retention period before production deployment. Do not encourage users to submit names, phone numbers or other personal details.

## Admin dashboard metrics
- Total questions in the last 30 days.
- Total questions in the last 7 days.
- Average text-match score in the last 30 days.
- Helpful rating percentage in the last 30 days.
- Daily question volume for the last 7 days.
- Top 50 most frequently submitted question wordings in the last 30 days.
- Topic-wise question count and average text-match score.
- Most Not Helpful matched questions in the last 30 days.

The dashboard reads at most the latest 2,000 documents from each of the query-event and feedback collections. This bounded read protects dashboard load time and cost, but means the reports are not a complete lifetime total after the collections exceed those limits. It is not a real-time streaming dashboard; it refreshes when the Admin page is loaded.

## Firestore security
`chatbot_query_events`:
- Public clients may create constrained event documents.
- Only Admins may read analytics events.
- Clients cannot update or delete events.
- Each event is limited by field allowlist and text length.
- Admin access continues to use `users/{uid}.role == "admin"`.

## Deployment
1. Back up current Firestore Rules.
2. Review the complete `firestore_rules_current.txt` against the current live rules. It includes previous project rules plus the Task 15 collection rule.
3. Publish the reviewed rules.
4. Deploy the updated `assets/js/script.js` and `assets/admin/admin-dashboard.html` with the rest of the project.
5. Confirm Admin role in `users/{uid}`.
6. Submit a few test questions in Bangla and English.
7. Submit Helpful and Not Helpful ratings.
8. Open the Admin Dashboard and review the Analytics section.

## Historical data limitation
Analytics begins collecting query events only after the Task 15 frontend and Firestore rules are deployed. It cannot reconstruct questions asked before deployment because those events were not previously stored. Existing feedback records may appear in the rating metrics if they fall within the last 30 days.

## Cost, abuse and privacy
- Each chatbot question writes one Firestore document. Firestore usage and billing depend on the project's plan, usage and regional pricing; this is not an external paid AI API.
- Public create rules do not provide robust rate limiting. Enable Firebase App Check and consider a server-side rate limit before public launch.
- Question text can contain health-related or identifying details. Limit admin access, publish a clear privacy notice, and define a retention/deletion policy.
- Average match score measures lexical/retrieval relevance only. It is not clinical accuracy, diagnostic confidence or proof that an answer is correct.
- Helpful rate is based only on users who explicitly submit a rating; it is not a representative satisfaction survey.

## Validation
Run:
`npm run test:task15`

Run all regression and integration checks:
`npm run test:full`

The Task 15 automated test checks event capture wiring, event fields, dashboard metrics/report wiring, bounded Firestore reads, Firestore access rules and user-facing disclosure. It does not validate live Firebase permissions, real browser rendering, Firestore billing, abuse controls or medical correctness.
