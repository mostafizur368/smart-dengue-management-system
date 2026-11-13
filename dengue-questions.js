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
// QUESTION BANK INDEX + DATA QUALITY AUDIT
// Task 1: stable IDs and validation without
// changing the existing question-bank format.
// ========================================

const dengueQuestionIndex = dengueQuestionBank.flatMap((topic) =>
    topic.questions.map((question, index) => ({
        id: `${topic.topic}_${String(index + 1).padStart(3, "0")}`,
        topic: topic.topic,
        question,
        answerBn: topic.answerBn,
        answerEn: topic.answerEn
    }))
);

function auditDengueQuestionBank() {
    const normalizeForAudit = (value) => String(value || "")
        .toLocaleLowerCase()
        .normalize("NFKC")
        .replace(/[.,!?;:।\-()[\]{}"'“”‘’`~@#$%^&*_+=<>/\\|]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const seenQuestions = new Map();
    const duplicateQuestions = [];
    const invalidTopics = [];
    const missingAnswers = [];
    const emptyQuestions = [];

    dengueQuestionBank.forEach((topic) => {
        if (
            !topic ||
            typeof topic.topic !== "string" ||
            !Array.isArray(topic.questions) ||
            topic.questions.length === 0
        ) {
            invalidTopics.push(topic && topic.topic ? topic.topic : "unknown");
            return;
        }

        if (!String(topic.answerBn || "").trim() || !String(topic.answerEn || "").trim()) {
            missingAnswers.push(topic.topic);
        }

        topic.questions.forEach((question, index) => {
            const normalized = normalizeForAudit(question);

            if (!normalized) {
                emptyQuestions.push(`${topic.topic}_${index + 1}`);
                return;
            }

            if (seenQuestions.has(normalized)) {
                duplicateQuestions.push({
                    question,
                    firstId: seenQuestions.get(normalized),
                    duplicateId: `${topic.topic}_${String(index + 1).padStart(3, "0")}`
                });
            } else {
                seenQuestions.set(
                    normalized,
                    `${topic.topic}_${String(index + 1).padStart(3, "0")}`
                );
            }
        });
    });

    return {
        totalTopics: dengueQuestionBank.length,
        totalQuestions: dengueQuestionIndex.length,
        uniqueQuestions: seenQuestions.size,
        duplicateCount: duplicateQuestions.length,
        duplicateQuestions,
        invalidTopics,
        missingAnswers,
        emptyQuestions,
        passed:
            invalidTopics.length === 0 &&
            missingAnswers.length === 0 &&
            emptyQuestions.length === 0 &&
            duplicateQuestions.length === 0
    };
}

const dengueQuestionBankAudit = auditDengueQuestionBank();

// Expose a read-only-style data snapshot for the next search-engine stages.
// Existing matching functions continue using dengueQuestionBank unchanged.
if (typeof window !== "undefined") {
    window.dengueQuestionIndex = dengueQuestionIndex;
    window.dengueQuestionBankAudit = dengueQuestionBankAudit;
}





// ========================================
// ADVANCED DENGUE QUESTION MATCHING SYSTEM
// ========================================

// Language Detection
function detectDengueLanguage(text) {
    return /[\u0980-\u09FF]/.test(text) ? "bn" : "en";
}

// Text Normalization
function normalizeDengueText(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFC")
        .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
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
    "থেকে", "আমার", "আমাকে", "একটা", "একটি",
    "হয়", "হবে", "হয়", "করব", "করবো", "বলুন",
    "জানতে", "চাই", "নিয়ে", "নিয়ে", "করে",
    "করতে", "হচ্ছে", "আসে", "হয়েছে", "হয়েছে",
    "না", "হতে", "একটু", "আমাকে", "আপনি"
]);

// Similar Meaning / Synonym Mapping
const dengueSynonyms = {
    dengue: [
        "dengue", "ডেঙ্গু", "ডেঙ্গুর", "ডেঙ্গুতে",
        "ডেঙ্গুকে", "ডেঙ্গুজনিত"
    ],

    fever: [
        "fever", "জ্বর", "জ্বরের", "জ্বরটা",
        "জ্বরেতে", "জ্বর হলে", "jhor", "jor"
    ],

    symptoms: [
        "symptom", "symptoms", "sign", "signs",
        "লক্ষণ", "লক্ষণগুলো", "লক্ষণগুলা",
        "লক্ষন", "লক্ষনগুলো", "উপসর্গ",
        "উপসর্গগুলো", "চিহ্ন", "lokkhon", "lokkhon gula"
    ],

    headache: [
        "headache", "headaches", "মাথাব্যথা",
        "মাথা ব্যথা", "মাথার ব্যথা",
        "matha betha", "matha batha"
    ],

    bodypain: [
        "bodypain", "body", "musclepain",
        "শরীরব্যথা", "শরীর ব্যথা", "গাব্যথা",
        "গা ব্যথা", "শরীরের ব্যথা"
    ],

    mosquito: [
        "mosquito", "mosquitoes", "মশা",
        "মশার", "মশারি", "mosha", "moshar"
    ],

    prevention: [
        "prevention", "prevent", "protect",
        "প্রতিরোধ", "প্রতিরোধের", "বাঁচা",
        "বাঁচার", "রক্ষা", "রক্ষার", "উপায়",
        "উপায়", "করণীয়", "করণীয়", "protirodh"
    ],

    test: [
        "test", "tests", "testing", "report",
        "পরীক্ষা", "টেস্ট", "রিপোর্ট",
        "পরীক্ষার", "রক্ত পরীক্ষা"
    ],

    platelet: [
        "platelet", "platelets", "প্লাটিলেট",
        "প্লেটলেট", "প্লাটিলেটের", "অনুচক্রিকা"
    ],

    food: [
        "food", "foods", "eat", "eating", "diet",
        "খাবার", "খাওয়া", "খেতে", "খাব",
        "খাদ্য", "পুষ্টি", "khabar", "khaoa"
    ],

    medicine: [
        "medicine", "medication", "drug", "drugs",
        "ওষুধ", "ঔষধ", "মেডিসিন", "ওষুধের"
    ],

    recovery: [
        "recovery", "recover", "recovering",
        "সুস্থ", "সেরে", "সুস্থতা",
        "আরোগ্য", "ভালো হওয়া", "ভালো হওয়ার"
    ],

    weakness: [
        "weakness", "weak", "tired", "fatigue",
        "দুর্বলতা", "দুর্বল", "ক্লান্তি",
        "ক্লান্ত", "অবসাদ"
    ],

    vomiting: [
        "vomit", "vomiting", "nausea",
        "বমি", "বমিভাব", "বমি ভাব"
    ],

    bleeding: [
        "bleeding", "blood", "রক্তপাত",
        "রক্ত", "রক্তপড়া", "রক্ত পড়া"
    ],

    breathing: [
        "breathing", "breath", "শ্বাসকষ্ট",
        "শ্বাস", "শ্বাসপ্রশ্বাস"
    ],

    transmission: [
        "spread", "transmission", "transmitted",
        "ছড়ায়", "ছড়ায়", "ছড়ানো", "ছড়ানো",
        "সংক্রমণ", "ছড়াতে"
    ],

    sleep: [
        "sleep", "sleeping", "insomnia",
        "ঘুম", "ঘুমের", "ঘুমানো", "ঘুমানোর",
        "ঘুমাতে", "নিদ্রা"
    ],

    night: [
        "night", "nighttime", "রাত",
        "রাতে", "রাত্রে"
    ],

    problem: [
        "problem", "problems", "issue", "issues",
        "সমস্যা", "সমস্যার", "সমস্যায়"
    ]
};

// Create Reverse Synonym Dictionary
const dengueSynonymMap = {};

for (const [mainWord, words] of Object.entries(dengueSynonyms)) {
    words.forEach(word => {
        dengueSynonymMap[normalizeDengueText(word)] = mainWord;
    });
}

// Common Banglish Word Mapping
const dengueBanglishMap = {
    "dengu": "dengue",
    "dengue": "dengue",
    "jhor": "fever",
    "jor": "fever",
    "mosha": "mosquito",
    "moshar": "mosquito",
    "lokkhon": "symptoms",
    "lokkhn": "symptoms",
    "matha": "headache",
    "betha": "bodypain",
    "batha": "bodypain",
    "rokto": "bleeding",
    "rokto-pat": "bleeding",
    "platelet": "platelet",
    "platlet": "platelet",
    "khabar": "food",
    "oshudh": "medicine",
    "osudh": "medicine",
    "ghum": "sleep",
    "durbol": "weakness",
    "durbolota": "weakness",
    "bomi": "vomiting",
    "shash": "breathing",
    "protirodh": "prevention",
    "porikkha": "test",
    "porikkhar": "test",
    "shustho": "recovery",
    "shusthota": "recovery"
};

// Fuzzy Matching: Edit Distance
function dengueEditDistance(a, b) {
    if (a === b) return 0;

    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const dp = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

// Correct Common Spelling Mistakes
function correctDengueWord(word) {
    if (dengueSynonymMap[word]) {
        return dengueSynonymMap[word];
    }

    if (dengueBanglishMap[word]) {
        return dengueBanglishMap[word];
    }

    let bestMatch = null;
    let bestDistance = Infinity;

    const knownWords = Object.keys(dengueSynonymMap);

    for (const knownWord of knownWords) {
        if (word.length < 4 || knownWord.length < 4) continue;

        const distance = dengueEditDistance(word, knownWord);
        const allowedDistance = word.length >= 8 ? 2 : 1;

        if (
            distance <= allowedDistance &&
            distance < bestDistance
        ) {
            bestDistance = distance;
            bestMatch = dengueSynonymMap[knownWord];
        }
    }

    return bestMatch || word;
}

// Convert Words into Standard Tokens
function dengueTokens(text) {
    return normalizeDengueText(text)
        .split(" ")
        .filter(word =>
            word.length > 1 &&
            !dengueStopWords.has(word)
        )
        .map(word => correctDengueWord(word));
}

// Check Whether Question Is Dengue Related
function isDengueRelated(tokens) {
    const dengueTerms = new Set([
        "dengue", "fever", "mosquito", "symptoms",
        "headache", "bodypain", "prevention",
        "test", "platelet", "food", "medicine",
        "recovery", "weakness", "vomiting",
        "bleeding", "breathing", "transmission",
        "sleep", "night", "problem"
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

    // Balanced similarity score
    const coverageScore =
        (userCoverage * 0.60) + (savedCoverage * 0.40);

    // Exact normalized phrase bonus
    const userNormalized = normalizeDengueText(userQuestion);
    const savedNormalized = normalizeDengueText(savedQuestion);

    const exactBonus = userNormalized === savedNormalized ? 0.20 : 0;

    return Math.min(1, coverageScore + exactBonus);
}

// ========================================
// END ADVANCED MATCHING SYSTEM
// ========================================


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

    // Task 2: use the free hybrid retrieval engine when available.
    // The legacy matcher remains as a fallback for safe backward compatibility.
    if (typeof window !== "undefined" &&
        typeof window.searchDengueCandidates === "function") {
        const candidates = typeof window.getTopDengueMatches === "function"
            ? window.getTopDengueMatches(message, 15)
            : window.searchDengueCandidates(message, 15);
        const bestCandidate = candidates.length ? candidates[0] : null;

        if (bestCandidate) {
            // Task 12: approved community-bank records carry their own reviewed answers.
            if (
                bestCandidate.communityApproved === true &&
                Number(bestCandidate.score || 0) >= 0.12 &&
                bestCandidate.answerBn &&
                bestCandidate.answerEn
            ) {
                return language === "bn"
                    ? bestCandidate.answerBn
                    : bestCandidate.answerEn;
            }

            bestTopic = dengueQuestionBank.find(
                topic => topic.topic === bestCandidate.topic
            ) || null;
            bestScore = bestCandidate.score || 0;
            bestOverlap = bestCandidate.conceptOverlap || 0;

            // Keep ranked candidates available for Task 3 and troubleshooting.
            window.lastDengueSearchResults = candidates;
        }
    }

    // Fallback to the previous matcher if the new engine is unavailable.
    if (!bestTopic) {
        for (const topic of dengueQuestionBank) {
            for (const savedQuestion of topic.questions) {
                const savedTokens = [...new Set(dengueTokens(savedQuestion))];
                const overlap = userTokens.filter(word =>
                    savedTokens.includes(word)
                ).length;
                const score = dengueSimilarity(message, savedQuestion);
                if (score > bestScore || (score === bestScore && overlap > bestOverlap)) {
                    bestScore = score;
                    bestOverlap = overlap;
                    bestTopic = topic;
                }
            }
        }
    }

    // Do Not Guess When Matching Is Weak
    const usingHybridSearch = typeof window !== "undefined" &&
        typeof window.searchDengueCandidates === "function";

    if (
        !bestTopic ||
        (usingHybridSearch ? bestScore < 0.12 : bestScore < 0.50) ||
        (!usingHybridSearch && bestOverlap < 2 && userTokens.length > 1)
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
        topic: "body_pain_cause",
        keywordsBn: [
            "ডেঙ্গুতে শরীর ব্যথা কেন",
            "ডেঙ্গুতে গা ব্যথা কেন",
            "ডেঙ্গুতে পেশি ব্যথা কেন",
            "ডেঙ্গুতে জয়েন্টে ব্যথা কেন",
            "ডেঙ্গুতে শরীর ব্যথার কারণ",
            "শরীর ব্যথা কেন হয়",
            "শরীর ব্যথার কারণ"
        ],
        keywordsEn: [
            "why does dengue cause body pain",
            "why does dengue cause muscle pain",
            "why do joints hurt in dengue",
            "cause of body pain in dengue",
            "why body aches in dengue"
        ],
        answerBn: "ডেঙ্গুতে শরীর, পেশি ও জয়েন্টে ব্যথা হওয়া একটি পরিচিত উপসর্গ। ভাইরাস সংক্রমণের সময় শরীরের প্রতিরক্ষা-প্রতিক্রিয়া এবং সংশ্লিষ্ট প্রদাহজনিত প্রক্রিয়ার কারণে এ ধরনের ব্যথা হতে পারে। তবে ব্যথার তীব্রতা দিয়ে একা রোগের severity বোঝা যায় না, এবং শুধু শরীর ব্যথা দিয়ে ডেঙ্গু নিশ্চিতও করা যায় না। বিশ্রাম নিন, পর্যাপ্ত তরল পান করুন এবং ব্যথা বা জ্বরের ওষুধ নেওয়ার আগে চিকিৎসকের পরামর্শ নিন; Aspirin বা Ibuprofen নিজে থেকে খাবেন না। তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট বা অস্বাভাবিক ঝিমুনি হলে জরুরি চিকিৎসা নিন।",
        answerEn: "Body, muscle and joint aches are recognized symptoms of dengue. They may occur as the body responds to the viral infection and related inflammatory processes. Pain severity alone does not indicate how severe dengue is, and body pain by itself cannot confirm dengue. Rest, maintain fluids, and ask a healthcare professional before taking medicine for pain or fever. Do not self-medicate with aspirin or ibuprofen. Seek urgent care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty or unusual drowsiness."
    },


    
    {
        topic: "body_pain_what_to_do",
        keywordsBn: [
            "ডেঙ্গুতে শরীর ব্যথা হলে কী করব",
            "ডেঙ্গুতে শরীর ব্যথা হলে কি করবো",
            "ডেঙ্গুতে গা ব্যথা হলে কী করব",
            "ডেঙ্গুতে পেশি ব্যথা হলে কী করব",
            "ডেঙ্গুতে শরীর ব্যথা হলে করণীয়",
            "ডেঙ্গুতে শরীর ব্যথা হলে কি করা উচিত"
        ],
        keywordsEn: [
            "what should i do for body pain in dengue",
            "what to do for dengue body aches",
            "what can i do if dengue causes body pain",
            "how to manage muscle pain in dengue"
        ],
        answerBn: "ডেঙ্গুতে শরীর বা পেশি ব্যথা হলে বিশ্রাম নিন এবং পর্যাপ্ত পানি ও অন্যান্য উপযুক্ত তরল পান করুন। ব্যথা বা জ্বরের জন্য কোনো ওষুধ নেওয়ার আগে চিকিৎসক বা ফার্মাসিস্টের পরামর্শ নিন; ডেঙ্গুতে Aspirin, Ibuprofen বা অন্য NSAID নিজে থেকে খাবেন না, কারণ রক্তপাতের ঝুঁকি বাড়তে পারে। ব্যথা খুব তীব্র হলে, অবস্থা খারাপ হলে, অথবা তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট বা অস্বাভাবিক ঝিমুনি দেখা দিলে দ্রুত চিকিৎসা নিন।",
        answerEn: "For body or muscle aches with dengue, rest and maintain adequate fluids. Ask a healthcare professional before taking any pain or fever medicine. Do not self-medicate with aspirin, ibuprofen or other NSAIDs because they may increase bleeding risk. Seek prompt medical care if pain is severe, symptoms worsen, or you develop severe abdominal pain, repeated vomiting, bleeding, breathing difficulty or unusual drowsiness."
    },
    {
        topic: "body_pain_duration",
        keywordsBn: [
            "ডেঙ্গুতে শরীর ব্যথা কতদিন থাকে",
            "ডেঙ্গুতে গা ব্যথা কতদিন থাকে",
            "ডেঙ্গুতে পেশি ব্যথা কতদিন থাকে",
            "ডেঙ্গুর শরীর ব্যথা কতদিন",
            "ডেঙ্গুতে শরীর ব্যথা কখন কমে"
        ],
        keywordsEn: [
            "how long does body pain last in dengue",
            "how long do dengue muscle aches last",
            "when does dengue body pain go away",
            "duration of body aches in dengue"
        ],
        answerBn: "ডেঙ্গুতে শরীর ও পেশির ব্যথা সাধারণত অসুস্থতার তীব্র পর্যায়ে থাকে এবং ধীরে ধীরে কমতে পারে, তবে সবার ক্ষেত্রে সময় এক নয়। জ্বর কমে গেলেও কিছুদিন ক্লান্তি বা অস্বস্তি থাকতে পারে। ব্যথা বাড়তে থাকলে, দীর্ঘস্থায়ী হলে, নতুন উপসর্গ দেখা দিলে বা কোনো সতর্কতামূলক লক্ষণ থাকলে চিকিৎসকের সঙ্গে যোগাযোগ করুন। শুধু ব্যথা কতদিন থাকছে তা দিয়ে রোগের তীব্রতা নির্ধারণ করা যায় না।",
        answerEn: "Body and muscle aches usually occur during the acute phase of dengue and may gradually improve, but the duration varies from person to person. Tiredness or discomfort can remain for a while after the fever settles. Contact a healthcare professional if pain is worsening, persistent, accompanied by new symptoms, or occurs with warning signs. Duration of pain alone does not determine dengue severity."
    },
    {
        topic: "body_pain_relief",
        keywordsBn: [
            "ডেঙ্গুতে শরীর ব্যথা কমানোর উপায়",
            "ডেঙ্গুতে শরীর ব্যথা কমাবো কীভাবে",
            "ডেঙ্গুতে গা ব্যথা কমানোর উপায়",
            "ডেঙ্গুতে পেশি ব্যথা কমানোর উপায়",
            "ডেঙ্গুতে শরীর ব্যথা কমাতে কী করব",
            "ডেঙ্গুতে ব্যথা কমানোর উপায়"
        ],
        keywordsEn: [
            "how to relieve body pain in dengue",
            "how to reduce dengue body aches",
            "how to ease muscle pain during dengue",
            "relief for dengue muscle pain"
        ],
        answerBn: "ডেঙ্গুতে শরীর ব্যথা কমাতে পর্যাপ্ত বিশ্রাম ও তরল গ্রহণে গুরুত্ব দিন। ব্যথা বা জ্বরের ওষুধের বিষয়ে চিকিৎসকের পরামর্শ নিন এবং নির্ধারিত মাত্রা মেনে চলুন। Aspirin, Ibuprofen, Naproxen বা অন্য NSAID নিজে থেকে ব্যবহার করবেন না, কারণ এগুলো রক্তপাতের ঝুঁকি বাড়াতে পারে। ব্যথা অসহনীয় হলে বা সতর্কতামূলক লক্ষণ দেখা দিলে দ্রুত চিকিৎসা নিন।",
        answerEn: "To manage dengue-related body aches, prioritize rest and adequate fluids. Ask a healthcare professional which pain or fever medicine is appropriate and follow the advised dose. Do not take aspirin, ibuprofen, naproxen or other NSAIDs unless specifically directed by a clinician, as they can increase bleeding risk. Seek prompt care for severe pain or any warning signs."
    },
    {
        topic: "body_pain_danger",
        keywordsBn: [
            "ডেঙ্গুতে শরীর ব্যথা কি বিপজ্জনক",
            "ডেঙ্গুতে শরীর ব্যথা কি বিপদের লক্ষণ",
            "ডেঙ্গুতে গা ব্যথা কি বিপজ্জনক",
            "ডেঙ্গুতে পেশি ব্যথা কি বিপজ্জনক",
            "শরীর ব্যথা কি ডেঙ্গুর বিপদ সংকেত"
        ],
        keywordsEn: [
            "is body pain dangerous in dengue",
            "is muscle pain a danger sign of dengue",
            "does body ache mean severe dengue",
            "is dengue body pain a warning sign"
        ],
        answerBn: "শরীর বা পেশি ব্যথা ডেঙ্গুর পরিচিত উপসর্গ; একা এই ব্যথা সাধারণত severe dengue-এর সতর্কতামূলক লক্ষণ নয় এবং ব্যথার মাত্রা দিয়ে রোগের তীব্রতা বোঝা যায় না। তবে তীব্র পেটব্যথা, বারবার বমি, নাক বা মাড়ি দিয়ে রক্তপাত, রক্তবমি বা কালো পায়খানা, শ্বাসকষ্ট, অস্বাভাবিক অস্থিরতা বা ঝিমুনি হলে জরুরি চিকিৎসা নিন। সন্দেহ হলে চিকিৎসকের মূল্যায়ন করান।",
        answerEn: "Body or muscle aches are common dengue symptoms. Pain alone is not usually a warning sign of severe dengue, and pain intensity does not reliably show disease severity. Seek urgent medical care for severe abdominal pain, persistent vomiting, nose or gum bleeding, vomiting blood or black stools, breathing difficulty, unusual restlessness or drowsiness. Get assessed by a healthcare professional if you are concerned."
    },
    {
        topic: "fever_management",
        keywordsBn: [
            "ডেঙ্গুতে জ্বর হলে কী করব",
            "ডেঙ্গুতে জ্বর হলে কি করবো",
            "ডেঙ্গু জ্বর কমানোর উপায়",
            "ডেঙ্গুতে জ্বর কমাবো কীভাবে",
            "ডেঙ্গুতে জ্বর হলে করণীয়",
            "ডেঙ্গুতে জ্বরের সময় কী করতে হবে"
        ],
        keywordsEn: [
            "what to do for fever in dengue",
            "how to manage dengue fever",
            "how to reduce fever in dengue",
            "what should i do if i have dengue fever"
        ],
        answerBn: "ডেঙ্গুতে জ্বর হলে বিশ্রাম নিন, পর্যাপ্ত পানি ও উপযুক্ত তরল পান করুন এবং শরীরের তাপমাত্রা পর্যবেক্ষণ করুন। জ্বরের ওষুধ নেওয়ার আগে চিকিৎসক বা ফার্মাসিস্টের পরামর্শ নিন; Aspirin, Ibuprofen, Naproxen বা অন্য NSAID নিজে থেকে খাবেন না, কারণ রক্তপাতের ঝুঁকি বাড়তে পারে। জ্বর কমে গেলেও সতর্ক থাকুন—তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট বা অস্বাভাবিক ঝিমুনি হলে জরুরি চিকিৎসা নিন।",
        answerEn: "If you have fever with suspected dengue, rest, maintain adequate fluids and monitor your temperature. Ask a healthcare professional before taking fever medicine. Do not self-medicate with aspirin, ibuprofen, naproxen or other NSAIDs because they can increase bleeding risk. Stay alert even if the fever settles; seek urgent care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty or unusual drowsiness."
    },
    {
        topic: "fever_duration",
        keywordsBn: [
            "ডেঙ্গুতে জ্বর কতদিন থাকে",
            "ডেঙ্গু জ্বর কয়দিন থাকে",
            "ডেঙ্গুর জ্বর কতদিন স্থায়ী হয়",
            "ডেঙ্গুতে জ্বর কখন কমে",
            "ডেঙ্গু জ্বর কতদিনে ভালো হয়"
        ],
        keywordsEn: [
            "how long does dengue fever last",
            "how many days does dengue fever last",
            "when does dengue fever go away",
            "duration of dengue fever"
        ],
        answerBn: "ডেঙ্গুতে জ্বর সাধারণত কয়েক দিন স্থায়ী হতে পারে; অনেক ক্ষেত্রে প্রায় ২–৭ দিনের মধ্যে কমে, তবে সবার অভিজ্ঞতা এক নয়। জ্বর কমে যাওয়ার সময় বা পরেও কিছু রোগীর অবস্থা খারাপ হতে পারে, তাই চিকিৎসকের পরামর্শ ও পর্যবেক্ষণ গুরুত্বপূর্ণ। তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট, অস্বাভাবিক ঝিমুনি বা অস্থিরতা হলে দ্রুত হাসপাতালে যান।",
        answerEn: "Dengue fever commonly lasts several days and often settles within about 2–7 days, but this varies. Some patients can worsen around the time the fever goes away, so medical advice and monitoring remain important. Seek urgent care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty, unusual drowsiness or restlessness."
    },
    {
        topic: "headache_eye_pain",
        keywordsBn: [
            "ডেঙ্গুতে মাথাব্যথা কেন হয়",
            "ডেঙ্গুতে মাথা ব্যথা হলে কী করব",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা কেন",
            "ডেঙ্গুতে চোখের পেছনে ব্যথা হলে কী করব",
            "ডেঙ্গুতে মাথা ও চোখ ব্যথা",
            "ডেঙ্গুতে চোখ ব্যথা কি স্বাভাবিক"
        ],
        keywordsEn: [
            "why does dengue cause headache",
            "headache in dengue what to do",
            "pain behind the eyes in dengue",
            "why do eyes hurt in dengue",
            "dengue headache and eye pain"
        ],
        answerBn: "মাথাব্যথা এবং চোখের পেছনে ব্যথা ডেঙ্গুর পরিচিত উপসর্গ। সংক্রমণের সময় শরীরের প্রতিরক্ষা-প্রতিক্রিয়া ও প্রদাহের সঙ্গে এগুলো সম্পর্কিত হতে পারে। বিশ্রাম নিন, পর্যাপ্ত তরল পান করুন এবং ওষুধ নেওয়ার আগে চিকিৎসকের পরামর্শ নিন; Aspirin বা Ibuprofen নিজে থেকে খাবেন না। মাথাব্যথা খুব তীব্র হলে, ঘাড় শক্ত হয়ে গেলে, অজ্ঞানভাব, বিভ্রান্তি, বারবার বমি বা অন্য সতর্কতামূলক লক্ষণ দেখা দিলে জরুরি চিকিৎসা নিন।",
        answerEn: "Headache and pain behind the eyes are recognized symptoms of dengue and may be related to the body's immune and inflammatory response. Rest, drink adequate fluids and consult a healthcare professional before taking medicine. Do not self-medicate with aspirin or ibuprofen. Seek urgent care for a very severe headache, stiff neck, fainting, confusion, repeated vomiting or other warning signs."
    },
    {
        topic: "dengue_rash",
        keywordsBn: [
            "ডেঙ্গুতে র‍্যাশ কেন হয়",
            "ডেঙ্গুতে শরীরে লাল দাগ কেন",
            "ডেঙ্গুতে গায়ে ফুসকুড়ি হলে কী করব",
            "ডেঙ্গুতে চামড়ায় র‍্যাশ",
            "ডেঙ্গুতে লাল লাল দাগ কি স্বাভাবিক",
            "ডেঙ্গুতে চুলকানি ও র‍্যাশ"
        ],
        keywordsEn: [
            "why does dengue cause rash",
            "red spots on skin in dengue",
            "dengue rash what to do",
            "itchy rash during dengue",
            "skin rash with dengue"
        ],
        answerBn: "ডেঙ্গুতে কিছু মানুষের ত্বকে লালচে র‍্যাশ বা দাগ দেখা দিতে পারে। তবে সব র‍্যাশ ডেঙ্গুর কারণে হয় না এবং শুধু র‍্যাশ দেখে ডেঙ্গু নিশ্চিত করা যায় না। র‍্যাশের সঙ্গে নাক-মাড়ি দিয়ে রক্তপাত, সহজে কালশিটে পড়া, রক্তবমি, কালো পায়খানা বা দুর্বলতা বাড়লে দ্রুত চিকিৎসা নিন। র‍্যাশ নতুন হলে বা বাড়তে থাকলে চিকিৎসকের কাছে দেখান; নিজে থেকে ওষুধ বা ক্রিম ব্যবহার করবেন না।",
        answerEn: "Some people with dengue develop a reddish skin rash or spots. However, not every rash is caused by dengue, and a rash alone cannot confirm the diagnosis. Seek urgent medical care if the rash occurs with nose or gum bleeding, unusual bruising, vomiting blood, black stools or worsening weakness. Have a new or worsening rash assessed by a healthcare professional and avoid self-prescribing creams or medicines."
    },
    {
        topic: "nausea_vomiting",
        keywordsBn: [
            "ডেঙ্গুতে বমি বমি ভাব কেন হয়",
            "ডেঙ্গুতে বমি হলে কী করব",
            "ডেঙ্গুতে বমি বমি লাগলে করণীয়",
            "ডেঙ্গুতে বমি হওয়া কি স্বাভাবিক",
            "ডেঙ্গুতে খেতে ইচ্ছা করে না বমি লাগে"
        ],
        keywordsEn: [
            "nausea in dengue what to do",
            "why does dengue cause nausea",
            "vomiting during dengue what should i do",
            "is vomiting common in dengue"
        ],
        answerBn: "ডেঙ্গুতে বমি বমি ভাব বা অল্প বমি হতে পারে। অল্প অল্প করে বারবার পানি বা উপযুক্ত তরল পান করার চেষ্টা করুন এবং সহ্য হলে সহজপাচ্য খাবার খান। কিন্তু বারবার বা অবিরাম বমি হলে, তরল রাখতে না পারলে, প্রস্রাব কমে গেলে বা দুর্বলতা বাড়লে দ্রুত চিকিৎসা নিন। বারবার বমি ডেঙ্গুর একটি সতর্কতামূলক লক্ষণ হতে পারে—এটি অবহেলা করবেন না।",
        answerEn: "Nausea or occasional vomiting can occur with dengue. Try small, frequent sips of water or suitable fluids and eat simple foods if tolerated. Get medical help promptly if vomiting is repeated or persistent, you cannot keep fluids down, urination decreases or weakness worsens. Persistent vomiting can be a dengue warning sign and should not be ignored."
    },
    {
        topic: "platelet_low_count",
        keywordsBn: [
             "ডেঙ্গুতে প্লেটলেট ৭০ হাজার হলে কী করব",
            "ডেঙ্গুতে প্লাটিলেট ৭০ হাজার হলে কী করব",
            "ডেঙ্গুতে প্লেটলেট ৭০০০০ হলে কী করব",
            "ডেঙ্গুতে প্লেটলেট ৭০,০০০ হলে কী করব",
            "ডেঙ্গুতে প্লাটিলেট 70000 হলে কী করব",
            "ডেঙ্গুতে platelet 70000 হলে কী করব",
            "ডেঙ্গুতে প্লেটলেট কমে গেলে কী করব",
            "ডেঙ্গুতে প্লাটিলেট কম হলে করণীয়",
            "ডেঙ্গুতে platelet কমে গেলে করণীয়",
            "ডেঙ্গুতে প্লেটলেট ৫০ হাজার হলে কী করব",
            "ডেঙ্গুতে প্লেটলেট ১ লাখের নিচে হলে কী করব"
        ],
        keywordsEn: [
            "what to do if platelet count is 70000 in dengue",
            "what if platelets are low in dengue",
            "dengue platelet count 70000 what to do",
            "low platelet count in dengue what should i do"
        ],
        answerBn: "ডেঙ্গুতে প্লেটলেট ৭০,০০০ বা কম পাওয়া গেলে রিপোর্টটি দ্রুত চিকিৎসককে দেখান এবং তাঁর পরামর্শ অনুযায়ী রোগীর অবস্থা ও CBC-এর ধারাবাহিক পরিবর্তন পর্যবেক্ষণ করুন। শুধু একটি Platelet Count দিয়ে ডেঙ্গুর তীব্রতা বা রক্ত দেওয়ার প্রয়োজন নির্ধারণ করা যায় না; Hematocrit-এর পরিবর্তন, রক্তপাত, রক্তচাপ, প্রস্রাবের পরিমাণ ও অন্যান্য লক্ষণও গুরুত্বপূর্ণ। নিজে থেকে Aspirin বা Ibuprofen খাবেন না এবং নিজে থেকে platelet transfusion-এর সিদ্ধান্ত নেবেন না। তীব্র পেটব্যথা, বারবার বমি, নাক-মাড়ি দিয়ে রক্তপাত, রক্তবমি/কালো পায়খানা, শ্বাসকষ্ট, ঠান্ডা-আঠালো ত্বক, অস্থিরতা বা অস্বাভাবিক ঝিমুনি হলে এখনই জরুরি বিভাগে যান।",
        answerEn: "If a dengue patient's platelet count is 70,000 or lower, show the report promptly to a clinician and follow their advice on clinical assessment and repeat CBC monitoring. A single platelet count cannot determine dengue severity or the need for transfusion; hematocrit trends, bleeding, blood pressure, urine output and other symptoms matter. Do not self-medicate with aspirin or ibuprofen, and do not decide on platelet transfusion yourself. Seek emergency care for severe abdominal pain, persistent vomiting, nose or gum bleeding, vomiting blood or black stools, breathing difficulty, cold clammy skin, restlessness or unusual drowsiness."
    },
    {
        topic: "platelet_drop_cause",
        keywordsBn: [
            "ডেঙ্গুতে প্লেটলেট কমে কেন",
            "ডেঙ্গুতে প্লাটিলেট কমে কেন",
            "ডেঙ্গুতে platelet কমে যাওয়ার কারণ",
            "ডেঙ্গুতে অনুচক্রিকা কমে কেন",
            "ডেঙ্গুতে প্লেটলেট কমে যাওয়ার কারণ কী"
        ],
        keywordsEn: [
            "why do platelets decrease in dengue",
            "why does dengue lower platelet count",
            "cause of low platelets in dengue",
            "why are platelets low during dengue"
        ],
        answerBn: "ডেঙ্গু সংক্রমণের সময় অস্থিমজ্জায় platelet তৈরি সাময়িকভাবে কমে যেতে পারে এবং শরীরে platelet বেশি ভাঙা বা ব্যবহৃত হতে পারে। এ কারণে platelet count কমতে পারে। তবে platelet কমার মাত্রা একা রোগের severity বোঝায় না। চিকিৎসক সাধারণত রোগীর অবস্থা, CBC trend, Hematocrit এবং bleeding বা warning signs একসঙ্গে মূল্যায়ন করেন।",
        answerEn: "During dengue infection, platelet production in the bone marrow may temporarily decrease, while platelets may also be destroyed or consumed more rapidly. This can lower the platelet count. However, the count alone does not show how severe the illness is. Clinicians assess the patient's condition, CBC trends, hematocrit and any bleeding or warning signs together."
    },
    {
        topic: "platelet_recovery",
        keywordsBn: [
            "ডেঙ্গুতে প্লেটলেট কতদিনে বাড়ে",
            "ডেঙ্গুতে প্লাটিলেট কখন বাড়ে",
            "ডেঙ্গুতে platelet recovery কতদিন",
            "ডেঙ্গুতে প্লেটলেট আবার স্বাভাবিক হতে কতদিন লাগে",
            "ডেঙ্গুতে প্লেটলেট কীভাবে বাড়ে"
        ],
        keywordsEn: [
            "how long do platelets take to recover after dengue",
            "when do platelets increase in dengue",
            "dengue platelet recovery time",
            "how do platelets recover after dengue"
        ],
        answerBn: "ডেঙ্গুতে platelet count সাধারণত রোগের critical phase পার হওয়ার পর ধীরে ধীরে বাড়তে শুরু করে, তবে সময় ব্যক্তি ভেদে আলাদা। শুধু একটি রিপোর্ট দেখে recovery নিশ্চিত করা যায় না; ধারাবাহিক CBC এবং রোগীর সামগ্রিক অবস্থা গুরুত্বপূর্ণ। platelet বাড়ানোর জন্য কোনো খাবার বা ঘরোয়া উপায় দ্রুত platelet স্বাভাবিক করে—এমন নির্ভরযোগ্য প্রমাণ নেই। চিকিৎসকের পরামর্শ অনুযায়ী follow-up করুন।",
        answerEn: "In dengue, platelet counts often begin to recover gradually after the critical phase, but timing varies from person to person. One test cannot confirm recovery; serial CBC results and the patient's overall condition matter. There is no reliable evidence that a particular food or home remedy rapidly normalizes platelet counts. Follow the monitoring plan advised by the treating clinician."
    },
    {
        topic: "cbc_report",
        keywordsBn: [
            "ডেঙ্গুতে CBC রিপোর্ট কীভাবে বুঝব",
            "ডেঙ্গুতে CBC রিপোর্ট বুঝব কীভাবে",
            "ডেঙ্গুতে CBC রিপোর্টে কী দেখা যায়",
            "ডেঙ্গুতে WBC কমে গেলে কী বোঝায়",
            "ডেঙ্গুতে white blood cell কমে কেন",
            "ডেঙ্গুতে হিমোগ্লোবিন ও platelet রিপোর্ট",
            "ডেঙ্গুতে CBC test কেন করা হয়"
        ],
        keywordsEn: [
            "how to understand CBC report in dengue",
            "what does CBC show in dengue",
            "low white blood cells in dengue meaning",
            "why is WBC low in dengue",
            "why is CBC test done for dengue"
        ],
        answerBn: "ডেঙ্গুতে CBC রিপোর্টে সাধারণত platelet count, White Blood Cell (WBC) count এবং Hematocrit (HCT) দেখা হয়। সময়ের সঙ্গে এসব মান কীভাবে বদলাচ্ছে, তা একটি মাত্র ফলাফলের চেয়ে বেশি গুরুত্বপূর্ণ হতে পারে। WBC কমতে পারে, platelet কমতে পারে এবং plasma leakage হলে Hematocrit বাড়তে পারে। তবে বয়স, লিঙ্গ, পানিশূন্যতা, আগের baseline ও ল্যাবের reference range বিবেচনা করে চিকিৎসক রিপোর্ট ব্যাখ্যা করবেন। শুধু CBC দিয়ে একা ডেঙ্গু নিশ্চিত বা severity নির্ধারণ করা যায় না।",
        answerEn: "A dengue-related CBC commonly includes platelet count, white blood cell (WBC) count and hematocrit (HCT). How these values change over time may be more informative than one isolated result. WBC and platelets may fall, while hematocrit can rise with plasma leakage. A clinician should interpret the report using age, sex, hydration, baseline values and the laboratory's reference range. CBC alone cannot confirm dengue or determine severity."
    },
    {
        topic: "hematocrit_rising",
        keywordsBn: [
            "ডেঙ্গুতে hematocrit বাড়লে কী বোঝায়",
            "ডেঙ্গুতে হেমাটোক্রিট বেড়ে গেলে কী হয়",
            "ডেঙ্গুতে HCT বাড়ার কারণ",
            "ডেঙ্গুতে PCV বাড়লে কী বোঝায়",
            "ডেঙ্গুতে platelet কমে hematocrit বাড়ে কেন"
        ],
        keywordsEn: [
            "what does rising hematocrit mean in dengue",
            "why does hematocrit increase in dengue",
            "high HCT in dengue meaning",
            "rising PCV with low platelets in dengue"
        ],
        answerBn: "ডেঙ্গুতে Hematocrit (HCT) আগের baseline-এর তুলনায় বাড়তে থাকলে plasma leakage ও রক্ত ঘন হয়ে যাওয়ার ইঙ্গিত হতে পারে, বিশেষ করে platelet কমার সঙ্গে ঘটলে। এটি চিকিৎসকের দ্রুত মূল্যায়ন প্রয়োজন এমন একটি গুরুত্বপূর্ণ trend। তবে একবারের HCT মান দিয়ে সিদ্ধান্ত নেওয়া যায় না; আগের রিপোর্ট, fluid status, vital signs ও রোগীর লক্ষণ মিলিয়ে দেখতে হয়। পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট, ঠান্ডা-আঠালো ত্বক বা প্রস্রাব কমে গেলে জরুরি চিকিৎসা নিন।",
        answerEn: "A rising hematocrit compared with a patient's baseline may indicate plasma leakage and hemoconcentration in dengue, particularly when platelets are also falling. This trend needs prompt clinical assessment. A single HCT value is not enough; clinicians compare previous results, fluid status, vital signs and symptoms. Seek urgent care for abdominal pain, persistent vomiting, bleeding, breathing difficulty, cold clammy skin or reduced urine output."
    },
    {
        topic: "ns1_test",
        keywordsBn: [
            "ডেঙ্গু NS1 positive মানে কী",
            "ডেঙ্গুতে NS1 positive মানে কী",
            "NS1 পজিটিভ হলে কী বোঝায়",
            "ডেঙ্গু NS1 negative হলে কি ডেঙ্গু নেই",
            "NS1 test কখন করতে হয়",
            "ডেঙ্গুতে NS1 পরীক্ষা কী",
            "NS1 রিপোর্ট কীভাবে বুঝব"
        ],
        keywordsEn: [
            "what does dengue NS1 positive mean",
            "what if NS1 test is negative",
            "when should NS1 test be done for dengue",
            "what is dengue NS1 antigen test",
            "how to interpret NS1 dengue test"
        ],
        answerBn: "NS1 হলো Dengue virus-এর একটি antigen, যা সাধারণত অসুস্থতার প্রথম ৭ দিনের মধ্যে রক্তে শনাক্ত করা যেতে পারে। NS1 positive ফল বর্তমান বা সাম্প্রতিক dengue infection-এর পক্ষে শক্ত প্রমাণ। কিন্তু NS1 negative হলেই dengue নেই—এ কথা বলা যায় না; পরীক্ষার সময় ও অন্যান্য test গুরুত্বপূর্ণ। উপসর্গ শুরুর দিন অনুযায়ী চিকিৎসক NS1-এর সঙ্গে IgM বা RT-PCR/NAAT বিবেচনা করতে পারেন। রিপোর্ট চিকিৎসককে দেখান।",
        answerEn: "NS1 is an antigen from the dengue virus that can usually be detected in blood during the first 7 days of illness. A positive NS1 result is strong evidence of a current or recent dengue infection. A negative NS1 result does not rule dengue out; timing and other tests matter. Depending on the day of illness, a clinician may consider IgM together with NS1 or RT-PCR/NAAT. Have the result interpreted by a healthcare professional."
    },
    {
        topic: "igg_interpretation",
        keywordsBn: [
            "ডেঙ্গুতে IgG positive মানে কী",
            "ডেঙ্গুতে শুধু IgG positive হলে কী বোঝায়",
            "ডেঙ্গু IgG positive হলে কি এখন ডেঙ্গু",
            "ডেঙ্গুতে IgG দিয়ে কি acute dengue বোঝা যায়"
        ],
        keywordsEn: [
            "what does dengue IgG positive mean",
            "what does a single positive dengue IgG mean",
            "does a single positive IgG mean acute dengue",
            "does positive dengue IgG mean current infection"
        ],
        answerBn: "একবারের Dengue IgG positive ফল দিয়ে বর্তমানে acute dengue infection নিশ্চিত করা যায় না। IgG আগের dengue সংক্রমণ বা অন্য flavivirus-এর antibody-এর কারণে positive থাকতে পারে। ফলাফল বোঝার জন্য উপসর্গ শুরুর দিন, NS1/RT-PCR/NAAT, IgM এবং রোগীর clinical condition বিবেচনা করতে হয়। রিপোর্ট চিকিৎসককে দেখান; শুধু IgG দেখে নিজে diagnosis করবেন না।",
        answerEn: "A single positive dengue IgG result cannot confirm a current acute dengue infection. IgG may reflect a past dengue infection or antibodies from another flavivirus. Interpretation depends on the day symptoms began, NS1 or RT-PCR/NAAT results, IgM and the patient's clinical condition. Have the report reviewed by a clinician; do not diagnose acute dengue from IgG alone."
    },
    {
        topic: "igm_igg_test",
        keywordsBn: [
            "ডেঙ্গু IgM ও IgG মানে কী",
            "ডেঙ্গুতে IgM positive হলে কী বোঝায়",
            "ডেঙ্গুতে IgG positive মানে কী",
            "ডেঙ্গুতে শুধু IgG positive হলে কী বোঝায়",
            "ডেঙ্গু IgM negative IgG positive",
            "ডেঙ্গুতে IgM কখন positive হয়",
            "ডেঙ্গুতে IgG দিয়ে কি acute dengue বোঝা যায়"
        ],
        keywordsEn: [
            "what do dengue IgM and IgG mean",
            "what does dengue IgM positive mean",
            "what does dengue IgG positive mean",
            "when does dengue IgM become positive",
            "what does a single positive dengue IgG mean",
            "does a single positive IgG mean acute dengue"
        ],
        answerBn: "Dengue IgM সাধারণত উপসর্গ শুরুর প্রায় ৪–৫ দিন পর শনাক্ত হতে শুরু করে এবং সাম্প্রতিক সংক্রমণের ইঙ্গিত দিতে পারে; এটি কয়েক মাস পর্যন্ত positive থাকতে পারে। একবারের IgG positive ফল দিয়ে acute dengue নিশ্চিত করা যায় না, কারণ আগের dengue বা অন্য flavivirus সংক্রমণের antibody থাকতে পারে। প্রথম ৭ দিনে NS1 বা RT-PCR/NAAT-এর সঙ্গে IgM পরীক্ষা বিবেচনা করা হয়; ৭ দিনের পরে IgM বেশি উপযোগী হতে পারে। ফলাফল অসুস্থতার দিন ও clinical picture অনুযায়ী চিকিৎসক ব্যাখ্যা করবেন।",
        answerEn: "Dengue IgM usually becomes detectable around 4–5 days after symptoms begin and may indicate a recent infection; it can remain positive for up to about 3 months. A single positive IgG result cannot diagnose acute dengue because it may reflect a past dengue or other flavivirus infection. During the first 7 days, clinicians may use NS1 or RT-PCR/NAAT together with IgM; after day 7, IgM becomes more useful. A clinician should interpret results based on illness timing and the clinical picture."
    },
    {
        topic: "dengue_food_general",
        keywordsBn: [
            "ডেঙ্গুতে কী খাবার খাওয়া উচিত",
            "ডেঙ্গু হলে কী খাবার খেতে হবে",
            "ডেঙ্গু রোগীর খাবার তালিকা",
            "ডেঙ্গুতে কোন খাবার ভালো",
            "ডেঙ্গুতে কী খাওয়া যাবে",
            "ডেঙ্গু রোগীর খাদ্য তালিকা",
            "ডেঙ্গুতে পুষ্টিকর খাবার কী কী"
        ],
        keywordsEn: [
            "what foods should i eat with dengue",
            "what should a dengue patient eat",
            "diet for dengue patient",
            "best foods to eat during dengue",
            "what can i eat during dengue fever"
        ],
        answerBn: "ডেঙ্গুতে ক্ষুধা ও সহ্যক্ষমতা অনুযায়ী অল্প অল্প করে সহজপাচ্য, স্বাভাবিক পুষ্টিকর খাবার খান—যেমন ভাত বা খিচুড়ি, ডাল, স্যুপ, নরম সবজি, ফল, দই, ডিম বা অন্যান্য প্রোটিনসমৃদ্ধ খাবার (যদি সহ্য হয়)। পর্যাপ্ত নিরাপদ তরল পান করা গুরুত্বপূর্ণ। বমি বমি ভাব থাকলে একবারে বেশি না খেয়ে অল্প অল্প করে বারবার খান। কোনো বিশেষ খাবার ডেঙ্গু সারায় বা দ্রুত platelet বাড়ায়—এমন নিশ্চয়তা নেই। Warning sign থাকলে খাবার দিয়ে সামলানোর চেষ্টা না করে জরুরি চিকিৎসা নিন।",
        answerEn: "Eat small, frequent portions of familiar, nutritious foods that you can tolerate, such as rice or khichuri, lentils, soup, soft vegetables, fruit, yogurt, eggs or other protein foods. Maintain adequate safe fluids. If you feel nauseated, try small amounts more often rather than large meals. No specific food cures dengue or reliably raises platelets quickly. Do not try to manage warning signs with food; seek urgent medical care."
    },
    {
        topic: "dengue_hydration_ors",
        keywordsBn: [
            "ডেঙ্গুতে কী কী পানীয় খাওয়া উচিত",
            "ডেঙ্গুতে ORS খাওয়া যাবে কি",
            "ডেঙ্গুতে স্যালাইন খাওয়া উচিত কি",
            "ডেঙ্গুতে কতটুকু পানি পান করতে হবে",
            "ডেঙ্গুতে পানিশূন্যতা এড়াব কীভাবে",
            "ডেঙ্গুতে বমি হলে পানি কীভাবে খাব"
        ],
        keywordsEn: [
            "what fluids should i drink during dengue",
            "can i drink ORS in dengue",
            "should dengue patients drink oral rehydration solution",
            "how to prevent dehydration in dengue",
            "how much water to drink during dengue"
        ],
        answerBn: "ডেঙ্গুতে পানিশূন্যতা এড়ানো জরুরি। পানি প্রধান পানীয় হিসেবে নিন; চিকিৎসকের পরামর্শ অনুযায়ী ORS, স্যুপ, ভাতের মাড়, চিনি ছাড়া পাতলা ফলের রস, ডাবের পানি বা দইয়ের পানীয়ও নেওয়া যেতে পারে। বমি বমি ভাব থাকলে অল্প অল্প করে ঘন ঘন পান করুন। ORS প্যাকেটের নির্দেশনা অনুযায়ী ঠিক পরিমাণ নিরাপদ পানিতে মিশিয়ে তৈরি করুন—ঘন বা পাতলা করবেন না। প্রস্রাব অনেক কমে গেলে, তরল রাখতে না পারলে বা দুর্বলতা বাড়লে দ্রুত চিকিৎসা নিন। হৃদ্‌রোগ, কিডনি রোগ বা তরল সীমিত রাখার নির্দেশ থাকলে নিজে থেকে বেশি তরল খাবেন না; চিকিৎসকের কাছ থেকে পরিমাণ জেনে নিন।",
        answerEn: "Preventing dehydration is important in dengue. Use water as the main fluid; as appropriate, oral rehydration solution (ORS), soup, rice water, unsweetened diluted juice, coconut water or yogurt drinks may also be used. Take small, frequent sips if nauseated. Prepare ORS exactly as directed on the packet using safe water; do not make it more concentrated or dilute. Seek medical advice promptly if urine output drops, you cannot keep fluids down or weakness worsens. If you have heart or kidney disease or have been told to restrict fluids, ask your clinician how much is safe."
    },
    {
        topic: "coconut_water_dengue",
        keywordsBn: [
            "ডেঙ্গুতে ডাবের পানি খাওয়া যাবে কি",
            "ডেঙ্গুতে ডাবের পানি কি উপকারী",
            "ডেঙ্গু রোগী কি নারকেলের পানি খেতে পারে",
            "ডেঙ্গুতে coconut water খাওয়া যাবে"
        ],
        keywordsEn: [
            "can i drink coconut water during dengue",
            "is coconut water good for dengue",
            "can dengue patients drink coconut water"
        ],
        answerBn: "ডেঙ্গুতে ডাবের পানি পান করা যেতে পারে, যদি তা নিরাপদ ও পরিষ্কার হয় এবং আপনার চিকিৎসক তরল গ্রহণে বাধা না দিয়ে থাকেন। এটি পানি ও অন্যান্য উপযুক্ত তরলের বিকল্প নয়, বরং অতিরিক্ত একটি পানীয় হতে পারে। ডাবের পানি ডেঙ্গু সারায় বা platelet বাড়ায়—এমন নির্ভরযোগ্য প্রমাণ নেই। কিডনি রোগ, potassium বেশি থাকার সমস্যা বা fluid restriction থাকলে আগে চিকিৎসকের পরামর্শ নিন।",
        answerEn: "Coconut water can be one of the fluids a person with dengue drinks if it is hygienically prepared and their clinician has not restricted fluids. It is an additional option, not a replacement for water or prescribed ORS. There is no reliable proof that coconut water cures dengue or raises platelets. Ask a clinician first if you have kidney disease, high potassium or a fluid restriction."
    },
    {
        topic: "papaya_leaf_dengue",
        keywordsBn: [
            "ডেঙ্গুতে পেঁপে পাতার রস খেলে কি প্লেটলেট বাড়ে",
            "ডেঙ্গুতে পেঁপে পাতার রস কি platelet বাড়ায়",
            "ডেঙ্গুতে পেঁপে পাতার রস খাওয়া যাবে কি",
            "পেঁপে পাতার রস কি ডেঙ্গু সারায়",
            "ডেঙ্গুতে পেঁপে পাতার উপকারিতা",
            "ডেঙ্গুতে papaya leaf juice কি কাজ করে"
        ],
        keywordsEn: [
            "does papaya leaf juice increase platelets in dengue",
            "can i take papaya leaf juice for dengue",
            "does papaya leaf extract cure dengue",
            "is papaya leaf juice proven for dengue"
        ],
        answerBn: "পেঁপে পাতার রস বা extract ডেঙ্গু সারায়, রক্তপাত বা shock ঠেকায়, কিংবা নিরাপদে platelet বাড়ায়—এমন শক্ত ও নির্ভরযোগ্য প্রমাণ নেই। কিছু ছোট গবেষণায় platelet count বাড়ার ইঙ্গিত পাওয়া গেলেও রোগীর গুরুত্বপূর্ণ clinical outcome-এ উপকার নিশ্চিত নয় এবং প্রস্তুতি ও মাত্রাও একরকম নয়। তাই এটি standard চিকিৎসা, পর্যবেক্ষণ বা জরুরি চিকিৎসার বিকল্প নয়। নিজে থেকে পেঁপে পাতার রস বা supplement শুরু করার আগে চিকিৎসকের সঙ্গে কথা বলুন।",
        answerEn: "There is not strong, reliable evidence that papaya leaf juice or extract cures dengue, prevents bleeding or shock, or safely raises platelets. Some small studies suggest platelet counts may increase, but benefit on important clinical outcomes is uncertain and products and doses are not standardized. It must never replace standard care, monitoring or urgent treatment. Speak with a clinician before using papaya leaf juice or supplements."
    },
    {
        topic: "dengue_food_avoid",
        keywordsBn: [
            "ডেঙ্গুতে কোন খাবার খাওয়া যাবে না",
            "ডেঙ্গুতে কী কী খাবার এড়িয়ে চলতে হবে",
            "ডেঙ্গু রোগীর নিষিদ্ধ খাবার কী",
            "ডেঙ্গুতে ঠান্ডা খাবার খাওয়া যাবে কি",
            "ডেঙ্গুতে মসলাযুক্ত খাবার খাওয়া যাবে কি"
        ],
        keywordsEn: [
            "what foods should i avoid with dengue",
            "which foods are forbidden in dengue",
            "foods to avoid during dengue fever",
            "can i eat spicy food during dengue"
        ],
        answerBn: "ডেঙ্গুতে সবার জন্য নির্দিষ্ট দীর্ঘ নিষিদ্ধ খাবারের তালিকা নেই। যে খাবারে বমি, পেটের অস্বস্তি বা ডায়রিয়া বাড়ে তা আপাতত এড়িয়ে চলুন; নিরাপদে প্রস্তুত ও পরিষ্কার খাবার খান। অতিরিক্ত মিষ্টি কোমল পানীয় ও খুব বেশি চিনিযুক্ত পানীয় এড়িয়ে চলা ভালো, বিশেষ করে ডায়াবেটিস থাকলে। অ্যালকোহল পান করবেন না। খেতে না পারা, বারবার বমি বা Warning sign হলে চিকিৎসা নিন।",
        answerEn: "There is no universal long list of foods forbidden for everyone with dengue. Temporarily avoid foods that worsen nausea, stomach discomfort or diarrhea, and choose clean, safely prepared food. It is sensible to avoid very sugary soft drinks, especially if you have diabetes. Avoid alcohol. Seek medical care if you cannot eat or drink, have repeated vomiting or develop warning signs."
    },
    {
        topic: "dengue_appetite_nausea_food",
        keywordsBn: [
            "ডেঙ্গুতে খেতে ইচ্ছা না করলে কী খাব",
            "ডেঙ্গুতে ক্ষুধা না লাগলে কী করব",
            "ডেঙ্গুতে বমি বমি ভাব থাকলে কী খাব",
            "ডেঙ্গু রোগী খাবার খেতে না পারলে কী করবে",
            "ডেঙ্গুতে অল্প অল্প করে কী খাওয়া যায়"
        ],
        keywordsEn: [
            "what to eat when dengue patient has no appetite",
            "what to eat with nausea during dengue",
            "dengue patient cannot eat what to do",
            "foods for dengue when appetite is low"
        ],
        answerBn: "ডেঙ্গুতে ক্ষুধা কমে গেলে একবারে বেশি খাবেন না। অল্প অল্প করে বারবার নরম ভাত, খিচুড়ি, পাতলা ডাল, স্যুপ, কলা বা অন্য সহজপাচ্য খাবার খেতে পারেন—যা আপনার সহ্য হয়। তরলও অল্প অল্প করে ঘন ঘন পান করুন। একেবারেই তরল রাখতে না পারলে, বারবার বমি হলে বা প্রস্রাব কমে গেলে দ্রুত চিকিৎসা নিন; পানিশূন্যতা বিপজ্জনক হতে পারে।",
        answerEn: "If your appetite is low during dengue, do not force large meals. Try small, frequent portions of soft rice, khichuri, thin lentil soup, soup, banana or other easy-to-tolerate foods. Sip fluids frequently in small amounts. Seek prompt medical care if you cannot keep fluids down, vomit repeatedly or pass much less urine, as dehydration can become dangerous."
    },
    {
        topic: "paracetamol_dengue",
        keywordsBn: [
            "ডেঙ্গুতে প্যারাসিটামল খাওয়া যাবে কি",
            "ডেঙ্গুতে paracetamol খাওয়া যাবে",
            "ডেঙ্গুতে জ্বরের জন্য প্যারাসিটামল",
            "ডেঙ্গুতে প্যারাসিটামল কতটুকু খাব",
            "ডেঙ্গুতে প্যারাসিটামল নিরাপদ কি",
            "ডেঙ্গু হলে প্যারাসিটামল খেতে পারি কি"
        ],
        keywordsEn: [
            "can i take paracetamol with dengue",
            "is paracetamol safe in dengue",
            "what medicine for fever in dengue",
            "can dengue patient take acetaminophen",
            "paracetamol dose in dengue"
        ],
        answerBn: "ডেঙ্গুতে জ্বর বা ব্যথার জন্য চিকিৎসকের পরামর্শ অনুযায়ী Paracetamol (Acetaminophen) ব্যবহার করা হয়। তবে বয়স, ওজন, লিভারের অবস্থা এবং অন্য ওষুধে Paracetamol আছে কি না—এসব দেখে সঠিক মাত্রা নির্ধারণ করতে হয়। প্যাকেট বা চিকিৎসকের নির্দেশের বেশি খাবেন না এবং একসঙ্গে একাধিক Paracetamol-যুক্ত cold/flu medicine খাবেন না; অতিরিক্ত Paracetamol লিভারের গুরুতর ক্ষতি করতে পারে। শিশু, গর্ভবতী ব্যক্তি বা লিভারের রোগ থাকলে আগে চিকিৎসকের পরামর্শ নিন। Aspirin বা Ibuprofen দিয়ে বিকল্প করবেন না।",
        answerEn: "Paracetamol (acetaminophen) is commonly used for fever or pain in dengue when advised by a healthcare professional. The appropriate dose depends on age, weight, liver health and whether other medicines also contain paracetamol. Do not exceed the label or clinician's instructions, and do not combine multiple paracetamol-containing cold/flu products; overdose can seriously damage the liver. Children, pregnant people and anyone with liver disease should seek professional advice. Do not substitute aspirin or ibuprofen."
    },
    {
        topic: "ibuprofen_dengue",
        keywordsBn: [
            "ডেঙ্গুতে ibuprofen খাওয়া যাবে কি",
            "ডেঙ্গুতে আইবুপ্রোফেন কেন নিষেধ",
            "ডেঙ্গুতে ibuprofen খেলে কী হয়",
            "ডেঙ্গুতে ibuprofen কি বিপজ্জনক",
            "ডেঙ্গুতে ব্যথার জন্য ibuprofen"
        ],
        keywordsEn: [
            "can i take ibuprofen with dengue",
            "why is ibuprofen avoided in dengue",
            "what happens if i take ibuprofen with dengue",
            "is ibuprofen dangerous in dengue"
        ],
        answerBn: "ডেঙ্গু সন্দেহ বা নিশ্চিত হলে Ibuprofen নিজে থেকে খাবেন না। এটি NSAID শ্রেণির ওষুধ; platelet-এর কাজ ও রক্ত জমাট বাঁধার প্রক্রিয়ায় প্রভাব ফেলে পেট বা অন্য জায়গায় রক্তপাতের ঝুঁকি বাড়াতে পারে। জ্বর বা ব্যথার জন্য চিকিৎসকের পরামর্শে Paracetamol ব্যবহার করা হয়। ভুল করে Ibuprofen খেয়ে ফেললে আর ডোজ নেবেন না এবং চিকিৎসক/ফার্মাসিস্টকে জানান; রক্তপাত, কালো পায়খানা, রক্তবমি বা দুর্বলতা/মাথা ঘোরা হলে জরুরি চিকিৎসা নিন।",
        answerEn: "Do not self-medicate with ibuprofen if dengue is suspected or confirmed. Ibuprofen is an NSAID and can affect platelet function and clotting, increasing the risk of bleeding. Paracetamol is generally used for fever or pain when advised by a clinician. If you have already taken ibuprofen, do not take more and contact a healthcare professional for advice. Seek emergency care for bleeding, black stools, vomiting blood, marked weakness or dizziness."
    },
    {
        topic: "aspirin_dengue",
        keywordsBn: [
            "ডেঙ্গুতে aspirin খাওয়া যাবে কি",
            "ডেঙ্গুতে অ্যাসপিরিন কেন নিষেধ",
            "ডেঙ্গুতে aspirin খেলে কী হয়",
            "ডেঙ্গুতে aspirin কি রক্তপাত বাড়ায়",
            "ডেঙ্গু হলে aspirin বন্ধ করব কি"
        ],
        keywordsEn: [
            "can i take aspirin with dengue",
            "why should aspirin be avoided in dengue",
            "does aspirin increase bleeding in dengue",
            "should i stop prescribed aspirin if i have dengue"
        ],
        answerBn: "ডেঙ্গু সন্দেহ বা নিশ্চিত হলে জ্বর বা ব্যথার জন্য Aspirin খাবেন না; এটি platelet-এর কার্যকারিতা কমিয়ে রক্তপাতের ঝুঁকি বাড়াতে পারে। তবে হৃদ্‌রোগ বা স্ট্রোক প্রতিরোধে চিকিৎসক আগে থেকে Aspirin দিয়ে থাকলে নিজে থেকে বন্ধ বা চালু রাখার সিদ্ধান্ত নেবেন না—আজই সেই চিকিৎসক বা হাসপাতালে যোগাযোগ করে নির্দেশ নিন। রক্তপাত, কালো পায়খানা বা রক্তবমি হলে জরুরি চিকিৎসা নিন।",
        answerEn: "Do not take aspirin for fever or pain when dengue is suspected or confirmed because it can impair platelet function and increase bleeding risk. However, if aspirin was prescribed for a heart or stroke-related condition, do not independently stop or continue it; contact the prescribing clinician or hospital promptly for individualized instructions. Seek emergency care for bleeding, black stools or vomiting blood."
    },
    {
        topic: "antibiotics_dengue",
        keywordsBn: [
            "ডেঙ্গুতে antibiotic খাওয়া লাগে কি",
            "ডেঙ্গুতে অ্যান্টিবায়োটিক প্রয়োজন কি",
            "ডেঙ্গুতে antibiotic কেন দেওয়া হয়",
            "ডেঙ্গু জ্বরে antibiotic কাজ করে কি",
            "ডেঙ্গুতে কোন antibiotic খেতে হবে"
        ],
        keywordsEn: [
            "are antibiotics needed for dengue",
            "do antibiotics work for dengue",
            "should i take antibiotics for dengue fever",
            "which antibiotic should i take for dengue"
        ],
        answerBn: "ডেঙ্গু একটি ভাইরাসজনিত রোগ, তাই uncomplicated dengue-এর চিকিৎসায় Antibiotic কাজ করে না এবং নিয়মিত প্রয়োজন হয় না। চিকিৎসক যদি আলাদা bacterial infection সন্দেহ বা নিশ্চিত করেন, তখন প্রয়োজন অনুযায়ী antibiotic দিতে পারেন। নিজে থেকে antibiotic শুরু করবেন না, অন্যের ওষুধ খাবেন না বা পুরোনো prescription ব্যবহার করবেন না।",
        answerEn: "Dengue is caused by a virus, so antibiotics do not treat uncomplicated dengue and are not routinely needed. A clinician may prescribe an antibiotic only if a separate bacterial infection is suspected or confirmed. Do not start antibiotics yourself, use someone else's medicine or reuse an old prescription."
    },
    {
        topic: "bleeding_risk_medicines",
        keywordsBn: [
            "ডেঙ্গুতে কোন ওষুধে রক্তপাত বাড়ে",
            "ডেঙ্গুতে কোন ওষুধ খাওয়া নিষেধ",
            "ডেঙ্গুতে NSAID খাওয়া যাবে কি",
            "ডেঙ্গুতে mefenamic acid খাওয়া যাবে কি",
            "ডেঙ্গুতে naproxen খাওয়া যাবে কি",
            "ডেঙ্গুতে painkiller কোনগুলো এড়াব"
        ],
        keywordsEn: [
            "which medicines increase bleeding risk in dengue",
            "which medicines should be avoided in dengue",
            "can i take NSAIDs with dengue",
            "can i take mefenamic acid with dengue",
            "can i take naproxen with dengue",
            "which painkillers to avoid in dengue"
        ],
        answerBn: "ডেঙ্গু সন্দেহ বা নিশ্চিত হলে Aspirin এবং NSAID শ্রেণির painkiller—যেমন Ibuprofen, Naproxen ও Mefenamic acid—এড়িয়ে চলুন, কারণ এগুলো রক্তপাতের ঝুঁকি বাড়াতে পারে। কিছু prescribed blood thinner বা antiplatelet ওষুধও রক্তপাতের ঝুঁকিতে প্রভাব ফেলে; তবে সেগুলো নিজে থেকে বন্ধ করবেন না। আপনার সব prescription, painkiller, supplement ও herbal product-এর তালিকা চিকিৎসককে দেখিয়ে কোনটি চালাবেন তা জেনে নিন।",
        answerEn: "When dengue is suspected or confirmed, avoid aspirin and NSAID painkillers such as ibuprofen, naproxen and mefenamic acid because they can increase bleeding risk. Some prescribed blood thinners or antiplatelet medicines also affect bleeding risk, but do not stop them on your own. Show your clinician a complete list of prescription medicines, painkillers, supplements and herbal products and ask what to continue."
    },
    {
        topic: "child_medicine_dengue",
        keywordsBn: [
            "শিশুর ডেঙ্গুতে কোন ওষুধ দেওয়া যাবে",
            "শিশুর ডেঙ্গুতে প্যারাসিটামল কতটুকু",
            "বাচ্চার ডেঙ্গু জ্বর হলে কী ওষুধ দেব",
            "ডেঙ্গুতে শিশুকে aspirin দেওয়া যাবে কি",
            "শিশুর ডেঙ্গুতে ibuprofen দেওয়া যাবে কি"
        ],
        keywordsEn: [
            "what medicine can a child take for dengue",
            "paracetamol dose for child with dengue",
            "what fever medicine for a child with dengue",
            "can a child with dengue take aspirin",
            "can child with dengue take ibuprofen"
        ],
        answerBn: "ডেঙ্গু আক্রান্ত শিশুর ক্ষেত্রে ওষুধের মাত্রা শিশুর ওজন, বয়স, ওষুধের concentration এবং স্বাস্থ্য-অবস্থার ওপর নির্ভর করে। চিকিৎসক বা qualified pharmacist-এর কাছ থেকে শিশুর জন্য নির্দিষ্ট dose নিশ্চিত করুন; kitchen spoon দিয়ে মাপবেন না এবং একাধিক Paracetamol-যুক্ত ওষুধ একসঙ্গে দেবেন না। শিশুকে Aspirin, Ibuprofen বা অন্য NSAID দেবেন না। শিশু পানি/তরল খেতে না পারলে, বারবার বমি করলে, প্রস্রাব কমে গেলে, অস্বাভাবিক ঘুমঘুম বা নিস্তেজ হলে দ্রুত হাসপাতালে নিন।",
        answerEn: "For a child with dengue, medicine dosing depends on the child's weight, age, product concentration and health status. Confirm the exact dose with a clinician or qualified pharmacist; do not measure with a kitchen spoon or combine multiple paracetamol-containing products. Do not give aspirin, ibuprofen or other NSAIDs to a child with suspected dengue. Seek urgent care if the child cannot drink, vomits repeatedly, urinates less, or becomes unusually sleepy or lethargic."
    },
    {
        topic: "steroids_dengue",
        keywordsBn: [
            "ডেঙ্গুতে steroid খাওয়া যাবে কি",
            "ডেঙ্গুতে স্টেরয়েড দেওয়া হয় কি",
            "ডেঙ্গুতে dexamethasone খাওয়া যাবে",
            "ডেঙ্গুতে steroid কেন দেওয়া উচিত নয়"
        ],
        keywordsEn: [
            "can steroids be used in dengue",
            "are corticosteroids recommended for dengue",
            "can i take dexamethasone for dengue",
            "why are steroids not routinely used in dengue"
        ],
        answerBn: "সাধারণ ডেঙ্গুর চিকিৎসায় Steroid বা corticosteroid নিয়মিতভাবে সুপারিশ করা হয় না; উপকারের নির্ভরযোগ্য প্রমাণ নেই এবং ক্ষতিও হতে পারে। তবে অন্য কোনো রোগের জন্য steroid নিয়মিত prescribed থাকলে নিজে থেকে হঠাৎ বন্ধ করবেন না—চিকিৎসকের সঙ্গে দ্রুত কথা বলুন। ডেঙ্গুর জন্য নিজে থেকে Dexamethasone বা অন্য steroid শুরু করবেন না।",
        answerEn: "Steroids or corticosteroids are not routinely recommended for uncomplicated dengue; reliable benefit has not been established and they may cause harm. If you already take a prescribed steroid for another condition, do not suddenly stop it on your own; contact your clinician promptly. Do not start dexamethasone or another steroid yourself to treat dengue."
    },
    {
        topic: "warning_signs_action",
        keywordsBn: [
            "ডেঙ্গুর বিপদজনক লক্ষণ কী কী",
            "ডেঙ্গুর বিপজ্জনক লক্ষণ কী কী",
            "ডেঙ্গুর বিপদ সংকেত কী",
            "ডেঙ্গুতে কোন লক্ষণ দেখা দিলে হাসপাতালে যাব",
            "ডেঙ্গুতে বিপদের লক্ষণ দেখা দিলে কী করব",
            "ডেঙ্গুর warning signs কী কী",
            "ডেঙ্গুতে কখন জরুরি চিকিৎসা নিতে হবে"
        ],
        keywordsEn: [
            "what are the dengue warning signs",
            "what are danger signs of dengue",
            "when should i go to hospital for dengue",
            "what should i do if dengue warning signs appear",
            "when is emergency care needed for dengue"
        ],
        answerBn: "ডেঙ্গুর গুরুত্বপূর্ণ Warning Signs হলো: তীব্র পেটব্যথা বা পেটে চাপ দিলে ব্যথা, বারবার বা অবিরাম বমি, নাক-মাড়ি দিয়ে রক্তপাত, রক্তবমি বা কালো পায়খানা, অস্বাভাবিক দুর্বলতা/অস্থিরতা বা ঝিমুনি, শ্বাসকষ্ট, ঠান্ডা-আঠালো ত্বক এবং প্রস্রাব অনেক কমে যাওয়া। এগুলোর যেকোনোটি দেখা দিলে জ্বর কমে গেলেও অপেক্ষা করবেন না—এখনই নিকটস্থ হাসপাতালের জরুরি বিভাগে যান। রোগীকে একা রাখবেন না এবং চিকিৎসা নিতে দেরি করবেন না।",
        answerEn: "Important dengue warning signs include severe abdominal pain or tenderness, persistent vomiting, nose or gum bleeding, vomiting blood or black stools, unusual weakness/restlessness or drowsiness, breathing difficulty, cold clammy skin and markedly reduced urine. If any occur, do not wait even if the fever has gone down—go to the nearest emergency department now. Do not leave the patient alone or delay medical assessment."
    },
    {
        topic: "fever_defervescence_danger",
        keywordsBn: [
            "ডেঙ্গুতে জ্বর কমে গেলে কেন বিপদ বাড়ে",
            "ডেঙ্গুতে জ্বর চলে যাওয়ার পর কি বিপদ হয়",
            "ডেঙ্গুতে জ্বর কমার পর কী সতর্কতা",
            "ডেঙ্গুতে জ্বর কমে গেলে কি রোগী ভালো হয়ে যায়",
            "জ্বর কমে যাওয়ার পর ডেঙ্গুর critical phase"
        ],
        keywordsEn: [
            "why can dengue get worse after fever goes down",
            "is dengue dangerous after fever subsides",
            "what happens when dengue fever goes away",
            "dengue critical phase after fever drops"
        ],
        answerBn: "ডেঙ্গুর Critical Phase অনেক সময় জ্বর কমে যাওয়ার সময় শুরু হয় এবং সাধারণত ২৪–৪৮ ঘণ্টা স্থায়ী হতে পারে। এ সময়ে কিছু রোগীর রক্তনালি থেকে plasma leakage হয়ে shock বা organ complication হতে পারে। তাই জ্বর কমে গেলেই সম্পূর্ণ সুস্থ ধরে নেওয়া যাবে না। চিকিৎসকের follow-up, প্রয়োজনমতো CBC/Hematocrit monitoring এবং Warning Signs নজরে রাখা জরুরি। তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট, ঠান্ডা-আঠালো ত্বক, অস্থিরতা বা ঝিমুনি হলে এখনই জরুরি বিভাগে যান।",
        answerEn: "The critical phase of dengue often begins around the time the fever settles and commonly lasts about 24–48 hours. In some patients, plasma leakage can lead to shock or organ complications. Therefore, fever settling does not automatically mean recovery. Follow the clinician's monitoring plan, including CBC/hematocrit when indicated, and watch for warning signs. Go to an emergency department immediately for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty, cold clammy skin, restlessness or drowsiness."
    },
    {
        topic: "dengue_shock",
        keywordsBn: [
            "ডেঙ্গু শক কী",
            "ডেঙ্গুতে shock হলে কী হয়",
            "ডেঙ্গুতে শক হওয়ার লক্ষণ কী",
            "ডেঙ্গু shock syndrome কী",
            "ডেঙ্গুতে রক্তচাপ কমে গেলে কী করব"
        ],
        keywordsEn: [
            "what is dengue shock",
            "what happens in dengue shock",
            "signs of dengue shock",
            "what is dengue shock syndrome",
            "what to do if blood pressure drops in dengue"
        ],
        answerBn: "Dengue Shock হলো গুরুতর plasma leakage-এর কারণে রক্তসঞ্চালন ও রক্তচাপ বিপজ্জনকভাবে কমে যাওয়ার অবস্থা; এতে শরীরের গুরুত্বপূর্ণ অঙ্গে পর্যাপ্ত রক্ত পৌঁছায় না। লক্ষণের মধ্যে ঠান্ডা-আঠালো ত্বক, খুব দুর্বল বা অস্থির লাগা, মাথা ঘোরা/অজ্ঞান হওয়া, দ্রুত বা দুর্বল নাড়ি, প্রস্রাব কমে যাওয়া ও শ্বাসকষ্ট থাকতে পারে। এটি জীবন-ঝুঁকিপূর্ণ জরুরি অবস্থা। সন্দেহ হলে এখনই হাসপাতালে জরুরি চিকিৎসা নিন—বাড়িতে তরল বা খাবার দিয়ে সামলানোর চেষ্টা করবেন না।",
        answerEn: "Dengue shock is a life-threatening state in which severe plasma leakage causes dangerously poor circulation and blood pressure, so vital organs do not receive enough blood. Signs may include cold clammy skin, marked weakness or restlessness, dizziness or fainting, a rapid or weak pulse, reduced urine and breathing difficulty. This is a medical emergency. Seek emergency hospital care immediately; do not try to manage it at home with food or fluids."
    },
    {
        topic: "dengue_bleeding_emergency",
        keywordsBn: [
            "ডেঙ্গুতে রক্তপাত হলে কী করব",
            "ডেঙ্গুতে নাক দিয়ে রক্ত পড়লে কী করব",
            "ডেঙ্গুতে মাড়ি দিয়ে রক্ত পড়লে করণীয়",
            "ডেঙ্গুতে রক্তবমি হলে কী করব",
            "ডেঙ্গুতে কালো পায়খানা হলে কী করব",
            "ডেঙ্গুতে রক্তপাত কি জরুরি অবস্থা"
        ],
        keywordsEn: [
            "what to do if bleeding occurs in dengue",
            "what should i do if bleeding occurs in dengue",
            "nose bleeding in dengue what should i do",
            "gum bleeding in dengue what to do",
            "vomiting blood with dengue",
            "black stool in dengue what to do",
            "is bleeding in dengue an emergency"
        ],
        answerBn: "ডেঙ্গুতে নাক-মাড়ি দিয়ে রক্তপাত, রক্তবমি, পায়খানায় রক্ত বা কালো পায়খানা হলে এটিকে জরুরি অবস্থা হিসেবে নিন। এখনই নিকটস্থ হাসপাতালের জরুরি বিভাগে যান বা জরুরি সহায়তা নিন। Aspirin, Ibuprofen, Naproxen বা অন্য NSAID খাবেন না। নিজে থেকে platelet transfusion বা কোনো ওষুধের সিদ্ধান্ত নেবেন না। মাথা ঘোরা, অজ্ঞানভাব, ঠান্ডা-আঠালো ত্বক বা শ্বাসকষ্ট থাকলে অ্যাম্বুলেন্স/জরুরি পরিবহনের ব্যবস্থা করুন।",
        answerEn: "Treat nose or gum bleeding, vomiting blood, blood in stool or black stools during dengue as an emergency. Go to the nearest emergency department now or call for emergency help. Do not take aspirin, ibuprofen, naproxen or other NSAIDs. Do not decide on platelet transfusion or medicines yourself. If there is dizziness, fainting, cold clammy skin or breathing difficulty, arrange emergency transport."
    },
    {
        topic: "reduced_urine_dengue",
        keywordsBn: [
            "ডেঙ্গুতে প্রস্রাব কমে গেলে কী করব",
            "ডেঙ্গুতে প্রস্রাব বন্ধ হলে কী করব",
            "ডেঙ্গুতে প্রস্রাব কম হওয়া কি বিপদের লক্ষণ",
            "ডেঙ্গু রোগীর প্রস্রাব কমে যাচ্ছে",
            "ডেঙ্গুতে কতক্ষণ প্রস্রাব না হলে বিপদ"
        ],
        keywordsEn: [
            "what to do if urine decreases in dengue",
            "no urine in dengue what should i do",
            "is reduced urination a dengue warning sign",
            "dengue patient passing less urine"
        ],
        answerBn: "ডেঙ্গুতে প্রস্রাব স্বাভাবিকের তুলনায় অনেক কমে যাওয়া পানিশূন্যতা বা রক্তসঞ্চালনের সমস্যার লক্ষণ হতে পারে এবং দ্রুত চিকিৎসকের মূল্যায়ন দরকার। প্রস্রাব খুব কমে গেলে বা বন্ধ হলে, বিশেষ করে মাথা ঘোরা, দুর্বলতা, ঠান্ডা-আঠালো ত্বক, পেটব্যথা বা বমির সঙ্গে থাকলে এখনই জরুরি বিভাগে যান। নিজে থেকে অতিরিক্ত পানি বা IV fluid নেওয়ার চেষ্টা করবেন না—কতটা তরল নিরাপদ তা চিকিৎসক নির্ধারণ করবেন।",
        answerEn: "Passing much less urine than usual during dengue may indicate dehydration or circulation problems and needs prompt medical assessment. If urine becomes very scanty or stops, especially with dizziness, weakness, cold clammy skin, abdominal pain or vomiting, go to an emergency department now. Do not force excessive water or arrange IV fluids yourself; a clinician must determine what fluid is safe."
    },
    {
        topic: "hospital_admission_dengue",
        keywordsBn: [
            "ডেঙ্গুতে কখন হাসপাতালে ভর্তি হতে হয়",
            "ডেঙ্গু রোগীকে কখন ভর্তি করতে হবে",
            "ডেঙ্গুতে হাসপাতালে ভর্তি হওয়ার লক্ষণ",
            "ডেঙ্গুতে বাড়িতে থাকা নিরাপদ কি",
            "ডেঙ্গুতে warning sign থাকলে ভর্তি হতে হবে কি"
        ],
        keywordsEn: [
            "when should a dengue patient be admitted to hospital",
            "when does dengue require hospitalization",
            "signs that dengue patient needs admission",
            "can i stay home with dengue warning signs"
        ],
        answerBn: "ডেঙ্গুতে হাসপাতালে ভর্তি বা পর্যবেক্ষণের সিদ্ধান্ত রোগীর বয়স, গর্ভাবস্থা, অন্যান্য রোগ, vital signs, পানিশূন্যতা, রক্তপাত, Warning Signs এবং follow-up সুবিধা দেখে চিকিৎসক নেন। তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট, ঠান্ডা-আঠালো ত্বক, অস্বাভাবিক ঝিমুনি/অস্থিরতা বা প্রস্রাব কমে গেলে জরুরি বিভাগে যান। Warning Signs না থাকলেও শিশু, বয়স্ক, গর্ভবতী বা গুরুতর সহ-রোগ থাকলে দ্রুত চিকিৎসকের মূল্যায়ন প্রয়োজন। নিজে থেকে ভর্তি/বাড়িতে থাকার সিদ্ধান্তে দেরি করবেন না।",
        answerEn: "Hospital admission or observation depends on age, pregnancy, other illnesses, vital signs, hydration, bleeding, warning signs and the ability to return for follow-up. Seek emergency care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty, cold clammy skin, unusual drowsiness/restlessness or reduced urine. Even without warning signs, children, older adults, pregnant people and those with significant medical conditions need prompt clinical assessment. Do not delay care while deciding at home."
    },
    {
        topic: "dengue_recovery_duration",
        keywordsBn: [
            "ডেঙ্গু থেকে সুস্থ হতে কতদিন লাগে",
            "ডেঙ্গু ভালো হতে কতদিন লাগে",
            "ডেঙ্গু থেকে পুরোপুরি সেরে উঠতে কতদিন",
            "ডেঙ্গুর recovery কতদিন",
            "ডেঙ্গু থেকে কখন সুস্থ হব"
        ],
        keywordsEn: [
            "how long does it take to recover from dengue",
            "how long to recover after dengue fever",
            "dengue recovery time",
            "when will i feel better after dengue"
        ],
        answerBn: "বেশিরভাগ মানুষ ডেঙ্গুতে ১–২ সপ্তাহের মধ্যে ভালো হয়ে ওঠেন, তবে recovery ব্যক্তি ভেদে আলাদা। জ্বর কমে যাওয়ার সময়ের পরের ২৪–৪৮ ঘণ্টা বিশেষ সতর্ক থাকতে হয়, কারণ এ সময় Warning Signs দেখা দিতে পারে। দুর্বলতা বা ক্লান্তি কয়েক সপ্তাহ থাকতে পারে। চিকিৎসকের follow-up মেনে চলুন; তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট বা প্রস্রাব কমে গেলে জরুরি চিকিৎসা নিন।",
        answerEn: "Most people recover from dengue within 1–2 weeks, but recovery varies. The 24–48 hours after the fever settles need particular attention because warning signs may appear during this period. Tiredness or fatigue can continue for several weeks. Follow your clinician's monitoring plan and seek urgent care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty or reduced urine."
    },
    {
        topic: "post_dengue_fatigue",
        keywordsBn: [
            "ডেঙ্গু ভালো হওয়ার পরও দুর্বল লাগে কেন",
            "ডেঙ্গুর পর দুর্বলতা কতদিন থাকে",
            "ডেঙ্গু থেকে সেরে ওঠার পর ক্লান্তি",
            "ডেঙ্গু পরবর্তী দুর্বলতা কীভাবে কমাব",
            "ডেঙ্গু ভালো হওয়ার পর শরীর দুর্বল"
        ],
        keywordsEn: [
            "why am i tired after dengue",
            "how long does fatigue last after dengue",
            "weakness after recovering from dengue",
            "post dengue fatigue what to do"
        ],
        answerBn: "ডেঙ্গু থেকে সেরে ওঠার পর কয়েক সপ্তাহ ক্লান্তি বা দুর্বলতা থাকতে পারে। ধীরে ধীরে স্বাভাবিক ঘুম, পর্যাপ্ত তরল ও সুষম খাবার বজায় রাখুন এবং শরীরের সহ্যক্ষমতা অনুযায়ী কাজ বাড়ান। একবারে ভারী ব্যায়াম বা অতিরিক্ত পরিশ্রমে ফিরবেন না। দুর্বলতা বাড়তে থাকলে, দীর্ঘস্থায়ী হলে, শ্বাসকষ্ট, বুকব্যথা, মাথা ঘোরা, জ্বর ফিরে আসা বা অন্য নতুন উপসর্গ হলে চিকিৎসকের মূল্যায়ন নিন।",
        answerEn: "Tiredness or weakness can continue for several weeks after dengue. Gradually return to regular sleep, adequate fluids, balanced meals and activities as tolerated. Do not jump straight into strenuous exercise or heavy work. Seek medical assessment if weakness is worsening or persistent, or if you develop breathlessness, chest pain, dizziness, returning fever or other new symptoms."
    },
    {
        topic: "return_to_activity",
        keywordsBn: [
            "ডেঙ্গু থেকে সেরে উঠে কখন কাজ শুরু করব",
            "ডেঙ্গুর পর কখন ব্যায়াম করা যাবে",
            "ডেঙ্গু হলে কখন স্বাভাবিক কাজ করা যাবে",
            "ডেঙ্গুর পর খেলাধুলা কখন শুরু করব",
            "ডেঙ্গু থেকে সুস্থ হয়ে ব্যায়াম"
        ],
        keywordsEn: [
            "when can i return to work after dengue",
            "when can i exercise after dengue",
            "when can i resume normal activities after dengue",
            "when can i play sports after dengue"
        ],
        answerBn: "ডেঙ্গুর পর কাজ, পড়াশোনা বা ব্যায়ামে ফেরার নির্দিষ্ট একদিন সবার জন্য প্রযোজ্য নয়। জ্বর ও acute symptoms সেরে গেলে, Warning Signs না থাকলে এবং চিকিৎসক নিরাপদ মনে করলে হালকা কাজ দিয়ে ধীরে শুরু করুন। ক্লান্তি বা মাথা ঘোরা হলে বিশ্রাম নিন; ভারী ব্যায়াম ও strenuous activity-তে ফেরার আগে চিকিৎসকের পরামর্শ নিন, বিশেষ করে দুর্বলতা বা অন্য উপসর্গ থাকলে।",
        answerEn: "There is no single return-to-work or exercise date that fits everyone after dengue. Once fever and acute symptoms have resolved, there are no warning signs and your clinician considers it safe, restart gradually with light activity. Rest if fatigue or dizziness occurs. Ask your clinician before returning to strenuous exercise, especially if weakness or other symptoms remain."
    },
    {
        topic: "second_dengue_infection",
        keywordsBn: [
            "দ্বিতীয়বার ডেঙ্গু হলে কি বেশি বিপদ",
            "দ্বিতীয়বার ডেঙ্গু হলে কি ঝুঁকি বেশি",
            "একবার ডেঙ্গু হলে আবার হতে পারে কি",
            "ডেঙ্গু দ্বিতীয়বার হলে কী হয়",
            "আগে ডেঙ্গু হলে আবার ডেঙ্গু হলে কি severe হয়"
        ],
        keywordsEn: [
            "is dengue more dangerous the second time",
            "is a second dengue infection more severe",
            "can i get dengue again after having it once",
            "why is second dengue infection risky"
        ],
        answerBn: "হ্যাঁ, দ্বিতীয়বার Dengue infection হলে severe dengue-এর ঝুঁকি তুলনামূলক বেশি হতে পারে, বিশেষ করে ভিন্ন serotype দিয়ে সংক্রমণ হলে। Dengue virus-এর চারটি serotype আছে; এক ধরনের সংক্রমণের পর সেই serotype-এর বিরুদ্ধে দীর্ঘমেয়াদি সুরক্ষা হলেও অন্য serotype থেকে আবার সংক্রমণ হতে পারে। তবে প্রথমবারেও severe dengue হতে পারে। তাই আগের dengue history থাকলে চিকিৎসককে জানান এবং Warning Signs হলে জরুরি চিকিৎসা নিন।",
        answerEn: "Yes. A second dengue infection can carry a higher risk of severe dengue, particularly when it is caused by a different serotype. There are four dengue virus serotypes; infection may provide long-term protection against that serotype but does not reliably protect against the others. Severe dengue can also occur during a first infection. Tell your clinician about any previous dengue infection and seek urgent care if warning signs appear."
    },
    {
        topic: "mosquito_bite_prevention",
        keywordsBn: [
            "ডেঙ্গু থেকে বাঁচতে মশার কামড় এড়াব কীভাবে",
            "ডেঙ্গু প্রতিরোধে কী করব",
            "ডেঙ্গুর মশা থেকে বাঁচার উপায়",
            "ডেঙ্গুতে দিনে মশা কামড়ায় কি",
            "ডেঙ্গু রোগীকে মশারির নিচে রাখতে হবে কি",
            "ডেঙ্গু রোগী থেকে অন্যদের বাঁচাব কীভাবে"
        ],
        keywordsEn: [
            "how to prevent mosquito bites and dengue",
            "how can i protect myself from dengue mosquitoes",
            "do dengue mosquitoes bite during the day",
            "should a dengue patient sleep under a mosquito net",
            "how to stop dengue spreading from a patient"
        ],
        answerBn: "ডেঙ্গুর Aedes মশা দিনে বেশি সক্রিয় হলেও যেকোনো সময় কামড়াতে পারে। লম্বা হাতার জামা ও প্যান্ট পরুন, জানালা-দরজায় screen ব্যবহার করুন এবং label অনুযায়ী DEET, Picaridin/Icaridin বা IR3535-যুক্ত অনুমোদিত repellent ব্যবহার করুন। ডেঙ্গু রোগীকেও অসুস্থতার প্রথম সপ্তাহে মশারির নিচে রাখা এবং মশার কামড় থেকে রক্ষা করা জরুরি, যাতে মশা রোগীর রক্ত থেকে ভাইরাস নিয়ে অন্যকে ছড়াতে না পারে। Repellent শিশুদের ক্ষেত্রে বয়স ও পণ্যের label মেনে ব্যবহার করুন।",
        answerEn: "Aedes mosquitoes that spread dengue are active during the day but can bite at other times too. Wear long sleeves and trousers, use window and door screens, and apply an approved repellent containing DEET, picaridin/icaridin or IR3535 according to its label. A person with dengue should also be protected from mosquito bites, especially during the first week of illness, and use a bed net when resting so mosquitoes do not pick up the virus and spread it to others. Follow product age instructions for children."
    },
    {
        topic: "mosquito_breeding_control",
        keywordsBn: [
            "বাড়িতে ডেঙ্গুর মশা জন্মানো বন্ধ করব কীভাবে",
            "ডেঙ্গুর মশার লার্ভা ধ্বংস করার উপায়",
            "বাড়ির আশেপাশে পানি জমলে কী করব",
            "ডেঙ্গু প্রতিরোধে পানি জমতে দেওয়া যাবে কি",
            "ডেঙ্গুর মশা নিয়ন্ত্রণের উপায়"
        ],
        keywordsEn: [
            "how to stop dengue mosquitoes breeding at home",
            "how to destroy dengue mosquito larvae",
            "how to control mosquito breeding around house",
            "how often should water containers be cleaned for dengue"
        ],
        answerBn: "ডেঙ্গুর মশা পরিষ্কার জমে থাকা পানিতেও বংশবিস্তার করতে পারে। সপ্তাহে অন্তত একবার ফুলের টবের ট্রে, বালতি, ড্রাম, টায়ার, ছাদ ও উঠানের পানি জমার জায়গা খালি করুন, ঘষে পরিষ্কার করুন এবং উল্টে বা ঢেকে রাখুন। পানির ট্যাংক ও সংরক্ষণ পাত্র শক্তভাবে ঢেকে রাখুন। পরিত্যক্ত বোতল, কৌটা ও টায়ার সরিয়ে ফেলুন; আবর্জনা ঠিকভাবে ফেলুন। বড় পানির পাত্রে larvicide/insecticide ব্যবহার করতে হলে স্থানীয় স্বাস্থ্য কর্তৃপক্ষের নির্দেশনা অনুসরণ করুন।",
        answerEn: "Dengue mosquitoes can breed in small amounts of clean standing water. At least once a week, empty and scrub flower-pot trays, buckets, drums, tyres and other water-holding places, then turn them over or cover them. Keep water tanks and storage containers tightly covered. Remove discarded bottles, cans and tyres and dispose of waste properly. Use larvicides or insecticides in large water containers only according to local public-health instructions."
    },
    {
        topic: "dengue_reinfection_prevention",
        keywordsBn: [
            "ডেঙ্গু একবার হলে কি আবার হবে না",
            "ডেঙ্গু থেকে সেরে উঠলে কি immunity হয়",
            "ডেঙ্গু হওয়ার পর কীভাবে আবার হওয়া ঠেকাব",
            "ডেঙ্গু হলে কি সারাজীবন সুরক্ষা থাকে",
            "ডেঙ্গু vaccine নেওয়া উচিত কি"
        ],
        keywordsEn: [
            "can dengue happen again after recovery",
            "do you get lifelong immunity after dengue",
            "how to prevent dengue reinfection",
            "does dengue infection protect against all serotypes",
            "should i get a dengue vaccine"
        ],
        answerBn: "একবার ডেঙ্গু হলে সব ধরনের dengue থেকে সারাজীবনের সুরক্ষা তৈরি হয় না। ভাইরাসের চারটি serotype আছে; একটির পর অন্যটি দিয়ে আবার সংক্রমণ হতে পারে এবং দ্বিতীয় সংক্রমণে severe dengue-এর ঝুঁকি বেশি হতে পারে। তাই মশার কামড় এড়ানো ও বাড়ির breeding site দূর করাই গুরুত্বপূর্ণ। Dengue vaccine-এর অনুমোদন ও যোগ্যতা দেশ, বয়স, পূর্বের সংক্রমণ ও স্থানীয় নীতিমালা অনুযায়ী ভিন্ন; নিজে থেকে vaccine নেওয়ার সিদ্ধান্ত না নিয়ে স্থানীয় স্বাস্থ্য কর্তৃপক্ষ বা চিকিৎসকের পরামর্শ নিন।",
        answerEn: "Having dengue once does not provide lifelong protection against every dengue type. There are four serotypes, so infection with another type can occur later, and a second infection may carry a higher risk of severe dengue. Prevent mosquito bites and remove breeding sites. Dengue vaccine eligibility and recommendations vary by country, age, prior infection and local policy; consult your local health authority or clinician rather than deciding on vaccination yourself."
    },
    {
        topic: "initial_care",
        keywordsBn: [
            "ডেঙ্গু হলে কি করতে হয়",
            "ডেঙ্গু হলে কী করতে হয়",
            "ডেঙ্গু হলে কী করব",
            "ডেঙ্গু হলে করণীয়",
            "ডেঙ্গু হলে করণীয়",
            "ডেঙ্গু হলে কি করা উচিত",
            "ডেঙ্গু হলে কি করবো",
            "ডেঙ্গু আক্রান্ত হলে",
            "ডেঙ্গু সন্দেহ হলে",
            "ডেঙ্গু হলে বাসায় কি করব"
        ],
        keywordsEn: [
            "what should i do if i have dengue",
            "what to do if i have dengue",
            "what should i do when i have dengue",
            "what to do during dengue",
            "what should a dengue patient do",
            "dengue home care"
        ],
        answerBn: "ডেঙ্গু সন্দেহ হলে দ্রুত চিকিৎসকের পরামর্শ নিন এবং প্রয়োজন অনুযায়ী পরীক্ষা করান। পর্যাপ্ত বিশ্রাম নিন, চিকিৎসকের পরামর্শ অনুযায়ী তরল পান করুন এবং জ্বরের ওষুধ নিজে থেকে খাবেন না। Aspirin ও Ibuprofen এড়িয়ে চলুন। তীব্র পেটব্যথা, বারবার বমি, রক্তপাত, শ্বাসকষ্ট বা অস্বাভাবিক ঝিমুনি হলে অবিলম্বে হাসপাতালে যান।",
        answerEn: "If dengue is suspected, consult a healthcare professional promptly and get appropriate tests. Rest and maintain fluids as advised. Do not self-medicate. Avoid aspirin and ibuprofen. Seek emergency care for severe abdominal pain, persistent vomiting, bleeding, breathing difficulty or unusual drowsiness."
    },


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

            if (key && normalized.includes(key)) {
                // Longer, more specific phrases should outrank generic keywords.
                score += Math.max(1, key.length) * 10;
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

    // Keep the ranked retrieval list available for Task 3's Top-15 display/reranking.
    if (typeof window !== "undefined" &&
        typeof window.searchDengueCandidates === "function") {
        window.lastDengueSearchResults =
            typeof window.getTopDengueMatches === "function"
                ? window.getTopDengueMatches(message, 15)
                : window.searchDengueCandidates(message, 15);

        // Task 14: versioned admin-approved corrections take priority for their
        // exact source question. Similarity matching still chooses the source entry.
        const bestMatch = window.lastDengueSearchResults[0];
        if (
            bestMatch &&
            Number(bestMatch.score || 0) >= 0.12 &&
            typeof window.getApprovedAnswerOverride === "function"
        ) {
            const correction = window.getApprovedAnswerOverride(bestMatch.question);
            if (correction && correction.answerBn && correction.answerEn) {
                return detectDengueLanguage(message) === "bn"
                    ? correction.answerBn
                    : correction.answerEn;
            }
        }

        // Task 12: a directly matching, admin-approved community Q&A takes priority
        // over broad legacy keyword answers, but only above the search minimum.
        if (
            bestMatch &&
            bestMatch.communityApproved === true &&
            Number(bestMatch.score || 0) >= 0.12 &&
            bestMatch.answerBn &&
            bestMatch.answerEn
        ) {
            return detectDengueLanguage(message) === "bn"
                ? bestMatch.answerBn
                : bestMatch.answerEn;
        }
    }

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
