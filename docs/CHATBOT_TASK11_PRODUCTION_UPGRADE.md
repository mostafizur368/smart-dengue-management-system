# Task 11 — Production Upgrade

## Delivered
1. Local intent-quality signal based on the existing free hybrid search results.
2. Transparent topic label and lexical match percentage displayed below each answer.
3. Low-match caution asking the user to rephrase and consult a clinician for medical decisions.
4. Explicit Helpful / Not helpful controls after each chatbot answer.
5. Feedback writes to Firestore `chatbot_feedback` only after the user clicks a rating.
6. If Firestore is unavailable, feedback is temporarily saved in the same browser's localStorage and the UI clearly says it is local-only.
7. Admin dashboard section showing latest 50 feedback records, helpful/not-helpful counts and average text-match score.
8. Firestore rules constrain feedback fields and allow only admins to read submitted records.
9. No paid API or external AI service added.

## Important meaning of match percentage
The displayed percentage is a text-relevance score from the existing local question matcher. It is not AI confidence, medical certainty, diagnostic probability or a measure of answer correctness.

## Firebase deployment steps
1. Open Firebase Console → Firestore Database → Rules.
2. Replace the existing rules with the updated `firestore_rules_current.txt` included in this project, after reviewing them against your current production rules.
3. Publish the rules.
4. Ensure the admin user has `role: "admin"` in `users/{uid}`.
5. Deploy the updated website.
6. Sign in as an admin and open `assets/admin/admin-dashboard.html`.
7. Submit a test rating from the public chatbot and refresh the admin feedback section.

Do not publish rules without checking that they preserve all rules currently used by your live project. The supplied file is the project's current rules plus the Task 11 feedback rule.

## Privacy
A rating click sends the user's question, a short answer preview, topic, match score, language, user UID when signed in, and timestamp to Firestore for admin review. Questions can contain health-related information. Explain this in your privacy notice, limit admin access, and do not collect names, phone numbers or email addresses in chatbot feedback. Pending localStorage feedback is only on that browser and is not visible to the admin dashboard.

## Verification
Run `npm run test:full` to execute all 13 regression and integration suites, including Task 11.
This automated check validates local quality scoring, feedback UI wiring, Firestore feedback rule presence and admin dashboard wiring. It does not validate live Firebase permissions, real-browser rendering, clinical correctness or hosting configuration.
