# Batch 6 — Tasks 63–67: Advanced Chatbot Upgrade

## Baseline and scope
The Task 1–62 baseline already contained:
- Top-15 similar-question retrieval (Task 3)
- Hybrid lexical/semantic-proxy search (Task 2)
- A basic one-question, 15-minute follow-up context (Task 27)
- Browser-native speech recognition and speech synthesis (Tasks 40–41)
- Basic Bangla/English/Banglish detection (Task 42)

Therefore Batch 6 upgrades these existing components instead of duplicating them. No paid AI, remote LLM, cloud speech, or new Firestore collection is introduced.

## Task 63 — Explainable Top-15 Similarity Results
- Every ranked result now carries text-retrieval signals: exact wording, concept overlap, spelling/wording similarity, and keyword overlap.
- The expanded similar-question list displays why each result matched.
- Similarity remains a wording/retrieval indicator only. It is not medical accuracy, diagnosis, or clinical confidence.

## Task 64 — Expanded Banglish and Typo-Tolerant Search
- Consolidates Banglish phrase variants into the same semantic phrase groups rather than creating duplicate concept IDs.
- Adds common transliterations for platelet reduction, fever, body/head/stomach pain, vomiting, bleeding, breathing difficulty, medicine, food, warning signs and NS1 testing.
- Preserves the existing BM25, TF-IDF, character n-gram fuzzy matching and concept-overlap ranking.
- No query is sent to an external translation or AI API.

## Task 65 — Five-Turn In-Session Context
- Keeps at most five recent question summaries in JavaScript memory.
- Uses the latest relevant question to resolve short follow-ups such as “এটা কত হলে বিপদ?”.
- Context expires after 15 minutes.
- Adds a “Start a new topic” control.
- Clearing saved chat also clears in-session topic context.
- Context is not stored in Firestore or localStorage and is not sent to an AI provider.

## Task 66 — Voice Controls Upgrade
- Adds selectable voice-input language: Auto, Bangla (bn-BD), or English (en-US).
- Adds optional automatic answer read-aloud; it is off by default.
- Keeps manual Listen/Stop controls.
- Uses browser-provided SpeechRecognition and speechSynthesis. Browser/device support and available voices vary.
- No custom paid speech API is integrated. However, speech-recognition audio may be processed by the browser/provider depending on its implementation and settings; the website cannot guarantee on-device processing. A privacy notice tells users to avoid speaking names or sensitive medical details and to type them instead when concerned.
- Speech synthesis uses the browser/device engine; the provider's own data-handling behavior is outside the website's control.

## Task 67 — Stronger Bangla/Banglish/English Detection
- Uses a weighted Banglish vocabulary rather than a single-word match.
- Returns a language hint with confidence and mixed-input information.
- Displays the detected language beneath the chatbot input.
- Language detection is a lightweight UI/retrieval hint, not translation or a guarantee of answer correctness.

## Firebase and deployment
- No new Firestore collection or Firebase configuration change is required for Batch 6.
- Firestore Rules do not need to change for these five tasks.
- The existing Firebase project configuration remains unchanged.
- Do not deploy to the live GitHub `main` branch until manual browser tests are complete.

## Validation
```bash
npm run test:task63-67
npm run audit:release
npm run test:full
```
Automated checks do not replace manual browser testing. Verify voice features in a browser that supports Web Speech APIs and check microphone permissions. Search quality should be tested with real Bangla, Banglish, English, typos and unrelated questions.

## Manual acceptance checklist
1. Ask “ডেঙ্গুর লক্ষণ কী?” and expand similar questions; each item should show its wording-match reason.
2. Ask “amr platelet komse”, “mathay betha”, “shorir batha hocche”, “bomi hocche”, and “shash nite koshto”; confirm relevant topic matches.
3. Ask a dengue question, then “এটা কত হলে বিপদ?”; confirm the prior topic is used.
4. Click “Start a new topic”; ask the same short follow-up and confirm old context is not reused.
5. Select Bangla and English voice input languages and verify the microphone status. Auto mode uses the existing input language when available and otherwise defaults to Bangla.
6. Review the voice privacy notice before using the microphone. Browser speech recognition may process audio through the browser/provider; use typed input for sensitive details.
7. Turn on automatic read-aloud only if desired; leave it off by default.
7. Type Bangla, Banglish, English and mixed-language prompts and review the language hint.
