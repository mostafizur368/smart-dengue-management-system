# Chatbot Upgrade — Task 2: Free Hybrid Search Engine

## What was added
- BM25 ranking for relevance-weighted keyword retrieval.
- TF-IDF cosine similarity for term-weighted document similarity.
- Character trigram Dice similarity for typo-tolerant fuzzy matching.
- Bangla/English synonym concept expansion to improve cross-language paraphrase matching.
- A ranked candidate result list exposed as `window.searchDengueCandidates(message, limit)`.
- The chatbot now uses the hybrid search engine's best-ranked candidate, with the original matcher retained as a fallback.

## Cost and privacy
- No OpenAI, Gemini, or other paid API is called.
- Search runs in the user's browser.
- No user question is sent to an external AI service by this search feature.

## Important accuracy note
The synonym concept expansion is a lightweight, explainable semantic proxy. It is not a neural sentence-embedding model. A true multilingual embedding model can be added as an optional local model in a later iteration, but that may require a large one-time model download and additional CPU/RAM. The current engine is fully local and lightweight.

## How to test
1. Run `npm install`.
2. Run `npm start`.
3. Open `http://localhost:3000`.
4. Ask Bangla and English dengue questions.
5. In browser DevTools Console, inspect:
   `window.lastDengueSearchResults`
   `window.dengueSearchEngineInfo`
6. Run `npm run audit:question-bank` to recheck the bank.

## Ranking formula
`score = 0.45 * normalized BM25 + 0.30 * TF-IDF cosine + 0.10 * character fuzzy + 0.15 * synonym-concept overlap`

The formula is an initial baseline and should be tuned using a labeled test set rather than assumed to be clinically or statistically optimal.
