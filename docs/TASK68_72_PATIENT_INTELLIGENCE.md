# Batch 7 — Tasks 68–72: Patient Intelligence

## Scope
This release is cumulative from Batch 6 (Tasks 1–67) and adds five patient-facing features. It does not include the unfinished Tasks 73–92.

## Task 68 — Digital Medical History
- Patient can store known conditions, allergies, other medical notes and an emergency contact.
- The record is stored at `patient_medical_history/{auth.uid}`.
- Firestore Rules allow read/write/delete only to the matching signed-in patient.
- It is not automatically visible to Doctors or Admins.

## Task 69 — Lab Report OCR
- Accepts JPG, PNG and WebP images up to 8 MB.
- Tesseract.js runs in the browser and supports English or English + Bangla OCR.
- Extracts suggestions for platelet count, HCT, WBC and hemoglobin.
- Bengali numerals are normalized.
- Per-microlitre platelet/WBC values are converted to the dashboard's ×10⁹/L display unit only when the printed unit supports that conversion.
- Large count values without a clear unit are not auto-converted.
- The image is not uploaded to Firestore. The user must inspect the raw OCR text and original image, then explicitly apply suggestions. Nothing is saved until the existing blood-report form is submitted.
- OCR requires network access to load the Tesseract engine/language data. Recognition quality varies with image quality, language and layout.

## Task 70 — Medicine Schedule & Reminder
- Patient records a medicine name, exact clinician-prescribed instruction, schedule/frequency and a next reminder date/time.
- Reminders are one-time and patient-entered; the app does not prescribe, recommend doses, modify prescriptions or repeat reminders automatically.
- Browser notifications require explicit permission. The dashboard must remain open for the in-page timer/notification to fire; this is not background push notification.
- Patient-owned records are stored in `patient_medications`; Firestore Rules restrict access to the owner.

## Task 71 — Recovery Progress Timeline
- Merges saved symptom entries, blood reports and fluid logs into a newest-first timeline.
- Displays the patient's entered values only.
- It does not compute a recovery score, predict outcome, determine dengue severity or confirm recovery.

## Task 72 — PDF Health Report
- Generates a print-ready HTML report in a new tab, then the user chooses Print / Save as PDF.
- Includes private medical history, latest symptom entries, blood reports, hydration records and active medication reminders.
- Patient-entered text is HTML-escaped before display.
- The report is generated from the signed-in patient's own records and is not uploaded automatically.
- Includes a clear non-diagnostic disclaimer.

## Firebase / deployment notes
- Firebase JavaScript configuration and Authentication setup are unchanged.
- Firestore Rules **must be merged and deployed** before using Tasks 68 and 70 with live Firestore. This batch adds owner-only rules for `patient_medical_history` and `patient_medications`.
- Do not replace live Rules blindly. Back up the currently deployed Rules, merge the new blocks, then deploy.
- No paid AI API or new OCR cloud API was added.
- Tesseract.js is loaded from jsDelivr; the OCR engine/language files are fetched by the browser. The report image itself is processed in the browser and is not written to Firebase.

## Validation
```bash
npm run test:task68-72
npm run audit:release
npm run test:full
```

Automated tests cover OCR parsing/conversion, Bengali digits, ambiguous units, private owner rules, reminder permission flow, timeline ordering, PDF content and HTML escaping. They do not replace:
- Firebase Emulator Rules tests,
- browser/device testing of OCR, notifications and print-to-PDF,
- clinician review of wording and use in real patient care.

## Manual test checklist
1. Sign in as Patient A; save medical history; sign out.
2. Sign in as Patient B and confirm Patient A's history is not visible.
3. Upload a sample English and Bangla lab-report image; inspect OCR output and verify every value against the source.
4. Confirm OCR suggestions only populate the form after the Apply button, and save only after the user submits the blood-report form.
5. Add a test medicine reminder using dummy data; enable notifications only if desired; keep the dashboard open until the test time.
6. Check the timeline order using test symptom, report and fluid entries.
7. Generate the report, inspect the new tab, then use Print / Save as PDF.
