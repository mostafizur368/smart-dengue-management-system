// ===== Free Dengue Question Bank =====
// 1,000 question phrasings across 10 topics.
// Bangla input returns Bangla; English input returns English.
// This is rule-based matching, not an AI or diagnostic system.

const dengueQuestionBank = [
    {
        "topic": "symptoms",
        "questions": [
            "ডেঙ্গুর লক্ষণ কী?",
            "ডেঙ্গুর লক্ষণ হলে কী করব?",
            "ডেঙ্গুর লক্ষণ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর লক্ষণ কেন হয়?",
            "ডেঙ্গুর লক্ষণ হলে কী সতর্কতা দরকার?",
            "What is dengue symptoms?",
            "What should I do about dengue symptoms?",
            "Tell me about dengue symptoms.",
            "Why does dengue symptoms happen?",
            "What precautions are needed for dengue symptoms?",
            "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ কী?",
            "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ হলে কী করব?",
            "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ সম্পর্কে জানতে চাই।",
            "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ কেন হয়?",
            "ডেঙ্গু জ্বরের প্রাথমিক লক্ষণ হলে কী সতর্কতা দরকার?",
            "What is early signs of dengue?",
            "What should I do about early signs of dengue?",
            "Tell me about early signs of dengue.",
            "Why does early signs of dengue happen?",
            "What precautions are needed for early signs of dengue?",
            "ডেঙ্গুতে মাথাব্যথা কী?",
            "ডেঙ্গুতে মাথাব্যথা হলে কী করব?",
            "ডেঙ্গুতে মাথাব্যথা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে মাথাব্যথা কেন হয়?",
            "ডেঙ্গুতে মাথাব্যথা হলে কী সতর্কতা দরকার?",
            "What is headache in dengue?",
            "What should I do about headache in dengue?",
            "Tell me about headache in dengue.",
            "Why does headache in dengue happen?",
            "What precautions are needed for headache in dengue?",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা কী?",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা হলে কী করব?",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা কেন হয়?",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা হলে কী সতর্কতা দরকার?",
            "What is pain behind the eyes in dengue?",
            "What should I do about pain behind the eyes in dengue?",
            "Tell me about pain behind the eyes in dengue.",
            "Why does pain behind the eyes in dengue happen?",
            "What precautions are needed for pain behind the eyes in dengue?",
            "ডেঙ্গুতে শরীর ব্যথা কী?",
            "ডেঙ্গুতে শরীর ব্যথা হলে কী করব?",
            "ডেঙ্গুতে শরীর ব্যথা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে শরীর ব্যথা কেন হয়?",
            "ডেঙ্গুতে শরীর ব্যথা হলে কী সতর্কতা দরকার?",
            "What is body pain in dengue?",
            "What should I do about body pain in dengue?",
            "Tell me about body pain in dengue.",
            "Why does body pain in dengue happen?",
            "What precautions are needed for body pain in dengue?",
            "ডেঙ্গুতে বমি বমি ভাব কী?",
            "ডেঙ্গুতে বমি বমি ভাব হলে কী করব?",
            "ডেঙ্গুতে বমি বমি ভাব সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে বমি বমি ভাব কেন হয়?",
            "ডেঙ্গুতে বমি বমি ভাব হলে কী সতর্কতা দরকার?",
            "What is nausea during dengue?",
            "What should I do about nausea during dengue?",
            "Tell me about nausea during dengue.",
            "Why does nausea during dengue happen?",
            "What precautions are needed for nausea during dengue?",
            "ডেঙ্গুতে ত্বকে র‍্যাশ কী?",
            "ডেঙ্গুতে ত্বকে র‍্যাশ হলে কী করব?",
            "ডেঙ্গুতে ত্বকে র‍্যাশ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ত্বকে র‍্যাশ কেন হয়?",
            "ডেঙ্গুতে ত্বকে র‍্যাশ হলে কী সতর্কতা দরকার?",
            "What is skin rash in dengue?",
            "What should I do about skin rash in dengue?",
            "Tell me about skin rash in dengue.",
            "Why does skin rash in dengue happen?",
            "What precautions are needed for skin rash in dengue?",
            "ডেঙ্গুতে উচ্চ জ্বর কী?",
            "ডেঙ্গুতে উচ্চ জ্বর হলে কী করব?",
            "ডেঙ্গুতে উচ্চ জ্বর সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে উচ্চ জ্বর কেন হয়?",
            "ডেঙ্গুতে উচ্চ জ্বর হলে কী সতর্কতা দরকার?",
            "What is high fever in dengue?",
            "What should I do about high fever in dengue?",
            "Tell me about high fever in dengue.",
            "Why does high fever in dengue happen?",
            "What precautions are needed for high fever in dengue?",
            "ডেঙ্গুতে দুর্বলতা কী?",
            "ডেঙ্গুতে দুর্বলতা হলে কী করব?",
            "ডেঙ্গুতে দুর্বলতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে দুর্বলতা কেন হয়?",
            "ডেঙ্গুতে দুর্বলতা হলে কী সতর্কতা দরকার?",
            "What is weakness during dengue?",
            "What should I do about weakness during dengue?",
            "Tell me about weakness during dengue.",
            "Why does weakness during dengue happen?",
            "What precautions are needed for weakness during dengue?",
            "ডেঙ্গুতে ক্ষুধামন্দা কী?",
            "ডেঙ্গুতে ক্ষুধামন্দা হলে কী করব?",
            "ডেঙ্গুতে ক্ষুধামন্দা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ক্ষুধামন্দা কেন হয়?",
            "ডেঙ্গুতে ক্ষুধামন্দা হলে কী সতর্কতা দরকার?",
            "What is loss of appetite in dengue?",
            "What should I do about loss of appetite in dengue?",
            "Tell me about loss of appetite in dengue.",
            "Why does loss of appetite in dengue happen?",
            "What precautions are needed for loss of appetite in dengue?"
        ],
        "answerBn": "ডেঙ্গুর সাধারণ লক্ষণগুলোর মধ্যে হঠাৎ জ্বর, মাথাব্যথা, চোখের পেছনে ব্যথা, পেশি ও জয়েন্টে ব্যথা, বমি বমি ভাব এবং ত্বকে র‍্যাশ থাকতে পারে। শুধু লক্ষণ দেখে ডেঙ্গু নিশ্চিত করা যায় না।",
        "answerEn": "Common dengue symptoms include sudden fever, headache, pain behind the eyes, muscle and joint pain, nausea and skin rash. Symptoms alone cannot confirm dengue."
    },
    {
        "topic": "prevention",
        "questions": [
            "ডেঙ্গু প্রতিরোধ কী?",
            "ডেঙ্গু প্রতিরোধ হলে কী করব?",
            "ডেঙ্গু প্রতিরোধ সম্পর্কে জানতে চাই।",
            "ডেঙ্গু প্রতিরোধ কেন হয়?",
            "ডেঙ্গু প্রতিরোধ হলে কী সতর্কতা দরকার?",
            "What is dengue prevention?",
            "What should I do about dengue prevention?",
            "Tell me about dengue prevention.",
            "Why does dengue prevention happen?",
            "What precautions are needed for dengue prevention?",
            "মশার কামড় থেকে বাঁচা কী?",
            "মশার কামড় থেকে বাঁচা হলে কী করব?",
            "মশার কামড় থেকে বাঁচা সম্পর্কে জানতে চাই।",
            "মশার কামড় থেকে বাঁচা কেন হয়?",
            "মশার কামড় থেকে বাঁচা হলে কী সতর্কতা দরকার?",
            "What is preventing mosquito bites?",
            "What should I do about preventing mosquito bites?",
            "Tell me about preventing mosquito bites.",
            "Why does preventing mosquito bites happen?",
            "What precautions are needed for preventing mosquito bites?",
            "এডিস মশা নিয়ন্ত্রণ কী?",
            "এডিস মশা নিয়ন্ত্রণ হলে কী করব?",
            "এডিস মশা নিয়ন্ত্রণ সম্পর্কে জানতে চাই।",
            "এডিস মশা নিয়ন্ত্রণ কেন হয়?",
            "এডিস মশা নিয়ন্ত্রণ হলে কী সতর্কতা দরকার?",
            "What is Aedes mosquito control?",
            "What should I do about Aedes mosquito control?",
            "Tell me about Aedes mosquito control.",
            "Why does Aedes mosquito control happen?",
            "What precautions are needed for Aedes mosquito control?",
            "বাড়ির আশপাশে জমে থাকা পানি কী?",
            "বাড়ির আশপাশে জমে থাকা পানি হলে কী করব?",
            "বাড়ির আশপাশে জমে থাকা পানি সম্পর্কে জানতে চাই।",
            "বাড়ির আশপাশে জমে থাকা পানি কেন হয়?",
            "বাড়ির আশপাশে জমে থাকা পানি হলে কী সতর্কতা দরকার?",
            "What is standing water around the home?",
            "What should I do about standing water around the home?",
            "Tell me about standing water around the home.",
            "Why does standing water around the home happen?",
            "What precautions are needed for standing water around the home?",
            "মশারি ব্যবহার কী?",
            "মশারি ব্যবহার হলে কী করব?",
            "মশারি ব্যবহার সম্পর্কে জানতে চাই।",
            "মশারি ব্যবহার কেন হয়?",
            "মশারি ব্যবহার হলে কী সতর্কতা দরকার?",
            "What is using mosquito nets?",
            "What should I do about using mosquito nets?",
            "Tell me about using mosquito nets.",
            "Why does using mosquito nets happen?",
            "What precautions are needed for using mosquito nets?",
            "মশা তাড়ানোর উপকরণ কী?",
            "মশা তাড়ানোর উপকরণ হলে কী করব?",
            "মশা তাড়ানোর উপকরণ সম্পর্কে জানতে চাই।",
            "মশা তাড়ানোর উপকরণ কেন হয়?",
            "মশা তাড়ানোর উপকরণ হলে কী সতর্কতা দরকার?",
            "What is using mosquito repellent?",
            "What should I do about using mosquito repellent?",
            "Tell me about using mosquito repellent.",
            "Why does using mosquito repellent happen?",
            "What precautions are needed for using mosquito repellent?",
            "পানির পাত্র ঢেকে রাখা কী?",
            "পানির পাত্র ঢেকে রাখা হলে কী করব?",
            "পানির পাত্র ঢেকে রাখা সম্পর্কে জানতে চাই।",
            "পানির পাত্র ঢেকে রাখা কেন হয়?",
            "পানির পাত্র ঢেকে রাখা হলে কী সতর্কতা দরকার?",
            "What is covering water containers?",
            "What should I do about covering water containers?",
            "Tell me about covering water containers.",
            "Why does covering water containers happen?",
            "What precautions are needed for covering water containers?",
            "ফুলের টবে মশার বংশবিস্তার কী?",
            "ফুলের টবে মশার বংশবিস্তার হলে কী করব?",
            "ফুলের টবে মশার বংশবিস্তার সম্পর্কে জানতে চাই।",
            "ফুলের টবে মশার বংশবিস্তার কেন হয়?",
            "ফুলের টবে মশার বংশবিস্তার হলে কী সতর্কতা দরকার?",
            "What is mosquito breeding in flower pots?",
            "What should I do about mosquito breeding in flower pots?",
            "Tell me about mosquito breeding in flower pots.",
            "Why does mosquito breeding in flower pots happen?",
            "What precautions are needed for mosquito breeding in flower pots?",
            "ডেঙ্গু মৌসুমে সতর্কতা কী?",
            "ডেঙ্গু মৌসুমে সতর্কতা হলে কী করব?",
            "ডেঙ্গু মৌসুমে সতর্কতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গু মৌসুমে সতর্কতা কেন হয়?",
            "ডেঙ্গু মৌসুমে সতর্কতা হলে কী সতর্কতা দরকার?",
            "What is dengue season precautions?",
            "What should I do about dengue season precautions?",
            "Tell me about dengue season precautions.",
            "Why does dengue season precautions happen?",
            "What precautions are needed for dengue season precautions?",
            "পরিবেশ পরিষ্কার রাখা কী?",
            "পরিবেশ পরিষ্কার রাখা হলে কী করব?",
            "পরিবেশ পরিষ্কার রাখা সম্পর্কে জানতে চাই।",
            "পরিবেশ পরিষ্কার রাখা কেন হয়?",
            "পরিবেশ পরিষ্কার রাখা হলে কী সতর্কতা দরকার?",
            "What is keeping surroundings clean?",
            "What should I do about keeping surroundings clean?",
            "Tell me about keeping surroundings clean.",
            "Why does keeping surroundings clean happen?",
            "What precautions are needed for keeping surroundings clean?"
        ],
        "answerBn": "ডেঙ্গু প্রতিরোধে জমে থাকা পানি সরিয়ে ফেলুন, পানির পাত্র ঢেকে রাখুন, মশারি ও মশা তাড়ানোর উপকরণ ব্যবহার করুন এবং লম্বা হাতার পোশাক পরুন। বাড়ির আশপাশ নিয়মিত পরিষ্কার রাখুন।",
        "answerEn": "Prevent dengue by removing standing water, covering water containers, using mosquito nets and repellents, wearing long sleeves, and keeping the surroundings clean."
    },
    {
        "topic": "tests",
        "questions": [
            "ডেঙ্গু পরীক্ষা কী?",
            "ডেঙ্গু পরীক্ষা হলে কী করব?",
            "ডেঙ্গু পরীক্ষা সম্পর্কে জানতে চাই।",
            "ডেঙ্গু পরীক্ষা কেন হয়?",
            "ডেঙ্গু পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is dengue testing?",
            "What should I do about dengue testing?",
            "Tell me about dengue testing.",
            "Why does dengue testing happen?",
            "What precautions are needed for dengue testing?",
            "NS1 পরীক্ষা কী?",
            "NS1 পরীক্ষা হলে কী করব?",
            "NS1 পরীক্ষা সম্পর্কে জানতে চাই।",
            "NS1 পরীক্ষা কেন হয়?",
            "NS1 পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is NS1 test?",
            "What should I do about NS1 test?",
            "Tell me about NS1 test.",
            "Why does NS1 test happen?",
            "What precautions are needed for NS1 test?",
            "IgM পরীক্ষা কী?",
            "IgM পরীক্ষা হলে কী করব?",
            "IgM পরীক্ষা সম্পর্কে জানতে চাই।",
            "IgM পরীক্ষা কেন হয়?",
            "IgM পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is IgM test?",
            "What should I do about IgM test?",
            "Tell me about IgM test.",
            "Why does IgM test happen?",
            "What precautions are needed for IgM test?",
            "IgG পরীক্ষা কী?",
            "IgG পরীক্ষা হলে কী করব?",
            "IgG পরীক্ষা সম্পর্কে জানতে চাই।",
            "IgG পরীক্ষা কেন হয়?",
            "IgG পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is IgG test?",
            "What should I do about IgG test?",
            "Tell me about IgG test.",
            "Why does IgG test happen?",
            "What precautions are needed for IgG test?",
            "CBC পরীক্ষা কী?",
            "CBC পরীক্ষা হলে কী করব?",
            "CBC পরীক্ষা সম্পর্কে জানতে চাই।",
            "CBC পরীক্ষা কেন হয়?",
            "CBC পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is CBC test?",
            "What should I do about CBC test?",
            "Tell me about CBC test.",
            "Why does CBC test happen?",
            "What precautions are needed for CBC test?",
            "ডেঙ্গু পরীক্ষার সময় কী?",
            "ডেঙ্গু পরীক্ষার সময় হলে কী করব?",
            "ডেঙ্গু পরীক্ষার সময় সম্পর্কে জানতে চাই।",
            "ডেঙ্গু পরীক্ষার সময় কেন হয়?",
            "ডেঙ্গু পরীক্ষার সময় হলে কী সতর্কতা দরকার?",
            "What is timing of dengue tests?",
            "What should I do about timing of dengue tests?",
            "Tell me about timing of dengue tests.",
            "Why does timing of dengue tests happen?",
            "What precautions are needed for timing of dengue tests?",
            "ডেঙ্গু রিপোর্ট বোঝা কী?",
            "ডেঙ্গু রিপোর্ট বোঝা হলে কী করব?",
            "ডেঙ্গু রিপোর্ট বোঝা সম্পর্কে জানতে চাই।",
            "ডেঙ্গু রিপোর্ট বোঝা কেন হয়?",
            "ডেঙ্গু রিপোর্ট বোঝা হলে কী সতর্কতা দরকার?",
            "What is understanding a dengue report?",
            "What should I do about understanding a dengue report?",
            "Tell me about understanding a dengue report.",
            "Why does understanding a dengue report happen?",
            "What precautions are needed for understanding a dengue report?",
            "হেমাটোক্রিট পরীক্ষা কী?",
            "হেমাটোক্রিট পরীক্ষা হলে কী করব?",
            "হেমাটোক্রিট পরীক্ষা সম্পর্কে জানতে চাই।",
            "হেমাটোক্রিট পরীক্ষা কেন হয়?",
            "হেমাটোক্রিট পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is hematocrit test?",
            "What should I do about hematocrit test?",
            "Tell me about hematocrit test.",
            "Why does hematocrit test happen?",
            "What precautions are needed for hematocrit test?",
            "ডেঙ্গুতে ফলোআপ পরীক্ষা কী?",
            "ডেঙ্গুতে ফলোআপ পরীক্ষা হলে কী করব?",
            "ডেঙ্গুতে ফলোআপ পরীক্ষা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ফলোআপ পরীক্ষা কেন হয়?",
            "ডেঙ্গুতে ফলোআপ পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is follow-up tests for dengue?",
            "What should I do about follow-up tests for dengue?",
            "Tell me about follow-up tests for dengue.",
            "Why does follow-up tests for dengue happen?",
            "What precautions are needed for follow-up tests for dengue?",
            "NS1 নেগেটিভ ফল কী?",
            "NS1 নেগেটিভ ফল হলে কী করব?",
            "NS1 নেগেটিভ ফল সম্পর্কে জানতে চাই।",
            "NS1 নেগেটিভ ফল কেন হয়?",
            "NS1 নেগেটিভ ফল হলে কী সতর্কতা দরকার?",
            "What is negative NS1 result?",
            "What should I do about negative NS1 result?",
            "Tell me about negative NS1 result.",
            "Why does negative NS1 result happen?",
            "What precautions are needed for negative NS1 result?"
        ],
        "answerBn": "ডেঙ্গু নির্ণয় ও পর্যবেক্ষণে চিকিৎসক NS1, IgM এবং CBC-সহ প্রয়োজনীয় পরীক্ষা দিতে পারেন। পরীক্ষার সময় রোগের কোন দিনে আছেন তার ওপর নির্ভর করে। রিপোর্ট চিকিৎসককে দেখান।",
        "answerEn": "A clinician may use tests such as NS1, IgM and CBC to diagnose or monitor dengue. The appropriate test depends on the stage of illness. Show your results to a healthcare professional."
    },
    {
        "topic": "platelets",
        "questions": [
            "ডেঙ্গুতে প্লাটিলেট কমে যাওয়া কী?",
            "ডেঙ্গুতে প্লাটিলেট কমে যাওয়া হলে কী করব?",
            "ডেঙ্গুতে প্লাটিলেট কমে যাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে প্লাটিলেট কমে যাওয়া কেন হয়?",
            "ডেঙ্গুতে প্লাটিলেট কমে যাওয়া হলে কী সতর্কতা দরকার?",
            "What is low platelets in dengue?",
            "What should I do about low platelets in dengue?",
            "Tell me about low platelets in dengue.",
            "Why does low platelets in dengue happen?",
            "What precautions are needed for low platelets in dengue?",
            "প্লাটিলেটের স্বাভাবিক মাত্রা কী?",
            "প্লাটিলেটের স্বাভাবিক মাত্রা হলে কী করব?",
            "প্লাটিলেটের স্বাভাবিক মাত্রা সম্পর্কে জানতে চাই।",
            "প্লাটিলেটের স্বাভাবিক মাত্রা কেন হয়?",
            "প্লাটিলেটের স্বাভাবিক মাত্রা হলে কী সতর্কতা দরকার?",
            "What is normal platelet count?",
            "What should I do about normal platelet count?",
            "Tell me about normal platelet count.",
            "Why does normal platelet count happen?",
            "What precautions are needed for normal platelet count?",
            "প্লাটিলেট কমলে করণীয় কী?",
            "প্লাটিলেট কমলে করণীয় হলে কী করব?",
            "প্লাটিলেট কমলে করণীয় সম্পর্কে জানতে চাই।",
            "প্লাটিলেট কমলে করণীয় কেন হয়?",
            "প্লাটিলেট কমলে করণীয় হলে কী সতর্কতা দরকার?",
            "What is what to do when platelets are low?",
            "What should I do about what to do when platelets are low?",
            "Tell me about what to do when platelets are low.",
            "Why does what to do when platelets are low happen?",
            "What precautions are needed for what to do when platelets are low?",
            "প্লাটিলেট ও রোগের তীব্রতা কী?",
            "প্লাটিলেট ও রোগের তীব্রতা হলে কী করব?",
            "প্লাটিলেট ও রোগের তীব্রতা সম্পর্কে জানতে চাই।",
            "প্লাটিলেট ও রোগের তীব্রতা কেন হয়?",
            "প্লাটিলেট ও রোগের তীব্রতা হলে কী সতর্কতা দরকার?",
            "What is platelets and dengue severity?",
            "What should I do about platelets and dengue severity?",
            "Tell me about platelets and dengue severity.",
            "Why does platelets and dengue severity happen?",
            "What precautions are needed for platelets and dengue severity?",
            "প্লাটিলেট পরীক্ষা কী?",
            "প্লাটিলেট পরীক্ষা হলে কী করব?",
            "প্লাটিলেট পরীক্ষা সম্পর্কে জানতে চাই।",
            "প্লাটিলেট পরীক্ষা কেন হয়?",
            "প্লাটিলেট পরীক্ষা হলে কী সতর্কতা দরকার?",
            "What is platelet testing?",
            "What should I do about platelet testing?",
            "Tell me about platelet testing.",
            "Why does platelet testing happen?",
            "What precautions are needed for platelet testing?",
            "প্লাটিলেট বাড়ানোর খাবার কী?",
            "প্লাটিলেট বাড়ানোর খাবার হলে কী করব?",
            "প্লাটিলেট বাড়ানোর খাবার সম্পর্কে জানতে চাই।",
            "প্লাটিলেট বাড়ানোর খাবার কেন হয়?",
            "প্লাটিলেট বাড়ানোর খাবার হলে কী সতর্কতা দরকার?",
            "What is foods to increase platelets?",
            "What should I do about foods to increase platelets?",
            "Tell me about foods to increase platelets.",
            "Why does foods to increase platelets happen?",
            "What precautions are needed for foods to increase platelets?",
            "প্লাটিলেট ট্রান্সফিউশন কী?",
            "প্লাটিলেট ট্রান্সফিউশন হলে কী করব?",
            "প্লাটিলেট ট্রান্সফিউশন সম্পর্কে জানতে চাই।",
            "প্লাটিলেট ট্রান্সফিউশন কেন হয়?",
            "প্লাটিলেট ট্রান্সফিউশন হলে কী সতর্কতা দরকার?",
            "What is platelet transfusion?",
            "What should I do about platelet transfusion?",
            "Tell me about platelet transfusion.",
            "Why does platelet transfusion happen?",
            "What precautions are needed for platelet transfusion?",
            "প্লাটিলেট কমার কারণ কী?",
            "প্লাটিলেট কমার কারণ হলে কী করব?",
            "প্লাটিলেট কমার কারণ সম্পর্কে জানতে চাই।",
            "প্লাটিলেট কমার কারণ কেন হয়?",
            "প্লাটিলেট কমার কারণ হলে কী সতর্কতা দরকার?",
            "What is reasons for low platelets?",
            "What should I do about reasons for low platelets?",
            "Tell me about reasons for low platelets.",
            "Why does reasons for low platelets happen?",
            "What precautions are needed for reasons for low platelets?",
            "প্লাটিলেট কমার লক্ষণ কী?",
            "প্লাটিলেট কমার লক্ষণ হলে কী করব?",
            "প্লাটিলেট কমার লক্ষণ সম্পর্কে জানতে চাই।",
            "প্লাটিলেট কমার লক্ষণ কেন হয়?",
            "প্লাটিলেট কমার লক্ষণ হলে কী সতর্কতা দরকার?",
            "What is signs of low platelets?",
            "What should I do about signs of low platelets?",
            "Tell me about signs of low platelets.",
            "Why does signs of low platelets happen?",
            "What precautions are needed for signs of low platelets?",
            "প্লাটিলেট রিপোর্ট কী?",
            "প্লাটিলেট রিপোর্ট হলে কী করব?",
            "প্লাটিলেট রিপোর্ট সম্পর্কে জানতে চাই।",
            "প্লাটিলেট রিপোর্ট কেন হয়?",
            "প্লাটিলেট রিপোর্ট হলে কী সতর্কতা দরকার?",
            "What is platelet report?",
            "What should I do about platelet report?",
            "Tell me about platelet report.",
            "Why does platelet report happen?",
            "What precautions are needed for platelet report?"
        ],
        "answerBn": "ডেঙ্গুতে প্লাটিলেট কমতে পারে, তবে শুধু প্লাটিলেটের সংখ্যা দিয়ে রোগের তীব্রতা নির্ধারণ করা যায় না। রক্তপাত, হেমাটোক্রিট, পানিশূন্যতা ও সামগ্রিক অবস্থা গুরুত্বপূর্ণ। নিজে থেকে প্লাটিলেট বাড়ানোর চিকিৎসা নেবেন না।",
        "answerEn": "Platelets may fall in dengue, but the platelet count alone does not determine severity. Bleeding, hematocrit, hydration and overall condition matter. Do not self-treat to raise platelets."
    },
    {
        "topic": "food",
        "questions": [
            "ডেঙ্গুতে খাবার কী?",
            "ডেঙ্গুতে খাবার হলে কী করব?",
            "ডেঙ্গুতে খাবার সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে খাবার কেন হয়?",
            "ডেঙ্গুতে খাবার হলে কী সতর্কতা দরকার?",
            "What is food during dengue?",
            "What should I do about food during dengue?",
            "Tell me about food during dengue.",
            "Why does food during dengue happen?",
            "What precautions are needed for food during dengue?",
            "ডেঙ্গুতে ডাবের পানি কী?",
            "ডেঙ্গুতে ডাবের পানি হলে কী করব?",
            "ডেঙ্গুতে ডাবের পানি সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ডাবের পানি কেন হয়?",
            "ডেঙ্গুতে ডাবের পানি হলে কী সতর্কতা দরকার?",
            "What is coconut water during dengue?",
            "What should I do about coconut water during dengue?",
            "Tell me about coconut water during dengue.",
            "Why does coconut water during dengue happen?",
            "What precautions are needed for coconut water during dengue?",
            "ডেঙ্গুতে পানি পান কী?",
            "ডেঙ্গুতে পানি পান হলে কী করব?",
            "ডেঙ্গুতে পানি পান সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে পানি পান কেন হয়?",
            "ডেঙ্গুতে পানি পান হলে কী সতর্কতা দরকার?",
            "What is fluid intake during dengue?",
            "What should I do about fluid intake during dengue?",
            "Tell me about fluid intake during dengue.",
            "Why does fluid intake during dengue happen?",
            "What precautions are needed for fluid intake during dengue?",
            "ডেঙ্গুতে ORS কী?",
            "ডেঙ্গুতে ORS হলে কী করব?",
            "ডেঙ্গুতে ORS সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ORS কেন হয়?",
            "ডেঙ্গুতে ORS হলে কী সতর্কতা দরকার?",
            "What is ORS during dengue?",
            "What should I do about ORS during dengue?",
            "Tell me about ORS during dengue.",
            "Why does ORS during dengue happen?",
            "What precautions are needed for ORS during dengue?",
            "ডেঙ্গুতে ফল খাওয়া কী?",
            "ডেঙ্গুতে ফল খাওয়া হলে কী করব?",
            "ডেঙ্গুতে ফল খাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ফল খাওয়া কেন হয়?",
            "ডেঙ্গুতে ফল খাওয়া হলে কী সতর্কতা দরকার?",
            "What is eating fruits during dengue?",
            "What should I do about eating fruits during dengue?",
            "Tell me about eating fruits during dengue.",
            "Why does eating fruits during dengue happen?",
            "What precautions are needed for eating fruits during dengue?",
            "ডেঙ্গুতে ভাত খাওয়া কী?",
            "ডেঙ্গুতে ভাত খাওয়া হলে কী করব?",
            "ডেঙ্গুতে ভাত খাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ভাত খাওয়া কেন হয়?",
            "ডেঙ্গুতে ভাত খাওয়া হলে কী সতর্কতা দরকার?",
            "What is eating rice during dengue?",
            "What should I do about eating rice during dengue?",
            "Tell me about eating rice during dengue.",
            "Why does eating rice during dengue happen?",
            "What precautions are needed for eating rice during dengue?",
            "ডেঙ্গুতে স্যুপ খাওয়া কী?",
            "ডেঙ্গুতে স্যুপ খাওয়া হলে কী করব?",
            "ডেঙ্গুতে স্যুপ খাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে স্যুপ খাওয়া কেন হয়?",
            "ডেঙ্গুতে স্যুপ খাওয়া হলে কী সতর্কতা দরকার?",
            "What is eating soup during dengue?",
            "What should I do about eating soup during dengue?",
            "Tell me about eating soup during dengue.",
            "Why does eating soup during dengue happen?",
            "What precautions are needed for eating soup during dengue?",
            "ডেঙ্গুতে ক্ষুধা কমে যাওয়া কী?",
            "ডেঙ্গুতে ক্ষুধা কমে যাওয়া হলে কী করব?",
            "ডেঙ্গুতে ক্ষুধা কমে যাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ক্ষুধা কমে যাওয়া কেন হয়?",
            "ডেঙ্গুতে ক্ষুধা কমে যাওয়া হলে কী সতর্কতা দরকার?",
            "What is poor appetite during dengue?",
            "What should I do about poor appetite during dengue?",
            "Tell me about poor appetite during dengue.",
            "Why does poor appetite during dengue happen?",
            "What precautions are needed for poor appetite during dengue?",
            "ডেঙ্গুতে পানিশূন্যতা কী?",
            "ডেঙ্গুতে পানিশূন্যতা হলে কী করব?",
            "ডেঙ্গুতে পানিশূন্যতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে পানিশূন্যতা কেন হয়?",
            "ডেঙ্গুতে পানিশূন্যতা হলে কী সতর্কতা দরকার?",
            "What is dehydration during dengue?",
            "What should I do about dehydration during dengue?",
            "Tell me about dehydration during dengue.",
            "Why does dehydration during dengue happen?",
            "What precautions are needed for dehydration during dengue?",
            "ডেঙ্গুতে পুষ্টিকর খাবার কী?",
            "ডেঙ্গুতে পুষ্টিকর খাবার হলে কী করব?",
            "ডেঙ্গুতে পুষ্টিকর খাবার সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে পুষ্টিকর খাবার কেন হয়?",
            "ডেঙ্গুতে পুষ্টিকর খাবার হলে কী সতর্কতা দরকার?",
            "What is nutritious food during dengue?",
            "What should I do about nutritious food during dengue?",
            "Tell me about nutritious food during dengue.",
            "Why does nutritious food during dengue happen?",
            "What precautions are needed for nutritious food during dengue?"
        ],
        "answerBn": "ডেঙ্গুতে পর্যাপ্ত তরল পান করা এবং পুষ্টিকর, সহজে হজম হয় এমন খাবার খাওয়া সহায়ক। ক্ষুধা কম থাকলে অল্প অল্প করে খান। ORS বা অন্য তরল কতটা প্রয়োজন তা চিকিৎসকের পরামর্শ অনুযায়ী ঠিক করুন।",
        "answerEn": "During dengue, adequate fluids and nutritious, easily digestible foods can help. Eat small portions if appetite is poor. Follow medical advice about ORS and fluid needs."
    },
    {
        "topic": "medicine",
        "questions": [
            "ডেঙ্গুতে ওষুধ কী?",
            "ডেঙ্গুতে ওষুধ হলে কী করব?",
            "ডেঙ্গুতে ওষুধ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ওষুধ কেন হয়?",
            "ডেঙ্গুতে ওষুধ হলে কী সতর্কতা দরকার?",
            "What is medicine for dengue?",
            "What should I do about medicine for dengue?",
            "Tell me about medicine for dengue.",
            "Why does medicine for dengue happen?",
            "What precautions are needed for medicine for dengue?",
            "ডেঙ্গুতে প্যারাসিটামল কী?",
            "ডেঙ্গুতে প্যারাসিটামল হলে কী করব?",
            "ডেঙ্গুতে প্যারাসিটামল সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে প্যারাসিটামল কেন হয়?",
            "ডেঙ্গুতে প্যারাসিটামল হলে কী সতর্কতা দরকার?",
            "What is paracetamol for dengue?",
            "What should I do about paracetamol for dengue?",
            "Tell me about paracetamol for dengue.",
            "Why does paracetamol for dengue happen?",
            "What precautions are needed for paracetamol for dengue?",
            "ডেঙ্গুতে aspirin কী?",
            "ডেঙ্গুতে aspirin হলে কী করব?",
            "ডেঙ্গুতে aspirin সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে aspirin কেন হয়?",
            "ডেঙ্গুতে aspirin হলে কী সতর্কতা দরকার?",
            "What is aspirin in dengue?",
            "What should I do about aspirin in dengue?",
            "Tell me about aspirin in dengue.",
            "Why does aspirin in dengue happen?",
            "What precautions are needed for aspirin in dengue?",
            "ডেঙ্গুতে ibuprofen কী?",
            "ডেঙ্গুতে ibuprofen হলে কী করব?",
            "ডেঙ্গুতে ibuprofen সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ibuprofen কেন হয়?",
            "ডেঙ্গুতে ibuprofen হলে কী সতর্কতা দরকার?",
            "What is ibuprofen in dengue?",
            "What should I do about ibuprofen in dengue?",
            "Tell me about ibuprofen in dengue.",
            "Why does ibuprofen in dengue happen?",
            "What precautions are needed for ibuprofen in dengue?",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক কী?",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক হলে কী করব?",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক কেন হয়?",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক হলে কী সতর্কতা দরকার?",
            "What is antibiotics for dengue?",
            "What should I do about antibiotics for dengue?",
            "Tell me about antibiotics for dengue.",
            "Why does antibiotics for dengue happen?",
            "What precautions are needed for antibiotics for dengue?",
            "ডেঙ্গুতে জ্বরের ওষুধ কী?",
            "ডেঙ্গুতে জ্বরের ওষুধ হলে কী করব?",
            "ডেঙ্গুতে জ্বরের ওষুধ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে জ্বরের ওষুধ কেন হয়?",
            "ডেঙ্গুতে জ্বরের ওষুধ হলে কী সতর্কতা দরকার?",
            "What is fever medicine during dengue?",
            "What should I do about fever medicine during dengue?",
            "Tell me about fever medicine during dengue.",
            "Why does fever medicine during dengue happen?",
            "What precautions are needed for fever medicine during dengue?",
            "ডেঙ্গুতে ব্যথার ওষুধ কী?",
            "ডেঙ্গুতে ব্যথার ওষুধ হলে কী করব?",
            "ডেঙ্গুতে ব্যথার ওষুধ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ব্যথার ওষুধ কেন হয়?",
            "ডেঙ্গুতে ব্যথার ওষুধ হলে কী সতর্কতা দরকার?",
            "What is pain medicine during dengue?",
            "What should I do about pain medicine during dengue?",
            "Tell me about pain medicine during dengue.",
            "Why does pain medicine during dengue happen?",
            "What precautions are needed for pain medicine during dengue?",
            "ডেঙ্গুতে নিজে ওষুধ খাওয়া কী?",
            "ডেঙ্গুতে নিজে ওষুধ খাওয়া হলে কী করব?",
            "ডেঙ্গুতে নিজে ওষুধ খাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে নিজে ওষুধ খাওয়া কেন হয়?",
            "ডেঙ্গুতে নিজে ওষুধ খাওয়া হলে কী সতর্কতা দরকার?",
            "What is self-medication for dengue?",
            "What should I do about self-medication for dengue?",
            "Tell me about self-medication for dengue.",
            "Why does self-medication for dengue happen?",
            "What precautions are needed for self-medication for dengue?",
            "ডেঙ্গুতে ওষুধের ডোজ কী?",
            "ডেঙ্গুতে ওষুধের ডোজ হলে কী করব?",
            "ডেঙ্গুতে ওষুধের ডোজ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ওষুধের ডোজ কেন হয়?",
            "ডেঙ্গুতে ওষুধের ডোজ হলে কী সতর্কতা দরকার?",
            "What is medicine dosage in dengue?",
            "What should I do about medicine dosage in dengue?",
            "Tell me about medicine dosage in dengue.",
            "Why does medicine dosage in dengue happen?",
            "What precautions are needed for medicine dosage in dengue?",
            "ডেঙ্গুতে স্টেরয়েড কী?",
            "ডেঙ্গুতে স্টেরয়েড হলে কী করব?",
            "ডেঙ্গুতে স্টেরয়েড সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে স্টেরয়েড কেন হয়?",
            "ডেঙ্গুতে স্টেরয়েড হলে কী সতর্কতা দরকার?",
            "What is steroids in dengue?",
            "What should I do about steroids in dengue?",
            "Tell me about steroids in dengue.",
            "Why does steroids in dengue happen?",
            "What precautions are needed for steroids in dengue?"
        ],
        "answerBn": "ডেঙ্গু সন্দেহ হলে চিকিৎসকের পরামর্শ ছাড়া ওষুধ খাবেন না। জ্বরের জন্য Paracetamol উপযুক্ত হতে পারে, তবে ডোজ চিকিৎসকের নির্দেশ অনুযায়ী নিন। Aspirin ও Ibuprofen এড়িয়ে চলুন, কারণ রক্তপাতের ঝুঁকি বাড়তে পারে।",
        "answerEn": "If dengue is suspected, do not take medicines without medical advice. Paracetamol may be appropriate for fever when taken as directed by a clinician. Avoid aspirin and ibuprofen because they can increase bleeding risk."
    },
    {
        "topic": "recovery",
        "questions": [
            "ডেঙ্গু থেকে সুস্থ হওয়া কী?",
            "ডেঙ্গু থেকে সুস্থ হওয়া হলে কী করব?",
            "ডেঙ্গু থেকে সুস্থ হওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গু থেকে সুস্থ হওয়া কেন হয়?",
            "ডেঙ্গু থেকে সুস্থ হওয়া হলে কী সতর্কতা দরকার?",
            "What is recovering from dengue?",
            "What should I do about recovering from dengue?",
            "Tell me about recovering from dengue.",
            "Why does recovering from dengue happen?",
            "What precautions are needed for recovering from dengue?",
            "ডেঙ্গুতে বিশ্রাম কী?",
            "ডেঙ্গুতে বিশ্রাম হলে কী করব?",
            "ডেঙ্গুতে বিশ্রাম সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে বিশ্রাম কেন হয়?",
            "ডেঙ্গুতে বিশ্রাম হলে কী সতর্কতা দরকার?",
            "What is rest during dengue?",
            "What should I do about rest during dengue?",
            "Tell me about rest during dengue.",
            "Why does rest during dengue happen?",
            "What precautions are needed for rest during dengue?",
            "ডেঙ্গুর পর দুর্বলতা কী?",
            "ডেঙ্গুর পর দুর্বলতা হলে কী করব?",
            "ডেঙ্গুর পর দুর্বলতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর পর দুর্বলতা কেন হয়?",
            "ডেঙ্গুর পর দুর্বলতা হলে কী সতর্কতা দরকার?",
            "What is weakness after dengue?",
            "What should I do about weakness after dengue?",
            "Tell me about weakness after dengue.",
            "Why does weakness after dengue happen?",
            "What precautions are needed for weakness after dengue?",
            "ডেঙ্গু থেকে সেরে উঠতে সময় কী?",
            "ডেঙ্গু থেকে সেরে উঠতে সময় হলে কী করব?",
            "ডেঙ্গু থেকে সেরে উঠতে সময় সম্পর্কে জানতে চাই।",
            "ডেঙ্গু থেকে সেরে উঠতে সময় কেন হয়?",
            "ডেঙ্গু থেকে সেরে উঠতে সময় হলে কী সতর্কতা দরকার?",
            "What is dengue recovery time?",
            "What should I do about dengue recovery time?",
            "Tell me about dengue recovery time.",
            "Why does dengue recovery time happen?",
            "What precautions are needed for dengue recovery time?",
            "জ্বর কমার পর যত্ন কী?",
            "জ্বর কমার পর যত্ন হলে কী করব?",
            "জ্বর কমার পর যত্ন সম্পর্কে জানতে চাই।",
            "জ্বর কমার পর যত্ন কেন হয়?",
            "জ্বর কমার পর যত্ন হলে কী সতর্কতা দরকার?",
            "What is care after fever subsides?",
            "What should I do about care after fever subsides?",
            "Tell me about care after fever subsides.",
            "Why does care after fever subsides happen?",
            "What precautions are needed for care after fever subsides?",
            "ডেঙ্গুর পর কাজে ফেরা কী?",
            "ডেঙ্গুর পর কাজে ফেরা হলে কী করব?",
            "ডেঙ্গুর পর কাজে ফেরা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর পর কাজে ফেরা কেন হয়?",
            "ডেঙ্গুর পর কাজে ফেরা হলে কী সতর্কতা দরকার?",
            "What is returning to work after dengue?",
            "What should I do about returning to work after dengue?",
            "Tell me about returning to work after dengue.",
            "Why does returning to work after dengue happen?",
            "What precautions are needed for returning to work after dengue?",
            "ডেঙ্গুর পর ব্যায়াম কী?",
            "ডেঙ্গুর পর ব্যায়াম হলে কী করব?",
            "ডেঙ্গুর পর ব্যায়াম সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর পর ব্যায়াম কেন হয়?",
            "ডেঙ্গুর পর ব্যায়াম হলে কী সতর্কতা দরকার?",
            "What is exercise after dengue?",
            "What should I do about exercise after dengue?",
            "Tell me about exercise after dengue.",
            "Why does exercise after dengue happen?",
            "What precautions are needed for exercise after dengue?",
            "ডেঙ্গুতে ঘুম কী?",
            "ডেঙ্গুতে ঘুম হলে কী করব?",
            "ডেঙ্গুতে ঘুম সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ঘুম কেন হয়?",
            "ডেঙ্গুতে ঘুম হলে কী সতর্কতা দরকার?",
            "What is sleep during dengue?",
            "What should I do about sleep during dengue?",
            "Tell me about sleep during dengue.",
            "Why does sleep during dengue happen?",
            "What precautions are needed for sleep during dengue?",
            "ডেঙ্গুর পর ফলোআপ কী?",
            "ডেঙ্গুর পর ফলোআপ হলে কী করব?",
            "ডেঙ্গুর পর ফলোআপ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর পর ফলোআপ কেন হয়?",
            "ডেঙ্গুর পর ফলোআপ হলে কী সতর্কতা দরকার?",
            "What is follow-up after dengue?",
            "What should I do about follow-up after dengue?",
            "Tell me about follow-up after dengue.",
            "Why does follow-up after dengue happen?",
            "What precautions are needed for follow-up after dengue?",
            "ডেঙ্গুতে বাড়িতে যত্ন কী?",
            "ডেঙ্গুতে বাড়িতে যত্ন হলে কী করব?",
            "ডেঙ্গুতে বাড়িতে যত্ন সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে বাড়িতে যত্ন কেন হয়?",
            "ডেঙ্গুতে বাড়িতে যত্ন হলে কী সতর্কতা দরকার?",
            "What is home care for dengue?",
            "What should I do about home care for dengue?",
            "Tell me about home care for dengue.",
            "Why does home care for dengue happen?",
            "What precautions are needed for home care for dengue?"
        ],
        "answerBn": "পর্যাপ্ত বিশ্রাম নিন, তরল পান করুন এবং চিকিৎসকের নির্দেশ অনুযায়ী ফলো-আপ করুন। জ্বর কমে গেলেও সতর্ক থাকুন, কারণ বিপদের লক্ষণ জ্বর কমার সময়ও দেখা দিতে পারে।",
        "answerEn": "Rest, drink adequate fluids and follow your clinician's follow-up advice. Stay alert even after fever subsides, as warning signs can appear around that time."
    },
    {
        "topic": "warning",
        "questions": [
            "ডেঙ্গুর বিপদের লক্ষণ কী?",
            "ডেঙ্গুর বিপদের লক্ষণ হলে কী করব?",
            "ডেঙ্গুর বিপদের লক্ষণ সম্পর্কে জানতে চাই।",
            "ডেঙ্গুর বিপদের লক্ষণ কেন হয়?",
            "ডেঙ্গুর বিপদের লক্ষণ হলে কী সতর্কতা দরকার?",
            "What is dengue warning signs?",
            "What should I do about dengue warning signs?",
            "Tell me about dengue warning signs.",
            "Why does dengue warning signs happen?",
            "What precautions are needed for dengue warning signs?",
            "ডেঙ্গুতে তীব্র পেটব্যথা কী?",
            "ডেঙ্গুতে তীব্র পেটব্যথা হলে কী করব?",
            "ডেঙ্গুতে তীব্র পেটব্যথা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে তীব্র পেটব্যথা কেন হয়?",
            "ডেঙ্গুতে তীব্র পেটব্যথা হলে কী সতর্কতা দরকার?",
            "What is severe abdominal pain in dengue?",
            "What should I do about severe abdominal pain in dengue?",
            "Tell me about severe abdominal pain in dengue.",
            "Why does severe abdominal pain in dengue happen?",
            "What precautions are needed for severe abdominal pain in dengue?",
            "ডেঙ্গুতে বারবার বমি কী?",
            "ডেঙ্গুতে বারবার বমি হলে কী করব?",
            "ডেঙ্গুতে বারবার বমি সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে বারবার বমি কেন হয়?",
            "ডেঙ্গুতে বারবার বমি হলে কী সতর্কতা দরকার?",
            "What is persistent vomiting in dengue?",
            "What should I do about persistent vomiting in dengue?",
            "Tell me about persistent vomiting in dengue.",
            "Why does persistent vomiting in dengue happen?",
            "What precautions are needed for persistent vomiting in dengue?",
            "ডেঙ্গুতে রক্তপাত কী?",
            "ডেঙ্গুতে রক্তপাত হলে কী করব?",
            "ডেঙ্গুতে রক্তপাত সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে রক্তপাত কেন হয়?",
            "ডেঙ্গুতে রক্তপাত হলে কী সতর্কতা দরকার?",
            "What is bleeding in dengue?",
            "What should I do about bleeding in dengue?",
            "Tell me about bleeding in dengue.",
            "Why does bleeding in dengue happen?",
            "What precautions are needed for bleeding in dengue?",
            "ডেঙ্গুতে শ্বাসকষ্ট কী?",
            "ডেঙ্গুতে শ্বাসকষ্ট হলে কী করব?",
            "ডেঙ্গুতে শ্বাসকষ্ট সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে শ্বাসকষ্ট কেন হয়?",
            "ডেঙ্গুতে শ্বাসকষ্ট হলে কী সতর্কতা দরকার?",
            "What is difficulty breathing in dengue?",
            "What should I do about difficulty breathing in dengue?",
            "Tell me about difficulty breathing in dengue.",
            "Why does difficulty breathing in dengue happen?",
            "What precautions are needed for difficulty breathing in dengue?",
            "ডেঙ্গুতে অতিরিক্ত দুর্বলতা কী?",
            "ডেঙ্গুতে অতিরিক্ত দুর্বলতা হলে কী করব?",
            "ডেঙ্গুতে অতিরিক্ত দুর্বলতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে অতিরিক্ত দুর্বলতা কেন হয়?",
            "ডেঙ্গুতে অতিরিক্ত দুর্বলতা হলে কী সতর্কতা দরকার?",
            "What is extreme weakness in dengue?",
            "What should I do about extreme weakness in dengue?",
            "Tell me about extreme weakness in dengue.",
            "Why does extreme weakness in dengue happen?",
            "What precautions are needed for extreme weakness in dengue?",
            "ডেঙ্গুতে ঝিমুনি কী?",
            "ডেঙ্গুতে ঝিমুনি হলে কী করব?",
            "ডেঙ্গুতে ঝিমুনি সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে ঝিমুনি কেন হয়?",
            "ডেঙ্গুতে ঝিমুনি হলে কী সতর্কতা দরকার?",
            "What is drowsiness in dengue?",
            "What should I do about drowsiness in dengue?",
            "Tell me about drowsiness in dengue.",
            "Why does drowsiness in dengue happen?",
            "What precautions are needed for drowsiness in dengue?",
            "জ্বর কমার পর বিপদ কী?",
            "জ্বর কমার পর বিপদ হলে কী করব?",
            "জ্বর কমার পর বিপদ সম্পর্কে জানতে চাই।",
            "জ্বর কমার পর বিপদ কেন হয়?",
            "জ্বর কমার পর বিপদ হলে কী সতর্কতা দরকার?",
            "What is danger after fever subsides?",
            "What should I do about danger after fever subsides?",
            "Tell me about danger after fever subsides.",
            "Why does danger after fever subsides happen?",
            "What precautions are needed for danger after fever subsides?",
            "ডেঙ্গুতে প্রস্রাব কমে যাওয়া কী?",
            "ডেঙ্গুতে প্রস্রাব কমে যাওয়া হলে কী করব?",
            "ডেঙ্গুতে প্রস্রাব কমে যাওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে প্রস্রাব কমে যাওয়া কেন হয়?",
            "ডেঙ্গুতে প্রস্রাব কমে যাওয়া হলে কী সতর্কতা দরকার?",
            "What is reduced urination in dengue?",
            "What should I do about reduced urination in dengue?",
            "Tell me about reduced urination in dengue.",
            "Why does reduced urination in dengue happen?",
            "What precautions are needed for reduced urination in dengue?",
            "ডেঙ্গুতে অস্থিরতা কী?",
            "ডেঙ্গুতে অস্থিরতা হলে কী করব?",
            "ডেঙ্গুতে অস্থিরতা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে অস্থিরতা কেন হয়?",
            "ডেঙ্গুতে অস্থিরতা হলে কী সতর্কতা দরকার?",
            "What is restlessness in dengue?",
            "What should I do about restlessness in dengue?",
            "Tell me about restlessness in dengue.",
            "Why does restlessness in dengue happen?",
            "What precautions are needed for restlessness in dengue?"
        ],
        "answerBn": "তীব্র পেটব্যথা, বারবার বমি, নাক বা মাড়ি দিয়ে রক্তপাত, বমি বা পায়খানায় রক্ত, শ্বাসকষ্ট, অস্বাভাবিক ঝিমুনি বা অস্থিরতা হলে অবিলম্বে জরুরি চিকিৎসা নিন।",
        "answerEn": "Seek urgent medical care for severe abdominal pain, persistent vomiting, nose or gum bleeding, blood in vomit or stool, difficulty breathing, unusual drowsiness or restlessness."
    },
    {
        "topic": "transmission",
        "questions": [
            "ডেঙ্গু কীভাবে ছড়ায় কী?",
            "ডেঙ্গু কীভাবে ছড়ায় হলে কী করব?",
            "ডেঙ্গু কীভাবে ছড়ায় সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কীভাবে ছড়ায় কেন হয়?",
            "ডেঙ্গু কীভাবে ছড়ায় হলে কী সতর্কতা দরকার?",
            "What is how dengue spreads?",
            "What should I do about how dengue spreads?",
            "Tell me about how dengue spreads.",
            "Why does how dengue spreads happen?",
            "What precautions are needed for how dengue spreads?",
            "এডিস মশার কামড় কী?",
            "এডিস মশার কামড় হলে কী করব?",
            "এডিস মশার কামড় সম্পর্কে জানতে চাই।",
            "এডিস মশার কামড় কেন হয়?",
            "এডিস মশার কামড় হলে কী সতর্কতা দরকার?",
            "What is Aedes mosquito bite?",
            "What should I do about Aedes mosquito bite?",
            "Tell me about Aedes mosquito bite.",
            "Why does Aedes mosquito bite happen?",
            "What precautions are needed for Aedes mosquito bite?",
            "ডেঙ্গু কি ছোঁয়াচে কী?",
            "ডেঙ্গু কি ছোঁয়াচে হলে কী করব?",
            "ডেঙ্গু কি ছোঁয়াচে সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কি ছোঁয়াচে কেন হয়?",
            "ডেঙ্গু কি ছোঁয়াচে হলে কী সতর্কতা দরকার?",
            "What is is dengue contagious?",
            "What should I do about is dengue contagious?",
            "Tell me about is dengue contagious.",
            "Why does is dengue contagious happen?",
            "What precautions are needed for is dengue contagious?",
            "ডেঙ্গু মানুষ থেকে মানুষে ছড়ায় কি কী?",
            "ডেঙ্গু মানুষ থেকে মানুষে ছড়ায় কি হলে কী করব?",
            "ডেঙ্গু মানুষ থেকে মানুষে ছড়ায় কি সম্পর্কে জানতে চাই।",
            "ডেঙ্গু মানুষ থেকে মানুষে ছড়ায় কি কেন হয়?",
            "ডেঙ্গু মানুষ থেকে মানুষে ছড়ায় কি হলে কী সতর্কতা দরকার?",
            "What is person-to-person dengue transmission?",
            "What should I do about person-to-person dengue transmission?",
            "Tell me about person-to-person dengue transmission.",
            "Why does person-to-person dengue transmission happen?",
            "What precautions are needed for person-to-person dengue transmission?",
            "এডিস মশার প্রজনন কী?",
            "এডিস মশার প্রজনন হলে কী করব?",
            "এডিস মশার প্রজনন সম্পর্কে জানতে চাই।",
            "এডিস মশার প্রজনন কেন হয়?",
            "এডিস মশার প্রজনন হলে কী সতর্কতা দরকার?",
            "What is Aedes mosquito breeding?",
            "What should I do about Aedes mosquito breeding?",
            "Tell me about Aedes mosquito breeding.",
            "Why does Aedes mosquito breeding happen?",
            "What precautions are needed for Aedes mosquito breeding?",
            "এডিস মশা কোথায় থাকে কী?",
            "এডিস মশা কোথায় থাকে হলে কী করব?",
            "এডিস মশা কোথায় থাকে সম্পর্কে জানতে চাই।",
            "এডিস মশা কোথায় থাকে কেন হয়?",
            "এডিস মশা কোথায় থাকে হলে কী সতর্কতা দরকার?",
            "What is where Aedes mosquitoes live?",
            "What should I do about where Aedes mosquitoes live?",
            "Tell me about where Aedes mosquitoes live.",
            "Why does where Aedes mosquitoes live happen?",
            "What precautions are needed for where Aedes mosquitoes live?",
            "ডেঙ্গুতে মশার ভূমিকা কী?",
            "ডেঙ্গুতে মশার ভূমিকা হলে কী করব?",
            "ডেঙ্গুতে মশার ভূমিকা সম্পর্কে জানতে চাই।",
            "ডেঙ্গুতে মশার ভূমিকা কেন হয়?",
            "ডেঙ্গুতে মশার ভূমিকা হলে কী সতর্কতা দরকার?",
            "What is role of mosquitoes in dengue?",
            "What should I do about role of mosquitoes in dengue?",
            "Tell me about role of mosquitoes in dengue.",
            "Why does role of mosquitoes in dengue happen?",
            "What precautions are needed for role of mosquitoes in dengue?",
            "ডেঙ্গু দ্বিতীয়বার হওয়া কী?",
            "ডেঙ্গু দ্বিতীয়বার হওয়া হলে কী করব?",
            "ডেঙ্গু দ্বিতীয়বার হওয়া সম্পর্কে জানতে চাই।",
            "ডেঙ্গু দ্বিতীয়বার হওয়া কেন হয়?",
            "ডেঙ্গু দ্বিতীয়বার হওয়া হলে কী সতর্কতা দরকার?",
            "What is getting dengue a second time?",
            "What should I do about getting dengue a second time?",
            "Tell me about getting dengue a second time.",
            "Why does getting dengue a second time happen?",
            "What precautions are needed for getting dengue a second time?",
            "ডেঙ্গু কাশি হাঁচিতে ছড়ায় কি কী?",
            "ডেঙ্গু কাশি হাঁচিতে ছড়ায় কি হলে কী করব?",
            "ডেঙ্গু কাশি হাঁচিতে ছড়ায় কি সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কাশি হাঁচিতে ছড়ায় কি কেন হয়?",
            "ডেঙ্গু কাশি হাঁচিতে ছড়ায় কি হলে কী সতর্কতা দরকার?",
            "What is dengue spread by cough or sneeze?",
            "What should I do about dengue spread by cough or sneeze?",
            "Tell me about dengue spread by cough or sneeze.",
            "Why does dengue spread by cough or sneeze happen?",
            "What precautions are needed for dengue spread by cough or sneeze?",
            "ডেঙ্গু খাবার পানিতে ছড়ায় কি কী?",
            "ডেঙ্গু খাবার পানিতে ছড়ায় কি হলে কী করব?",
            "ডেঙ্গু খাবার পানিতে ছড়ায় কি সম্পর্কে জানতে চাই।",
            "ডেঙ্গু খাবার পানিতে ছড়ায় কি কেন হয়?",
            "ডেঙ্গু খাবার পানিতে ছড়ায় কি হলে কী সতর্কতা দরকার?",
            "What is dengue spread through food or water?",
            "What should I do about dengue spread through food or water?",
            "Tell me about dengue spread through food or water.",
            "Why does dengue spread through food or water happen?",
            "What precautions are needed for dengue spread through food or water?"
        ],
        "answerBn": "ডেঙ্গু মূলত সংক্রমিত এডিস মশার কামড়ে ছড়ায়। সাধারণত কাশি, হাঁচি, খাবার বা পাশে থাকার মাধ্যমে সরাসরি একজন থেকে আরেকজনে ছড়ায় না।",
        "answerEn": "Dengue is mainly spread through the bite of an infected Aedes mosquito. It is not normally transmitted directly through coughing, sneezing, food or casual contact."
    },
    {
        "topic": "general",
        "questions": [
            "ডেঙ্গু কী কী?",
            "ডেঙ্গু কী হলে কী করব?",
            "ডেঙ্গু কী সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কী কেন হয়?",
            "ডেঙ্গু কী হলে কী সতর্কতা দরকার?",
            "What is what is dengue?",
            "What should I do about what is dengue?",
            "Tell me about what is dengue.",
            "Why does what is dengue happen?",
            "What precautions are needed for what is dengue?",
            "ডেঙ্গু জ্বর কী কী?",
            "ডেঙ্গু জ্বর কী হলে কী করব?",
            "ডেঙ্গু জ্বর কী সম্পর্কে জানতে চাই।",
            "ডেঙ্গু জ্বর কী কেন হয়?",
            "ডেঙ্গু জ্বর কী হলে কী সতর্কতা দরকার?",
            "What is what is dengue fever?",
            "What should I do about what is dengue fever?",
            "Tell me about what is dengue fever.",
            "Why does what is dengue fever happen?",
            "What precautions are needed for what is dengue fever?",
            "ডেঙ্গু কেন হয় কী?",
            "ডেঙ্গু কেন হয় হলে কী করব?",
            "ডেঙ্গু কেন হয় সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কেন হয় কেন হয়?",
            "ডেঙ্গু কেন হয় হলে কী সতর্কতা দরকার?",
            "What is why does dengue happen?",
            "What should I do about why does dengue happen?",
            "Tell me about why does dengue happen.",
            "Why does why does dengue happen happen?",
            "What precautions are needed for why does dengue happen?",
            "ডেঙ্গু কতটা বিপজ্জনক কী?",
            "ডেঙ্গু কতটা বিপজ্জনক হলে কী করব?",
            "ডেঙ্গু কতটা বিপজ্জনক সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কতটা বিপজ্জনক কেন হয়?",
            "ডেঙ্গু কতটা বিপজ্জনক হলে কী সতর্কতা দরকার?",
            "What is how dangerous is dengue?",
            "What should I do about how dangerous is dengue?",
            "Tell me about how dangerous is dengue.",
            "Why does how dangerous is dengue happen?",
            "What precautions are needed for how dangerous is dengue?",
            "ডেঙ্গু হলে কী করা উচিত কী?",
            "ডেঙ্গু হলে কী করা উচিত হলে কী করব?",
            "ডেঙ্গু হলে কী করা উচিত সম্পর্কে জানতে চাই।",
            "ডেঙ্গু হলে কী করা উচিত কেন হয়?",
            "ডেঙ্গু হলে কী করা উচিত হলে কী সতর্কতা দরকার?",
            "What is what should I do if I have dengue?",
            "What should I do about what should I do if I have dengue?",
            "Tell me about what should I do if I have dengue.",
            "Why does what should I do if I have dengue happen?",
            "What precautions are needed for what should I do if I have dengue?",
            "ডেঙ্গু কি ভাইরাসজনিত রোগ কী?",
            "ডেঙ্গু কি ভাইরাসজনিত রোগ হলে কী করব?",
            "ডেঙ্গু কি ভাইরাসজনিত রোগ সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কি ভাইরাসজনিত রোগ কেন হয়?",
            "ডেঙ্গু কি ভাইরাসজনিত রোগ হলে কী সতর্কতা দরকার?",
            "What is is dengue a viral disease?",
            "What should I do about is dengue a viral disease?",
            "Tell me about is dengue a viral disease.",
            "Why does is dengue a viral disease happen?",
            "What precautions are needed for is dengue a viral disease?",
            "ডেঙ্গু কত প্রকার কী?",
            "ডেঙ্গু কত প্রকার হলে কী করব?",
            "ডেঙ্গু কত প্রকার সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কত প্রকার কেন হয়?",
            "ডেঙ্গু কত প্রকার হলে কী সতর্কতা দরকার?",
            "What is types of dengue?",
            "What should I do about types of dengue?",
            "Tell me about types of dengue.",
            "Why does types of dengue happen?",
            "What precautions are needed for types of dengue?",
            "ডেঙ্গু কি দ্বিতীয়বার হতে পারে কী?",
            "ডেঙ্গু কি দ্বিতীয়বার হতে পারে হলে কী করব?",
            "ডেঙ্গু কি দ্বিতীয়বার হতে পারে সম্পর্কে জানতে চাই।",
            "ডেঙ্গু কি দ্বিতীয়বার হতে পারে কেন হয়?",
            "ডেঙ্গু কি দ্বিতীয়বার হতে পারে হলে কী সতর্কতা দরকার?",
            "What is can dengue happen a second time?",
            "What should I do about can dengue happen a second time?",
            "Tell me about can dengue happen a second time.",
            "Why does can dengue happen a second time happen?",
            "What precautions are needed for can dengue happen a second time?",
            "ডেঙ্গু হলে কাকে দেখাব কী?",
            "ডেঙ্গু হলে কাকে দেখাব হলে কী করব?",
            "ডেঙ্গু হলে কাকে দেখাব সম্পর্কে জানতে চাই।",
            "ডেঙ্গু হলে কাকে দেখাব কেন হয়?",
            "ডেঙ্গু হলে কাকে দেখাব হলে কী সতর্কতা দরকার?",
            "What is which doctor treats dengue?",
            "What should I do about which doctor treats dengue?",
            "Tell me about which doctor treats dengue.",
            "Why does which doctor treats dengue happen?",
            "What precautions are needed for which doctor treats dengue?",
            "ডেঙ্গু সম্পর্কে প্রাথমিক তথ্য কী?",
            "ডেঙ্গু সম্পর্কে প্রাথমিক তথ্য হলে কী করব?",
            "ডেঙ্গু সম্পর্কে প্রাথমিক তথ্য সম্পর্কে জানতে চাই।",
            "ডেঙ্গু সম্পর্কে প্রাথমিক তথ্য কেন হয়?",
            "ডেঙ্গু সম্পর্কে প্রাথমিক তথ্য হলে কী সতর্কতা দরকার?",
            "What is basic information about dengue?",
            "What should I do about basic information about dengue?",
            "Tell me about basic information about dengue.",
            "Why does basic information about dengue happen?",
            "What precautions are needed for basic information about dengue?"
        ],
        "answerBn": "ডেঙ্গু হলো মশাবাহিত ভাইরাসজনিত রোগ। সন্দেহ হলে চিকিৎসকের পরামর্শ নিন, প্রয়োজনীয় পরীক্ষা করান এবং পর্যাপ্ত তরল ও বিশ্রাম নিশ্চিত করুন। বিপদের লক্ষণ দেখা দিলে জরুরি চিকিৎসা নিন।",
        "answerEn": "Dengue is a mosquito-borne viral illness. If you suspect dengue, consult a healthcare professional, get appropriate testing, rest and maintain fluids. Seek urgent care if warning signs appear."
    }
];


