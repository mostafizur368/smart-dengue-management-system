# Task 8 — Warning Signs & Emergency Intelligence

## New Bangla/English intents
1. Dengue warning signs and immediate action
2. Critical phase around defervescence (when fever settles)
3. Dengue shock and symptoms
4. Bleeding during dengue
5. Reduced urine output
6. When hospital assessment/admission is needed

## UI behavior
The chatbot now prepends a visible emergency alert when a user message mentions a serious warning symptom such as severe abdominal pain, persistent vomiting, bleeding, black stool, breathing difficulty, cold clammy skin, fainting, unusual drowsiness or markedly reduced urine. The alert says not to wait for the chatbot if the symptom is happening now and to seek emergency care.

## Safety principles
- Do not use fever settling as proof of recovery; critical phase can begin around defervescence.
- Warning signs require urgent clinical assessment.
- Shock is a life-threatening emergency.
- No home treatment, forced oral fluids or self-directed IV fluids are recommended for shock.
- Hospital admission is a clinician decision based on clinical condition, risk factors and follow-up capacity.
- The alert is a safety prompt, not a diagnosis.

## References
- Bangladesh DGHS, National Guideline for Clinical Management of Dengue (5th Edition 2025):
  https://dghs.gov.bd/pages/static-pages/6922e05c933eb65569e26afe
- WHO Dengue and severe dengue:
  https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue
- CDC Clinical Care of Dengue:
  https://www.cdc.gov/dengue/hcp/clinical-care/

## Validation
Run:
`npm run test:emergency`

This is an educational rule-based chatbot, not an emergency service or diagnostic system. In a real emergency, users must contact local emergency services or go to a hospital.
