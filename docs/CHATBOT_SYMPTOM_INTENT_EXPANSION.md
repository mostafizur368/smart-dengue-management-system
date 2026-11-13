# Dengue Chatbot — Symptoms Intent Expansion

Added separate local Bangla/English intent answers for:
- Fever management
- Fever duration
- Headache and pain behind the eyes
- Skin rash
- Nausea and vomiting

The existing 1,000-question bank, hybrid search, Top-15 display and body-pain intents are retained as fallback/related features.

Safety notes:
- Fever duration is described as variable; 2–7 days is a common range, not a guarantee.
- Persistent vomiting and bleeding-related signs prompt urgent assessment.
- Aspirin and NSAIDs are not recommended for self-medication in suspected dengue.
- Symptom matching does not diagnose dengue.

Validation:
`npm run test:symptom-intents`
