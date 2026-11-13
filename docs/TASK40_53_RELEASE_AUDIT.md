# Batch 3 — Tasks 40–53

## Source baseline and preservation
- Built on the supplied `smart-dengue-management-system-batch2-task29-39.zip` (Tasks 1–39).
- Existing user authentication, appointments, public doctor directory, question bank, Admin review queue, clinician review workflow, and Firestore data collections are retained.
- No paid AI, cloud speech, or remote LLM API was added.
- No live Firebase Rules, GitHub repository, or hosted website was changed by this local code update.

## Task 40 — Voice question input
- Adds a microphone control to the public chatbot.
- Uses browser-native `SpeechRecognition` or `webkitSpeechRecognition`.
- Supports `bn-BD` and `en-US` recognition hints.
- The transcript is placed in the input for the user to review; it is not sent automatically.
- Unsupported browsers and denied microphone permissions receive a typed-input fallback.
- Browser speech recognition availability and audio handling depend on the browser; this feature does not save raw audio in the app.

## Task 41 — Text-to-speech answers
- Adds a Listen/Stop control to each generated bot answer.
- Uses browser-native `speechSynthesis` and `SpeechSynthesisUtterance`.
- Selects Bangla or English locale from the answer text.
- Speech is user-initiated, not autoplayed.
- Actual voice quality and Bengali voice availability depend on the device/browser.

## Task 42 — Advanced language detection
- Recognizes Bangla Unicode and common Banglish transliteration cues.
- Keeps ordinary English questions in English.
- Applies consistently to the public UI and Question Bank answer language selection.
- This is a lightweight language hint, not a full translation or language-identification model.

## Task 43 — Mobile responsive chatbot
- Uses a flex-column chat window and dynamic viewport sizing.
- Adds small-screen breakpoints, safe-area padding, wrapping and scrollable prompt chips.
- Preserves the existing desktop chat layout.

## Task 44 — Starter questions
- Adds clickable starter prompts for symptoms, platelets, warning signs, food and tests.
- Starter prompts enter the existing chatbot submit pipeline, so emergency alerts, references, confidence and analytics continue to work.

## Task 45 — Most-asked questions analytics
- Retains the existing Top 50 question aggregation.
- Adds an Admin CSV export for aggregated popular-question, topic and feedback-reason data.
- The export does not include user IDs.

## Task 46 — Unanswered question report
- Adds a distinct report for unmatched/low-confidence questions or events without a matched question.
- Groups repeated wordings and shows the most common 30.
- Uses the latest 2,000 query events already loaded by the bounded analytics query.

## Task 47 — Poor match report
- Adds a separate report for weak non-low matches with a score below 55.
- Groups repeated questions and reports average match score.
- The text match score is not medical accuracy.

## Task 48 — User satisfaction analytics
- Adds rating totals and feedback-reason breakdown.
- Retains the 30-day helpful rate and Not Helpful question report.
- Uses explicit user feedback; no sentiment model is inferred.

## Task 49 — Topic-wise performance
- Extends existing topic counts and average match score.
- Adds low-match rate and helpful feedback rate per topic.
- Topics with no ratings show a dash rather than a fabricated score.

## Task 50 — Admin activity log
- Adds append-only `admin_activity_logs` collection.
- Records Admin UID/email, action, target, summary and timestamps.
- Logs key question-bank, bulk, import/rollback, source-registry, clinical-review, doctor-verification, appointment and application actions.
- Admin can view the latest 100 records.
- Firestore Rules permit Admin create/read only; update/delete are denied.
- If the log write fails, the main Admin action continues and an error is written to the browser console.

## Task 51 — Complete knowledge-base export
- Adds a JSON export bundle with the current Question Bank (including Admin status overlays), medical sources, import batches, question versions and limited clinical-review metadata.
- Excludes user chat history, user profiles, appointments, contact messages and clinician free-text notes.
- Existing JSON, CSV and Question Bank backup exports remain available.

## Task 52 — System health monitoring
- Adds an Admin-triggered and initial read-only check for network, secure context, Admin session, core chatbot modules and Firestore read access.
- Firestore probes are limited to one document per collection.
- Does not write health records to Firestore or run continuous polling.
- This is an availability/configuration check, not a penetration test or full observability system.

## Task 53 — Security, performance and release audit
- Adds `npm run audit:release` for static release checks.
- Checks append-only Admin logs, Admin role guard, bounded analytics/health reads, existing Firebase controls, browser-native speech and no paid AI API dependency.
- Adds manual deployment checklist below.

## Firestore Rules changes
New collection:
- `admin_activity_logs`: Admin-only create/read, strict field allowlist and size/type validation; update/delete denied.

All other existing rules in `firestore_rules_current.txt` are retained. Compare with the live Firebase Rules before publishing; merge production-only changes instead of overwriting blindly.

## Validation commands
```bash
npm run test:task40-53
npm run audit:release
npm run test:full
```
These local tests do not replace live Firebase Emulator/Rules testing or manual browser QA.

## Deployment checklist
1. Keep a copy of the currently hosted site and currently deployed Firestore Rules.
2. Run the three validation commands above.
3. Compare `firestore_rules_current.txt` with live Firebase Rules; merge the new `admin_activity_logs` rule without removing production-only rules.
4. Deploy the merged Firestore Rules.
5. Deploy the site files to the hosting/GitHub workflow.
6. Test microphone permission and speech recognition on HTTPS in Chrome; verify the transcript can be edited before sending.
7. Test Bengali text-to-speech on the target phone/computer; some devices may not include a Bengali speech voice.
8. Test the starter questions, mobile viewport, emergency detection and previous Task 29–39 features.
9. Open Admin → System Health Monitor; all required Firestore checks should pass.
10. Create a complete knowledge bundle export and verify that it downloads.
11. Perform a question edit, bulk action, source archive and reviewer assignment; confirm the Admin Activity Log records each action.
12. Do not advertise the chatbot as a diagnostic service or as a substitute for a clinician or emergency care.
