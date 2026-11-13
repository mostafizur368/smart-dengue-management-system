# Chatbot Upgrade — Task 1: Question Bank Audit & Cleaning

## Scope
This step prepares the existing question bank for hybrid retrieval in later tasks. It intentionally preserves the existing `dengueQuestionBank` structure and matching functions so the current chatbot continues to work.

## Findings from the supplied project
- Main bank: 10 categories.
- Questions: 1,000 total (100 per category).
- Normalized exact duplicates in the original bank: 0.
- Every category has both Bangla and English answer fields.
- The same question bank existed in both the root-level `dengue-questions.js` and `assets/js/dengue-questions.js`, but the files had drifted. The root-level copy is now synchronized with the browser-loaded `assets/js/dengue-questions.js`.
- `index.html` loads `assets/js/dengue-questions.js`; this remains unchanged.

## Changes made
1. Added a derived `dengueQuestionIndex` with stable IDs such as `symptoms_001`, `food_023`, etc.
2. Each indexed record contains `id`, `topic`, `question`, `answerBn`, and `answerEn`.
3. Added `auditDengueQuestionBank()` to detect duplicate questions, empty questions, invalid categories, and missing bilingual answers.
4. Exposed `window.dengueQuestionIndex` and `window.dengueQuestionBankAudit` for the upcoming search implementation.
5. Preserved the original question-bank object and existing answer functions to avoid breaking the current chatbot.
6. Added `npm run audit:question-bank` for repeatable validation.

## Validation
Run from the project folder:

```bash
npm run audit:question-bank
```

Expected baseline:
- Topics: 10
- Questions: 1,000
- Unique questions: 1,000
- Duplicates: 0
- Invalid topics: 0
- Topics missing Bangla/English answers: 0
- Empty questions: 0
- Result: PASS

## Important note
The audit confirms exact normalized duplicates are absent. It does not claim all 1,000 phrasings are semantically distinct; many were generated from similar templates. Semantic diversity and relevance will be addressed during retrieval/ranking work in Tasks 2 and 3.

## Files changed
- `assets/js/dengue-questions.js`
- `dengue-questions.js` (synchronized legacy copy)
- `scripts/audit-question-bank.js` (new)
- `package.json`
