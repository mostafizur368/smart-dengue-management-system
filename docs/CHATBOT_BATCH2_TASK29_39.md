# Batch 2 — Tasks 29–39

## Scope and preservation

This batch extends the supplied Task 18–28 project. Existing authentication, appointment flow, public doctor directory, question bank, analytics, Admin review queue and previous test suites are retained. No paid AI API or remote model dependency was added.

The new confidence score measures **text retrieval relevance only**. It is not a diagnosis, medical confidence score, or proof that an answer is clinically correct.

## Task 29 — Confidence-based response

- Calculates a relevance score from the existing ranked question search.
- Uses high, medium and low match bands; a small gap between close matches reduces confidence.
- Low-confidence matches are not returned as guessed answers; the chatbot asks the user to rephrase or consult a clinician.
- The interface explicitly says that a text-match score is not medical certainty.

## Task 30 — Suggested follow-up questions

- Adds up to three clickable follow-up prompts based on the matched topic.
- Supports Bangla and English prompt sets for symptoms, platelets, medicine, tests, warning signs, food, prevention, recovery and general questions.
- Follow-ups are not shown when no dengue question was matched.

## Task 31 — Medical answer verification / safety audit

- Adds a deterministic content audit for missing bilingual answers, specific medicine quantities, unsafe NSAID mentions without a caution, and warning-sign answers without urgent-care direction.
- Admin can run the audit from Question Bank.
- High-risk flagged answers are blocked from active publishing through manual save, individual approve/restore, bulk approve/restore, community-question approval, answer correction publishing and bulk import.
- Automated checks never label an answer clinically verified. Only an approved clinician review record can do that.

## Task 32 — Medical source and reference management

- Adds a reference registry with local fallback links to DGHS Bangladesh, CDC and WHO sources.
- Admin can add HTTPS links from the allowlisted DGHS, CDC, WHO and NCBI domains, associate topics, set a review due date, and archive custom links.
- Question Bank entries can store up to ten source IDs; the editor, CSV import and export preserve them.
- Chatbot answers show related links and clearly explain that a reference link does not itself prove that the specific answer was reviewed.

## Task 33 — Emergency symptom detection

- Detects selected dengue warning signals in Bangla, English and common Banglish: severe abdominal pain, persistent vomiting, bleeding, breathing difficulty, reduced urine, fainting/shock and altered mental state.
- Handles common negation and contrast wording, for example "no bleeding but severe abdominal pain".
- Active signals produce an accessible emergency alert advising immediate hospital assessment, not a diagnosis.

## Task 34 — Medicine safety warning

- Adds prompts for NSAIDs/aspirin, paracetamol, antibiotics, steroids, anticoagulants, pediatric dosing and pregnancy-related medicine questions.
- Does not prescribe, calculate a personalized dose, or instruct a patient to stop prescribed anticoagulants.
- Existing medicine answer bank content remains in place; the new alert is an additional safety layer.

## Task 35 — Doctor recommendation

- Chatbot recommendations use only profiles explicitly marked `chatbotVerified: true`, with `status: approved` and a BMDC registration number.
- Admin must confirm that the credentials were checked against an official source before enabling this flag.
- Fake placeholder doctors were removed from the seeded directory list. The public directory now loads actual `public_doctors` records; Admin-created doctor profiles create an unverified public profile.
- Emergency signals bypass appointment recommendations and advise immediate emergency-department care.

## Task 36 — Outdated information detection

- Clinician approvals are tied to an answer fingerprint. If the answer text changes, the old approval no longer matches.
- Clinician-approved reviews receive a 180-day review due date.
- Overdue reviews and changed answers are labelled outdated in the chatbot.
- Source registry entries can also have a review due date; overdue source links are labelled.

## Task 37 — Clinician review workflow

- Admin can enable an existing doctor account as a clinical reviewer (`users/{uid}.clinicalReviewer = true`).
- Admin can send a Question Bank entry to an assigned reviewer.
- Reviewer sees the source question, Bangla/English answer and attached references in the Doctor Dashboard.
- Reviewer must enter clinical notes and select at least one source before approving.
- Decisions: approved, needs revision, rejected.
- Reviewer cannot edit or publish the answer. Admin must separately update/publish content.
- Public chatbot only reads approved review records; pending reviews are visible only to Admin and the assigned reviewer.

## Task 38 — Local chat history

- Adds a visible opt-in checkbox. It is off by default.
- If enabled, the last 50 text messages are stored in this browser's local storage only; no cloud sync is added.
- User can clear saved history. Turning the option off clears the saved history.
- The UI warns users not to enter identifying details. Existing question analytics remain a separate Firestore feature from Task 15/28.

## Task 39 — Structured user feedback

- Not Helpful feedback can include one reason: inaccurate, irrelevant, unclear, outdated, safety concern or other.
- Optional comments are capped at 300 characters.
- Reason and comment are saved with the feedback and answer-issue review record and displayed in Admin.
- Existing Helpful / Not Helpful ratings remain available.

## Firestore collections and rules

New or extended collections:

- `medical_sources`: active links are public-read; Admin manages records.
- `chatbot_clinical_reviews`: Admin creates/reads; assigned reviewers can read and update only review-decision fields; public users can read approved reviews.
- `chatbot_feedback` and `chatbot_answer_issues`: accept bounded feedback reason/comment fields.
- `public_doctors`: Admin-created profiles include `status: approved` and `chatbotVerified: false` until credentials are checked.

`firestore_rules_current.txt` contains the project's current Task 1–39 rules. Compare it with the actually deployed Firebase Rules before publishing; do not overwrite any newer production rules blindly.

## Local validation

- `npm run test:task29-39` — 42/42 Batch 2 checks pass.
- `npm run test:full` — 21/21 full test suites pass, including Tasks 1–28.
- JavaScript module syntax checks pass.
- Admin HTML duplicate-ID and referenced-control checks pass.

These are local automated checks. They do not replace a live Firebase Rules/emulator test, browser QA on the hosted site, credential checks against BMDC, or review of each medical answer by a qualified clinician.

## Deployment checklist

1. Back up the hosted site and the currently deployed Firestore Rules.
2. Compare `firestore_rules_current.txt` with live Rules, merge any production-only rules, then publish the reviewed result.
3. Install dependencies with `npm install` and run `npm run test:full` locally.
4. Deploy the updated site files only after browser testing.
5. In Admin → Medical Source Registry, check the official links and add any current local references required by the clinicians.
6. In Admin → Doctor Management, create doctor profiles. In Chatbot Doctor Verification, manually confirm BMDC registration and enable recommendation only for verified profiles.
7. In Admin → Clinician Review Workflow, enable an existing doctor account as a reviewer. Open Question Bank and send relevant answers for review.
8. Verify that a reviewer can only see their assigned tasks, approve with references, and that the public chatbot labels only fingerprint-matching approved answers as clinician-reviewed.
9. Test emergency negation cases, medicine warnings, local-history opt-in/clear, and feedback reason submission.

Do not represent the chatbot as a diagnostic service or replace emergency care with an appointment recommendation.
