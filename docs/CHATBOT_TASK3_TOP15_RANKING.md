# Chatbot Upgrade — Task 3: Top 15 Similarity Ranking

## User-visible behavior
After the chatbot answers a dengue-related question, it displays a compact control:
- Bangla: "আরও ১৫টি মিল পাওয়া প্রশ্ন দেখুন"
- English: "View 15 similar questions"

When opened, the user sees up to 15 ranked question-bank matches with:
- rank/order
- matched question text
- category
- text similarity percentage

The list is collapsed by default so the chatbot remains readable.

## Ranking behavior
- Uses Task 2's free hybrid search (BM25 + TF-IDF cosine + character n-gram fuzzy score + Bangla/English synonym expansion).
- Returns at most 15 candidates.
- Removes exact duplicate question strings.
- Filters candidates below a relative relevance floor.
- Does not show results for unrelated questions/greetings.
- The best-ranked category continues to determine the existing question-bank answer.

## Important interpretation
The percentage is a ranking/similarity score only. It is not a probability, diagnostic confidence, or measure of medical correctness.

## Files changed
- `assets/js/dengue-search.js`
- `assets/js/dengue-questions.js`
- `dengue-questions.js` (synchronized copy)
- `assets/js/script.js`
- `assets/css/style.css`
- `style.css` (matching Task 3 style additions)
- `scripts/test-top15-ranking.js`
- `scripts/test-top15-answer-flow.js`
- `package.json`

## Validation
Run:
```bash
npm run audit:question-bank
npm run test:hybrid-search
npm run test:top15
npm run test:top15-answer
```
