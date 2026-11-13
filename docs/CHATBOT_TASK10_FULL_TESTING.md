# Task 10 — Full Chatbot Testing & Optimization

## Added validation
- 16 representative Bangla/English answer-routing scenarios across all feature areas.
- Top-15 output contract: no more than 15 results, sequential ranks, valid question and 0–100 similarity score.
- Unrelated question rejection and no similar-question list for unrelated content.
- Emergency alert frontend integration, accessible alert role/live-region and CSS presence.
- Test-script registration checks.

## Full regression command
`npm run test:full`

This runs 12 suites:
1. 1,000-question bank audit
2. Hybrid search
3. Top-15 ranking
4. Top-15 answer flow
5. Body pain intents
6. Symptoms intents
7. Platelet and blood report intents
8. Food and nutrition intents
9. Medicine safety intents
10. Emergency intents
11. Recovery and prevention intents
12. Cross-feature integration checks

## Notes
The tests validate routing, ranking contracts, fallback behavior and safety-alert wiring. They do not establish clinical accuracy, diagnose users, or replace clinician review and real-browser/user-acceptance testing. Similarity scores indicate textual relevance, not medical certainty.

## Manual QA still recommended
- Run the app in the target browser and test mobile/desktop layouts.
- Confirm the emergency alert appears for symptom descriptions and does not trigger for ordinary educational questions.
- Have a qualified clinician review medical content before public deployment.
- Test actual hosting, database rules, authentication and production configuration separately.
