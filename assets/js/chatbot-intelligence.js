/* Tasks 29–30: retrieval confidence and suggested follow-up questions.
   These are local rules over the existing question index; no external AI API is used. */
(function () {
    const FOLLOW_UPS = {
        symptoms: {
            bn: ["ডেঙ্গুর কোন লক্ষণ হলে হাসপাতালে যেতে হবে?", "ডেঙ্গুতে কোন পরীক্ষা করা হয়?", "জ্বর কমে গেলে কী সতর্কতা নেব?"],
            en: ["Which dengue symptoms need hospital care?", "Which tests are used for dengue?", "What should I watch for when fever settles?"]
        },
        platelets: {
            bn: ["প্লেটলেট কত হলে জরুরি চিকিৎসা দরকার?", "CBC ও হেমাটোক্রিট কীভাবে বুঝব?", "প্লেটলেট কমলে কী করণীয়?"],
            en: ["When do low platelets need urgent assessment?", "How are CBC and hematocrit interpreted?", "What should I do if platelets fall?"]
        },
        medicine: {
            bn: ["ডেঙ্গুতে কোন ওষুধ এড়িয়ে চলব?", "প্যারাসিটামল ব্যবহারে কী সতর্কতা আছে?", "শিশুর ওষুধের ডোজ কীভাবে নিশ্চিত করব?"],
            en: ["Which medicines should be avoided in dengue?", "What precautions apply to paracetamol?", "How should a child's medicine dose be checked?"]
        },
        tests: {
            bn: ["NS1 পরীক্ষা কখন করা হয়?", "CBC রিপোর্টে কোন বিষয়গুলো গুরুত্বপূর্ণ?", "কখন আবার পরীক্ষা করতে হয়?"],
            en: ["When is an NS1 test useful?", "Which parts of a CBC report matter?", "When might repeat testing be needed?"]
        },
        warning: {
            bn: ["কোন লক্ষণে এখনই হাসপাতালে যেতে হবে?", "জ্বর কমার পর কেন সতর্ক থাকতে হয়?", "ডেঙ্গু শকে কী লক্ষণ দেখা যায়?"],
            en: ["Which warning signs need emergency care now?", "Why is monitoring important after fever settles?", "What are signs of dengue shock?"]
        },
        food: {
            bn: ["ডেঙ্গুতে কী কী তরল পান করা যায়?", "কোন খাবার এড়িয়ে চলব?", "কিডনি বা হার্টের রোগ থাকলে কী করব?"],
            en: ["Which fluids may be suitable during dengue?", "Are there foods I should avoid?", "What if I have kidney or heart disease?"]
        },
        prevention: {
            bn: ["ঘরে মশার বংশবিস্তার কীভাবে কমাব?", "দিনের কোন সময়ে এডিস মশা কামড়ায়?", "পরিবারকে কীভাবে সুরক্ষিত রাখব?"],
            en: ["How can I reduce mosquito breeding at home?", "When are Aedes mosquitoes most active?", "How can I protect my family?"]
        },
        recovery: {
            bn: ["সুস্থ হওয়ার সময় কোন লক্ষণ দেখব?", "কখন স্বাভাবিক কাজে ফিরতে পারব?", "ফলোআপ CBC কখন দরকার?"],
            en: ["What should I monitor during recovery?", "When can I return to normal activities?", "When may follow-up CBC be needed?"]
        },
        transmission: {
            bn: ["ডেঙ্গু কীভাবে ছড়ায়?", "একজন থেকে আরেকজনের সরাসরি ছড়ায় কি?", "মশার কামড় থেকে কীভাবে বাঁচব?"],
            en: ["How does dengue spread?", "Does dengue usually spread directly between people?", "How can I prevent mosquito bites?"]
        },
        general: {
            bn: ["ডেঙ্গুর সাধারণ লক্ষণ কী?", "কোন পরীক্ষা করা হয়?", "কখন চিকিৎসকের পরামর্শ নেব?"],
            en: ["What are common dengue symptoms?", "Which tests are used?", "When should I consult a clinician?"]
        }
    };

    function getConfidence(question) {
        let matches = [];
        try {
            matches = typeof window.getTopDengueMatches === "function"
                ? (window.getTopDengueMatches(question, 15) || []) : [];
        } catch (error) {
            console.warn("Retrieval confidence calculation failed:", error);
        }
        const top = matches[0] || null;
        const score = top ? Math.max(0, Math.min(100, Number(top.similarityPercent) || 0)) : 0;
        const secondScore = matches[1] ? Math.max(0, Math.min(100, Number(matches[1].similarityPercent) || 0)) : 0;
        const margin = Math.max(0, score - secondScore);
        let level = "low";
        if (score >= 65 && (margin >= 5 || matches.length === 1)) level = "high";
        else if (score >= 40) level = "medium";
        return {
            level,
            confidenceLevel: level,
            score,
            margin,
            intent: top ? String(top.topic || "general") : "Unmatched",
            matchCount: matches.length,
            bestMatch: top,
            meaning: "retrieval_relevance_only"
        };
    }

    function getFollowUps(question, limit = 3) {
        const quality = getConfidence(question);
        if (!quality.bestMatch) return [];
        const topic = quality.bestMatch.topic || "general";
        const language = /[\u0980-\u09FF]/.test(String(question || "")) ? "bn" : "en";
        const list = FOLLOW_UPS[topic] || FOLLOW_UPS.general;
        return (list[language] || list.en).slice(0, Math.max(1, Math.min(4, Number(limit) || 3)));
    }

    window.getChatbotRetrievalConfidence = getConfidence;
    window.getChatbotSuggestedFollowUps = getFollowUps;
})();
