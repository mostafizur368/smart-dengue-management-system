# Task 2 Validation Results

Command: `npm run test:hybrid-search`

Test inputs:
- Bangla dengue symptoms
- Bangla dengue food question
- English dengue warning-sign question
- Bangla transmission question
- Bangla platelet question

Observed top-ranked categories:
- symptoms
- food
- warning
- transmission
- platelets

All five test queries ranked the expected category first. These are functional smoke tests, not a complete accuracy benchmark. Similarity percentages are internal ranking scores, not medical confidence or diagnostic probabilities.
