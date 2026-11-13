# Task 5 — Platelet & Blood Report Intelligence

## New Bangla/English intent answers
1. Low platelet count (including a 70,000 example)
2. Why platelets decrease
3. Platelet recovery
4. CBC report interpretation
5. Rising hematocrit / possible plasma leakage
6. NS1 positive and negative interpretation
7. IgM and IgG interpretation

## Medical safety rules
- Never classify dengue severity from platelet count alone.
- A low count should be interpreted by a clinician with symptoms, vital signs, hematocrit trend, bleeding and urine output.
- Do not advise self-directed platelet transfusion.
- NS1/NAAT are most useful in the first 0–7 days; a negative result does not rule out dengue.
- IgM usually becomes detectable around days 4–5 and may persist for months.
- A single positive IgG is not recommended to diagnose acute dengue.
- Rising hematocrit relative to baseline can suggest plasma leakage and needs clinical assessment.
- Emergency warning signs require urgent medical care.

## References
- CDC Clinical Testing Guidance: https://www.cdc.gov/dengue/hcp/diagnosis-testing/
- CDC NS1 Antigen Tests: https://www.cdc.gov/dengue/hcp/diagnosis-testing/dengue-virus-antigen-detection.html
- CDC Serologic Tests: https://www.cdc.gov/dengue/hcp/diagnosis-testing/serologic-tests-for-dengue-virus.html
- CDC Clinical Care: https://www.cdc.gov/dengue/hcp/clinical-care/

## Validation
Run:
`npm run test:platelet-reports`

The tests check answer routing for Bangla and English questions. This is a rule-based educational information layer, not a diagnostic report interpreter.
