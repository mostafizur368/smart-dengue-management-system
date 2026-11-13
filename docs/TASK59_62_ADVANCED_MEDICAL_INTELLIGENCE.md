# Batch 5 — Tasks 59–62: Advanced Dengue Medical Intelligence

## Important implementation note
This batch does **not** add a generative medical AI model or a paid API. It adds transparent, deterministic clinical-support rules that summarize patient-entered information and link to authoritative public guidance. It does not diagnose dengue, grade severity, prescribe treatment or replace a clinician.

## Task 59 — Dengue Warning Sign Detection
- Extends chatbot warning-sign screening with additional WHO/CDC-aligned terms: severe abdominal pain, persistent vomiting, mucosal bleeding, fluid accumulation, lethargy/restlessness, fainting/postural dizziness, rapid breathing, pale/cold/clammy skin, markedly reduced urination, intense thirst and clinician-reported liver enlargement.
- Handles common explicit negation phrases in English and Bangla.
- Patient dashboard checks the patient's own saved symptom selections and notes.
- Additional warning-sign options are available in the daily symptom tracker.
- Past recorded warning signs are labelled as past entries; the app cannot know whether they are happening now.
- A present warning sign prompts urgent medical care; the tool does not calculate a score or diagnose.

## Task 60 — Blood Report Interpretation
- Uses the latest entered platelet, HCT, WBC and hemoglobin values.
- Compares the two latest dated records when available.
- Notes trends in plain language without generic normal/critical cut-offs.
- Flags the paired pattern of a higher HCT with a lower platelet count for prompt treating-clinician review. The app cannot verify the measurement interval, baseline, lab range or clinical context.
- A platelet decrease alone is explicitly not treated as a dengue severity diagnosis.
- The existing charts remain trend visualizations only.

## Task 61 — Source-Based Medical Answers
- Adds WHO's 4 July 2025 integrated arboviral clinical management guideline.
- Adds CDC Clinical Care of Dengue, updated 15 April 2026.
- Retains WHO Dengue and severe dengue and Bangladesh DGHS references.
- Chatbot reference links display publication dates when known and continue to disclose that source links do not mean the specific answer was clinician-verified.
- Clinician-reviewed answer status remains separate from source availability.
- This batch attaches relevant official reference links to the existing matched knowledge-base answers; it does not scrape the live source pages or implement live retrieval-augmented generation (RAG).

## Task 62 — AI-Assisted Patient Summary
- Generates a text summary from the signed-in patient's own loaded records: warning-sign-related entries, symptoms in the last 7 days, latest 5 blood reports, fluid logs and pending reminders.
- Includes a plain-language blood trend note and clear medical disclaimer.
- Adds Copy and Print actions.
- Summary is generated in the browser; it is not sent to an AI provider or stored in a new cloud collection.

## Clinical source basis
- WHO, *WHO guidelines for clinical management of arboviral diseases: dengue, chikungunya, Zika and yellow fever* (4 July 2025): https://www.who.int/publications/i/item/9789240111110
- CDC, *Clinical Care of Dengue* (15 April 2026): https://www.cdc.gov/dengue/hcp/clinical-care/index.html
- WHO, *Dengue and severe dengue*: https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue

The app's rules are conservative prompts for clinician review, not a validated clinical decision-support algorithm. In particular, the paired lab trend is not a diagnosis of plasma leakage. A clinician must interpret original reports, serial timing, vital signs and the patient's condition.

## Validation
```bash
npm run test:task59-62
npm run audit:release
npm run test:full
```

Static automated tests do not replace browser testing, Firebase Emulator Rules testing, clinician review, usability validation or regulatory assessment.

## Deployment
1. Back up the current repository and deployed Firestore Rules.
2. Run all validation commands.
3. Compare the updated `firestore_rules_current.txt` against deployed Rules; it extends the existing `symptom_logs` allowlist to accept the new warning-sign selections and raises the list cap to 30.
4. Deploy the merged Firestore Rules before the updated website files.
5. Test the patient dashboard with two separate test accounts and verify owner-only access remains enforced.
6. Test the chatbot warning prompts with positive and negated Bangla/English examples.
7. Have a qualified clinician review the warning-sign wording and report interpretation before real patient use.
