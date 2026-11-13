# Task 3.1 — Query Intent and Ranking Fix

## Bug reproduced
The query `ডেঙ্গুতে শরীর ব্যথা কেন হয়?` was routed to the broad `symptoms` topic. The question bank stores one shared answer per topic, so the chatbot returned the generic symptoms paragraph instead of answering the cause question.

## Fixes
1. Added a specific Bangla/English answer intent for why dengue can cause body, muscle and joint aches.
2. The targeted answer explains the symptom cautiously, clarifies that pain severity alone does not determine dengue severity, and includes safe care guidance and warning signs.
3. Added a diversity filter to Top-15 retrieval. Near-identical paraphrases are skipped using token-set Jaccard similarity (threshold 0.78), reducing repeated variants.
4. Similarity values remain retrieval/ranking scores, not medical confidence.

## Test
Run `npm run test:body-pain`.