// ========================================
// ADVANCED DENGUE QUESTION MATCHING SYSTEM
// ========================================

// Language Detection
function detectDengueLanguage(text) {
    return /[\u0980-\u09FF]/.test(text) ? "bn" : "en";
}

// Text Normalization
function normalizeDengueText(text) {
    return text.toLowerCase()
        .replace(/[.,!?;:।"'“”‘’(){}\[\]\-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Common Words to Ignore
const dengueStopWords = new Set([
    "the", "is", "a", "an", "what", "how", "do",
    "does", "can", "i", "my", "me", "to", "for",
    "of", "in", "on", "with", "and", "or", "please",
    "tell", "about", "should", "would", "why",
    "হলে", "কি", "কী", "কেন", "কিভাবে", "কীভাবে",
    "আমার", "আমাকে", "একটা", "একটি", "হয়", "হবে",
    "হয়", "করব", "করবো", "বলুন", "জানতে", "চাই",
    "নিয়ে", "নিয়ে", "করে", "করতে", "হচ্ছে",
    "আসে", "হয়েছে", "হয়েছে", "না", "হতে"
]);

// Similar Meaning / Synonym Mapping
const dengueSynonyms = {

    dengue: [
        "ডেঙ্গু", "ডেঙ্গুর", "ডেঙ্গুতে", "dengue"
    ],

    sleep: [
        "ঘুম", "ঘুমের", "ঘুমানো", "ঘুমানোর",
        "ঘুমাতে", "ঘুমাতে", "ঘুমের", "sleep",
        "sleeping", "insomnia"
    ],

    night: [
        "রাত", "রাতে", "রাত্রে", "night", "nighttime"
    ],

    problem: [
        "সমস্যা", "সমস্যায়", "সমস্যার",
        "problem", "problems", "issue", "issues"
    ],

    symptoms: [
        "লক্ষণ", "লক্ষণগুলো", "উপসর্গ",
        "চিহ্ন", "symptom", "symptoms", "sign", "signs"
    ],

    fever: [
        "জ্বর", "জ্বরের", "জ্বরটা", "fever", "highfever"
    ],

    headache: [
        "মাথাব্যথা", "মাথাব্যথার", "headache", "headaches"
    ],

    bodypain: [
        "শরীরব্যথা", "ব্যথা", "গাব্যথা",
        "bodypain", "musclepain"
    ],

    mosquito: [
        "মশা", "মশার", "মশারি", "mosquito", "mosquitoes"
    ],

    prevention: [
        "প্রতিরোধ", "বাঁচা", "বাঁচতে",
        "prevent", "prevention", "protect"
    ],

    test: [
        "পরীক্ষা", "টেস্ট", "রিপোর্ট",
        "test", "tests", "testing", "report"
    ],

    platelet: [
        "প্লাটিলেট", "প্লেটলেট", "platelet", "platelets"
    ],

    food: [
        "খাবার", "খাওয়া", "খেতে", "খাব",
        "food", "foods", "eat", "eating", "diet"
    ],

    medicine: [
        "ওষুধ", "ঔষধ", "মেডিসিন",
        "medicine", "medication", "drug", "drugs"
    ],

    recovery: [
        "সুস্থ", "সেরে", "সুস্থতা",
        "recovery", "recover", "recovering"
    ],

    weakness: [
        "দুর্বলতা", "দুর্বল", "weakness", "weak"
    ],

    vomiting: [
        "বমি", "বমিভাব", "বমিবমিভাব",
        "vomit", "vomiting", "nausea"
    ],

    bleeding: [
        "রক্তপাত", "রক্ত", "রক্তপড়া",
        "bleeding", "blood"
    ],

    breathing: [
        "শ্বাসকষ্ট", "শ্বাস", "শ্বাসপ্রশ্বাস",
        "breathing", "breath"
    ],

    transmission: [
        "ছড়ায়", "ছড়ানো", "সংক্রমণ",
        "spread", "transmission", "transmitted"
    ]
};

// Create Reverse Synonym Dictionary
const dengueSynonymMap = {};

for (const [mainWord, words] of Object.entries(dengueSynonyms)) {
    words.forEach(word => {
        dengueSynonymMap[word] = mainWord;
    });
}

// Convert Words into Standard Tokens
function dengueTokens(text) {

    return normalizeDengueText(text)
        .split(" ")
        .filter(word =>
            word.length > 1 &&
            !dengueStopWords.has(word)
        )
        .map(word => dengueSynonymMap[word] || word);
}

// Check Whether Question Is Dengue Related
function isDengueRelated(tokens) {

    const dengueTerms = new Set([
        "ডেঙ্গু",
        "জ্বর",
        "মশা",
        "মশার",
        "প্রতিরোধ",
        "dengue",
        "sleep",
        "night",
        "symptoms",
        "fever",
        "headache",
        "bodypain",
        "mosquito",
        "prevention",
        "test",
        "platelet",
        "food",
        "medicine",
        "recovery",
        "weakness",
        "vomiting",
        "bleeding",
        "breathing",
        "transmission"
    ]);

    return tokens.some(word => dengueTerms.has(word));
}

// Calculate Question Similarity
function dengueSimilarity(userQuestion, savedQuestion) {

    const userWords = [...new Set(dengueTokens(userQuestion))];
    const savedWords = [...new Set(dengueTokens(savedQuestion))];

    if (!userWords.length || !savedWords.length) {
        return 0;
    }

    const matchedWords = userWords.filter(word =>
        savedWords.includes(word)
    );

    const overlap = matchedWords.length;

    const userCoverage = overlap / userWords.length;
    const savedCoverage = overlap / savedWords.length;

    return (userCoverage * 0.65) + (savedCoverage * 0.35);
}

// Main Chatbot Answer Function
function getOriginalDengueBankAnswer(message) {

    const language = detectDengueLanguage(message);
    const normalized = normalizeDengueText(message);

    // Greeting
    if (/^(hello|hi|hey|হ্যালো|সালাম|আসসালামু আলাইকুম)$/.test(normalized)) {

        return language === "bn"
            ? "আসসালামু আলাইকুম! আমি Dengue Assistant। ডেঙ্গু সম্পর্কে কী জানতে চান?"
            : "Hello! I am Dengue Assistant. What would you like to know about dengue?";
    }

    const userTokens = [...new Set(dengueTokens(message))];

    // Reject unrelated questions
    if (!isDengueRelated(userTokens)) {

        return language === "bn"
            ? "দুঃখিত! আমি শুধুমাত্র ডেঙ্গু সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। ডেঙ্গু সম্পর্কে প্রশ্ন করুন।"
            : "Sorry! I can only answer dengue-related questions. Please ask me about dengue.";
    }

    // General Dengue Question
    if (userTokens.length === 1 && userTokens[0] === "dengue") {

        const generalTopic = dengueQuestionBank.find(
            topic => topic.topic === "general"
        );

        return language === "bn"
            ? generalTopic.answerBn
            : generalTopic.answerEn;
    }

    let bestTopic = null;
    let bestScore = 0;
    let bestOverlap = 0;

    // Search All 1,000 Questions
    for (const topic of dengueQuestionBank) {

        for (const savedQuestion of topic.questions) {

            const savedTokens = [...new Set(dengueTokens(savedQuestion))];

            const overlap = userTokens.filter(word =>
                savedTokens.includes(word)
            ).length;

            const score = dengueSimilarity(message, savedQuestion);

            if (
                score > bestScore ||
                (score === bestScore && overlap > bestOverlap)
            ) {

                bestScore = score;
                bestOverlap = overlap;
                bestTopic = topic;
            }
        }
    }

    // Do Not Guess When Matching Is Weak
    if (
        !bestTopic ||
        bestScore < 0.50 ||
        (bestOverlap < 2 && userTokens.length > 1)
    ) {

        return language === "bn"
            ? "দুঃখিত! আপনার প্রশ্নের সঙ্গে মেলে এমন নির্ভরযোগ্য ডেঙ্গু তথ্য খুঁজে পাইনি। প্রশ্নটি আরেকটু বিস্তারিতভাবে লিখুন অথবা চিকিৎসকের পরামর্শ নিন।"
            : "Sorry, I could not find a reliable dengue answer matching your question. Please rephrase it or consult a healthcare professional.";
    }

    // Return Answer in User's Language
    return language === "bn"
        ? bestTopic.answerBn
        : bestTopic.answerEn;
}

// ========================================
// END ADVANCED MATCHING SYSTEM
// ========================================

// ========================================
// DENGUE SPECIFIC ANSWER SYSTEM
// ========================================

const dengueSpecificAnswers = [

    {
        topic: "sleep",
        keywordsBn: ["ঘুম", "ঘুমাতে", "ঘুমানোর", "নিদ্রা", "রাতে", "রাত্রে", "অনিদ্রা"],
        keywordsEn: ["sleep", "sleeping", "insomnia", "night", "sleepless"],
        answerBn: "ডেঙ্গুর সময় জ্বর, শরীরব্যথা, মাথাব্যথা, অস্বস্তি বা উদ্বেগের কারণে রাতে ঘুমাতে সমস্যা হতে পারে। পর্যাপ্ত বিশ্রাম নিন, আরামদায়ক পরিবেশে ঘুমানোর চেষ্টা করুন এবং চিকিৎসকের পরামর্শ অনুযায়ী জ্বর ও ব্যথার চিকিৎসা নিন। সমস্যা বেশি হলে চিকিৎসককে জানান।",
        answerEn: "During dengue, fever, body aches, headache, discomfort or anxiety may make sleeping difficult. Rest in a comfortable environment and follow your clinician's advice for fever and pain. Contact a healthcare professional if the problem is severe or persistent."
    },

    {
        topic: "warning",
        keywordsBn: ["বিপদ", "বিপজ্জনক", "রক্তপাত", "কালো পায়খানা", "পেটব্যথা", "অস্থিরতা", "শ্বাসকষ্ট", "বারবার বমি"],
        keywordsEn: ["warning", "danger", "bleeding", "black stool", "severe abdominal pain", "restlessness", "breathing difficulty", "persistent vomiting"],
        answerBn: "ডেঙ্গুর বিপদের লক্ষণের মধ্যে তীব্র পেটব্যথা, বারবার বমি, নাক বা মাড়ি দিয়ে রক্তপাত, রক্তবমি বা কালো পায়খানা, শ্বাসকষ্ট, অস্বাভাবিক দুর্বলতা বা অস্থিরতা থাকতে পারে। এগুলোর কোনোটি দেখা দিলে অবিলম্বে হাসপাতালের জরুরি বিভাগে যান।",
        answerEn: "Dengue warning signs include severe abdominal pain, persistent vomiting, bleeding from the nose or gums, vomiting blood or black stools, difficulty breathing, unusual weakness or restlessness. Seek emergency medical care immediately if any occur."
    },

    {
        topic: "hydration",
        keywordsBn: ["পানি", "পানিশূন্যতা", "তরল", "ডাবের", "ওআরএস", "ors", "প্রস্রাব কম"],
        keywordsEn: ["water", "dehydration", "fluid", "fluids", "coconut water", "ors", "urine"],
        answerBn: "ডেঙ্গুতে পর্যাপ্ত তরল পান করা গুরুত্বপূর্ণ। পানি, খাবার স্যালাইন (ORS), স্যুপ ও অন্যান্য উপযুক্ত তরল নেওয়া যেতে পারে। প্রস্রাব কমে যাওয়া, অতিরিক্ত তৃষ্ণা বা মাথা ঘোরা পানিশূন্যতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।",
        answerEn: "Maintaining adequate fluids is important during dengue. Water, oral rehydration solution (ORS), soup and other suitable fluids may help. Reduced urination, excessive thirst or dizziness may indicate dehydration. Seek medical advice."
    },

    {
        topic: "platelets",
        keywordsBn: ["প্লাটিলেট", "প্লেটলেট", "অনুচক্রিকা", "প্লাটিলেট কম", "প্লাটিলেট বাড়"],
        keywordsEn: ["platelet", "platelets", "low platelet", "platelet count"],
        answerBn: "ডেঙ্গুতে প্লাটিলেট কমতে পারে। তবে শুধু প্লাটিলেটের সংখ্যা দিয়ে রোগের তীব্রতা বোঝা যায় না। রক্তপাত, হেমাটোক্রিট, পানিশূন্যতা ও রোগীর সামগ্রিক অবস্থা গুরুত্বপূর্ণ। চিকিৎসকের পরামর্শ অনুযায়ী CBC ও প্রয়োজনীয় ফলোআপ করুন।",
        answerEn: "Platelets may decrease during dengue, but the count alone does not determine disease severity. Bleeding, hematocrit, hydration and overall condition matter. Follow your clinician's advice about CBC tests and monitoring."
    },

    {
        topic: "tests",
        keywordsBn: ["পরীক্ষা", "টেস্ট", "রিপোর্ট", "এনএস১", "ns1", "আইজিএম", "igm", "সিবিসি", "cbc"],
        keywordsEn: ["test", "tests", "testing", "report", "ns1", "igm", "cbc"],
        answerBn: "ডেঙ্গু নির্ণয়ে রোগের দিন অনুযায়ী চিকিৎসক NS1, IgM এবং CBC-এর মতো পরীক্ষা দিতে পারেন। কোন পরীক্ষা কখন প্রয়োজন তা চিকিৎসক নির্ধারণ করবেন। রিপোর্ট নিজে ব্যাখ্যা না করে চিকিৎসককে দেখান।",
        answerEn: "Depending on the day of illness, a clinician may recommend tests such as NS1, IgM and CBC. A healthcare professional should decide which test is appropriate and interpret the results."
    },

    {
        topic: "medicine",
        keywordsBn: ["ওষুধ", "ঔষধ", "প্যারাসিটামল", "পেইনকিলার", "ব্যথার ওষুধ", "অ্যাসপিরিন", "আইবুপ্রোফেন"],
        keywordsEn: ["medicine", "medication", "paracetamol", "acetaminophen", "painkiller", "aspirin", "ibuprofen"],
        answerBn: "ডেঙ্গুতে জ্বর বা ব্যথার জন্য চিকিৎসক প্যারাসিটামল ব্যবহারের পরামর্শ দিতে পারেন। অ্যাসপিরিন, আইবুপ্রোফেন বা অন্যান্য NSAID নিজে থেকে খাবেন না, কারণ রক্তপাতের ঝুঁকি বাড়তে পারে। ওষুধের ডোজ চিকিৎসকের কাছ থেকে জেনে নিন।",
        answerEn: "A clinician may recommend paracetamol (acetaminophen) for fever or pain. Do not take aspirin, ibuprofen or other NSAIDs unless specifically directed by a clinician, as they may increase bleeding risk. Ask a healthcare professional about the correct dose."
    },

    {
        topic: "food",
        keywordsBn: ["খাবার", "খেতে", "খাওয়া", "খাব", "ফল", "ভাত", "স্যুপ", "ক্ষুধা", "খিদে"],
        keywordsEn: ["food", "eat", "eating", "diet", "fruit", "rice", "soup", "appetite"],
        answerBn: "ডেঙ্গুতে সহজে হজম হয় এমন স্বাভাবিক পুষ্টিকর খাবার অল্প অল্প করে খেতে পারেন। ভাত, স্যুপ, ফল ও অন্যান্য সহনীয় খাবার নেওয়া যায়। পর্যাপ্ত তরল পান করুন। বমির কারণে কিছুই খেতে বা পান করতে না পারলে চিকিৎসকের সাহায্য নিন।",
        answerEn: "During dengue, try small portions of nutritious, easily tolerated foods such as rice, soup and fruit. Maintain adequate fluid intake. If vomiting prevents you from eating or drinking, seek medical advice."
    },

    {
        topic: "recovery",
        keywordsBn: ["সুস্থ", "সেরে", "রিকভারি", "দুর্বলতা", "কতদিন", "বিশ্রাম"],
        keywordsEn: ["recovery", "recover", "weakness", "tiredness", "fatigue", "rest", "how long"],
        answerBn: "ডেঙ্গু থেকে সেরে উঠতে সময় লাগতে পারে। পর্যাপ্ত বিশ্রাম, তরল পান, পুষ্টিকর খাবার এবং চিকিৎসকের পরামর্শ অনুযায়ী ফলোআপ গুরুত্বপূর্ণ। জ্বর কমে গেলেও বিপদের লক্ষণ দেখা দিলে জরুরি চিকিৎসা নিন।",
        answerEn: "Recovery from dengue can take time. Adequate rest, fluids, nutritious food and follow-up with a healthcare professional are important. Even after fever settles, seek urgent care if warning signs develop."
    },

    {
        topic: "prevention",
        keywordsBn: ["প্রতিরোধ", "মশা", "মশারি", "কামড়", "এডিস", "জমে থাকা পানি"],
        keywordsEn: ["prevent", "prevention", "mosquito", "mosquitoes", "bite", "aedes", "standing water", "repellent"],
        answerBn: "ডেঙ্গু প্রতিরোধে জমে থাকা পানি নিয়মিত সরিয়ে ফেলুন, পানির পাত্র ঢেকে রাখুন, মশারি ও মশা তাড়ানোর উপকরণ ব্যবহার করুন এবং শরীর ঢেকে রাখে এমন পোশাক পরুন।",
        answerEn: "Prevent dengue by removing standing water, covering water containers, using mosquito nets and repellents, and wearing clothing that covers your skin."
    },

    {
        topic: "transmission",
        keywordsBn: ["ছড়ায়", "ছড়ানো", "সংক্রমণ", "মানুষ থেকে", "কাশি", "হাঁচি"],
        keywordsEn: ["spread", "spreading", "transmission", "transmitted", "cough", "sneeze", "person to person"],
        answerBn: "ডেঙ্গু মূলত সংক্রমিত এডিস মশার কামড়ে ছড়ায়। সাধারণত কাশি, হাঁচি বা পাশে থাকার মাধ্যমে একজন থেকে আরেকজনে ছড়ায় না।",
        answerEn: "Dengue is mainly spread through the bite of an infected Aedes mosquito. It is not normally spread directly from person to person through coughing, sneezing or casual contact."
    },

    
    {
        topic: "children",
        keywordsBn: [
            "শিশু", "বাচ্চা", "ছোট বাচ্চা",
            "শিশুর ডেঙ্গু", "বাচ্চার ডেঙ্গু",
            "শিশুর জ্বর", "বাচ্চার জ্বর"
        ],
        keywordsEn: [
            "child", "children", "baby", "infant",
            "kid", "kids", "dengue in children"
        ],
        answerBn: "শিশুদের ডেঙ্গু হলে জ্বর, বমি, পেটব্যথা, খেতে না চাওয়া বা অস্বাভাবিক দুর্বলতা দেখা দিতে পারে। শিশুর ডেঙ্গু সন্দেহ হলে দ্রুত শিশু বিশেষজ্ঞ বা চিকিৎসকের পরামর্শ নিন। শিশুর প্রস্রাব কমে যাওয়া, অতিরিক্ত ঘুম ঘুম ভাব, শ্বাসকষ্ট, রক্তপাত বা বারবার বমি হলে জরুরি বিভাগে যান। নিজে থেকে ওষুধ দেবেন না।",
        answerEn: "Dengue in children may cause fever, vomiting, abdominal pain, poor feeding or unusual weakness. If dengue is suspected, seek medical advice promptly. Reduced urination, unusual drowsiness, breathing difficulty, bleeding or persistent vomiting require emergency care. Do not give medicines without professional advice."
    },

    {
        topic: "pregnancy",
        keywordsBn: [
            "গর্ভাবস্থা", "গর্ভবতী", "প্রেগন্যান্ট",
            "গর্ভের শিশু", "গর্ভাবস্থায় ডেঙ্গু",
            "প্রেগন্যান্সি", "গর্ভবতী মায়ের ডেঙ্গু"
        ],
        keywordsEn: [
            "pregnancy", "pregnant", "pregnancy dengue",
            "dengue during pregnancy", "pregnant woman"
        ],
        answerBn: "গর্ভাবস্থায় ডেঙ্গু হলে মা ও গর্ভের শিশুর জন্য ঝুঁকি তৈরি হতে পারে। তাই ডেঙ্গু সন্দেহ হলে দ্রুত প্রসূতি বিশেষজ্ঞ ও চিকিৎসকের পরামর্শ নিন। নিজে থেকে কোনো ওষুধ খাবেন না। রক্তপাত, পেটব্যথা, বারবার বমি বা শ্বাসকষ্ট হলে জরুরি চিকিৎসা নিন।",
        answerEn: "Dengue during pregnancy can pose risks to both the mother and baby. Seek prompt medical assessment from an obstetrician or healthcare professional if dengue is suspected. Do not self-medicate. Bleeding, abdominal pain, persistent vomiting or breathing difficulty require emergency care."
    },

    {
        topic: "after_fever",
        keywordsBn: [
            "জ্বর কমে", "জ্বর চলে গেলে", "জ্বর কমার পর",
            "জ্বর নেই", "জ্বর ভালো হওয়ার পর",
            "জ্বর কমলেও", "জ্বর কমার পরে"
        ],
        keywordsEn: [
            "after fever", "fever goes away",
            "fever subsides", "after fever stops",
            "fever has gone", "fever is gone"
        ],
        answerBn: "ডেঙ্গুতে জ্বর কমে যাওয়ার পরও বিপদের লক্ষণ দেখা দিতে পারে। বিশেষ করে তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট, অস্বাভাবিক দুর্বলতা বা অস্থিরতা দেখা দিলে দেরি না করে হাসপাতালে যান। জ্বর কমেছে মানেই বিপদ কেটে গেছে—এমন নয়। চিকিৎসকের পরামর্শ অনুযায়ী পর্যবেক্ষণ চালিয়ে যান।",
        answerEn: "Warning signs of dengue can appear even after the fever goes away. Severe abdominal pain, persistent vomiting, bleeding, breathing difficulty, unusual weakness or restlessness require immediate medical attention. Fever settling does not always mean the danger has passed. Continue monitoring as advised by your clinician."
    },

    {
        topic: "post_dengue_weakness",
        keywordsBn: [
            "ডেঙ্গুর পর দুর্বলতা", "ডেঙ্গু সেরে যাওয়ার পর",
            "ডেঙ্গুর পরে দুর্বল", "দীর্ঘদিন দুর্বলতা",
            "ডেঙ্গুর পর ক্লান্তি", "ডেঙ্গুর পর শক্তি",
            "ডেঙ্গু থেকে সুস্থ হওয়ার পর"
        ],
        keywordsEn: [
            "post dengue weakness", "weakness after dengue",
            "fatigue after dengue", "tired after dengue",
            "after recovering from dengue",
            "post dengue fatigue"
        ],
        answerBn: "ডেঙ্গু থেকে সেরে ওঠার পর কিছুদিন ক্লান্তি ও দুর্বলতা থাকতে পারে। পর্যাপ্ত বিশ্রাম, পুষ্টিকর খাবার, প্রয়োজনমতো তরল পান এবং ধীরে ধীরে স্বাভাবিক কাজে ফিরে আসুন। দুর্বলতা দীর্ঘস্থায়ী হলে, বাড়তে থাকলে বা নতুন কোনো লক্ষণ দেখা দিলে চিকিৎসকের পরামর্শ নিন।",
        answerEn: "Some people experience fatigue and weakness for a while after recovering from dengue. Get adequate rest, eat nutritious food, maintain fluids and gradually return to normal activities. Consult a healthcare professional if weakness persists, worsens or new symptoms develop."
    }

];

// Specific Topic Matcher
function getDengueSpecificAnswer(message) {

    const language = detectDengueLanguage(message);
    const normalized = normalizeDengueText(message);

    let bestTopic = null;
    let bestScore = 0;

    
for (const topic of dengueSpecificAnswers) {

    // Skip empty or invalid entries
    if (
        !topic ||
        !Array.isArray(topic.keywordsBn) ||
        !Array.isArray(topic.keywordsEn)
    ) {
        continue;
    }

    const keywords = language === "bn"
        ? topic.keywordsBn
        : topic.keywordsEn;
        let score = 0;

        for (const keyword of keywords) {

            const key = normalizeDengueText(keyword);

            if (normalized.includes(key)) {
                score += key.length >= 5 ? 2 : 1;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestTopic = topic;
        }
    }

    if (bestTopic && bestScore >= 2) {
        return language === "bn"
            ? bestTopic.answerBn
            : bestTopic.answerEn;
    }

    return null;
}

// Override Main Answer Function
function getDengueBankAnswer(message) {

    const specificAnswer = getDengueSpecificAnswer(message);

    if (specificAnswer) {
        return specificAnswer;
    }

    // Use the original 1,000-question bank
    const language = detectDengueLanguage(message);
    const tokens = dengueTokens(message);

    if (!isDengueRelated(tokens)) {
        return language === "bn"
            ? "দুঃখিত! আমি শুধুমাত্র ডেঙ্গু সম্পর্কিত প্রশ্নের উত্তর দিতে পারি।"
            : "Sorry! I can only answer dengue-related questions.";
    }

    // Call the original question-bank matcher
    return getOriginalDengueBankAnswer(message);
}
