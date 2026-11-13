# Chatbot Intent Expansion — Body Pain

This update expands the original body-pain-cause intent into four distinct question intents:
- Cause: why body/muscle/joint pain occurs.
- Care: what to do when body pain occurs.
- Duration: how long the pain may last.
- Relief: ways to manage pain safely.
- Danger: whether pain alone is a warning sign.

Bangla and English phrase variants are supported. The existing generic Dengue Question Bank and retrieval flow remain as fallback for other topics.

Medical safety:
- Answers avoid promising an exact symptom duration.
- Pain severity alone is not presented as a dengue severity measure.
- Aspirin and NSAIDs such as ibuprofen/naproxen are not recommended for self-medication in suspected dengue due to bleeding risk.
- Emergency warning signs prompt urgent medical assessment.

Validation:
`npm run test:body-pain-intents`

This is a rule-based intent-answer layer, not a generative AI model. It is fully local and does not use paid APIs.
