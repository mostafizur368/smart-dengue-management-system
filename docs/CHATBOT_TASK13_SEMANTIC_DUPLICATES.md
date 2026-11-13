# Task 13 — Bangla/English Semantic Duplicate Detection

## Purpose
Detect questions that express the same intent even when the wording or language differs. This runs locally in the browser and uses no paid API or external AI service.

## New capability
- Phrase-level normalization maps common Bangla and English expressions to shared concepts.
- Examples include:
  - "ডেঙ্গুতে শরীর ব্যথা কেন হয়?"
  - "ডেঙ্গু হলে গা ব্যথা করে কেন?"
  - "Why does dengue cause body pain?"
- The local semantic matcher compares normalized concept tokens and returns ranked candidate questions with a similarity percentage.
- The Admin review queue compares each pending suggestion against:
  1. The built-in question bank.
  2. Approved community questions.
  3. Other pending suggestions.
- The Admin screen displays up to three strongest related questions and their meaning-similarity percentages.

## Admin warning policy
- Exact wording duplicate: approval is blocked.
- Strong semantic duplicate (78% or higher): approval is blocked; review the existing entry instead.
- Possible semantic match (55% to 77%): warning is shown, but Admin may approve after manually confirming the intent is genuinely different.
- Below 55%: no semantic duplicate warning is shown.

The score is a heuristic text/concept similarity measure. It is not an AI understanding score, clinical confidence, or proof that two questions are identical. Admin must review the suggested and existing questions in context.

## Technical notes
- `assets/js/dengue-search.js` exposes:
  - `window.compareDengueQuestionSimilarity(questionA, questionB)`
  - `window.findDengueQuestionDuplicates(question, candidates, limit)`
- `assets/admin/admin-dashboard.html` loads the search engine and renders the ranked semantic warnings.
- Existing hybrid search, question answering, user suggestion flow, and Firestore schema remain unchanged.
- No new Firestore collection or security rule is required for Task 13.

## Validation
Run Task 13 checks:
`npm run test:task13`

Run the full regression suite:
`npm run test:full`

Task 13 tests validate cross-language body-pain, paraphrased Bangla body-pain, cross-language symptoms, cross-language NS1 test intent, unrelated-intent separation, ranked candidates, and Admin UI wiring.

Automated checks do not validate all possible paraphrases, live Firebase behavior, or medical correctness. Expand the phrase alias list based on real admin-reviewed examples and monitor false positives before relying on it for moderation.
