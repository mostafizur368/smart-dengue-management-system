/* Tasks 31, 33, 34 and 36: deterministic medical-safety checks.
   These checks flag content for review; they never certify clinical correctness. */
(function () {
    const EMERGENCY_SIGNALS = [
        { id: "severe_abdominal_pain", bn: ["তীব্র পেটব্যথা", "পেটে তীব্র ব্যথা", "পেট খুব ব্যথা"], en: ["severe abdominal pain", "severe stomach pain", "intense abdominal pain"], roman: ["pet e khub betha", "tibro pet betha"] },
        { id: "persistent_vomiting", bn: ["বারবার বমি", "অবিরাম বমি", "বমি থামছে না"], en: ["persistent vomiting", "repeated vomiting", "cannot stop vomiting"], roman: ["bar bar bomi", "bomi thamche na"] },
        { id: "bleeding", bn: ["রক্তবমি", "রক্ত বমি", "নাক দিয়ে রক্ত", "নাক থেকে রক্ত", "মাড়ি দিয়ে রক্ত", "মাড়ি দিয়ে রক্ত", "কালো পায়খানা", "পায়খানায় রক্ত", "রক্তপাত হচ্ছে"], en: ["vomiting blood", "blood in vomit", "nose bleeding", "gum bleeding", "black stool", "blood in stool", "i am bleeding", "bleeding now"], roman: ["rokto bomi", "nak diye rokto", "mari diye rokto", "kalo paykhana"] },
        { id: "breathing_difficulty", bn: ["শ্বাসকষ্ট", "শ্বাস নিতে কষ্ট", "দম নিতে কষ্ট"], en: ["difficulty breathing", "trouble breathing", "shortness of breath", "cannot breathe"], roman: ["shash kosto", "shash nite kosto"] },
        { id: "reduced_urine", bn: ["প্রস্রাব কমে গেছে", "প্রস্রাব খুব কম", "প্রস্রাব বন্ধ"], en: ["very little urine", "reduced urine", "no urine", "urine has stopped"], roman: ["prosab kome geche", "prosab hocche na"] },
        { id: "shock_or_fainting", bn: ["অজ্ঞান হয়ে গেছে", "অজ্ঞান হয়ে", "মূর্ছা গেছে", "ঠান্ডা আঠালো", "ঠান্ডা-আঠালো"], en: ["fainting", "fainted", "passed out", "cold clammy skin", "shock", "weak pulse"], roman: ["ogyan hoye geche", "thanda ghame"] },
        { id: "altered_mental_state", bn: ["অস্বাভাবিক ঝিমুনি", "খুব ঝিমুনি", "বিভ্রান্ত", "অস্বাভাবিক অস্থিরতা"], en: ["unusual drowsiness", "extreme sleepiness", "confusion", "unusual restlessness", "hard to wake"], roman: ["oshabhabik ghum", "khub jhimuni"] }
    ];

    function normalize(value) {
        return String(value || "").toLocaleLowerCase().normalize("NFKC")
            .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
            .replace(/[.,!?;:।"“”‘’(){}\[\]_-]/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    function isNegatedNear(text, phrase) {
        const haystack = normalize(text);
        const needle = normalize(phrase);
        const index = haystack.indexOf(needle);
        if (index < 0) return false;
        const before = haystack.slice(Math.max(0, index - 30), index);
        const after = haystack.slice(index + needle.length, index + needle.length + 24);
        const negatedBefore = /(?:\b(?:no|not|never|without|denies|don t have|doesn t have|isn t|aren t)\b\s*(?:(?:any|the|a|an|have|has|currently|experiencing|having|reporting|signs? of|evidence of)\s*){0,3}|(?:নেই|নয়|না|হয়নি|হচ্ছে না)\s*)$/i.test(before);
        const negatedAfter = /^(?:\s*(?:is|are|was|were)?\s*(?:not|absent)|\s*[\u0980-\u09FF\s]{0,12}(?:নেই|না|হয়নি|হচ্ছে না)|\s*(?:nai|nei|na))/i.test(after);
        return negatedBefore || negatedAfter;
    }

    function detectEmergency(question) {
        const text = normalize(question);
        const signals = [];
        EMERGENCY_SIGNALS.forEach(signal => {
            const phrases = [...signal.bn, ...signal.en, ...signal.roman];
            const matched = phrases.find(phrase => text.includes(normalize(phrase)) && !isNegatedNear(text, phrase));
            if (matched) signals.push({ id: signal.id, phrase: matched });
        });
        return { isEmergency: signals.length > 0, signals, level: signals.length ? "urgent" : "none" };
    }

    function detectMedicineRisk(question, answer = "") {
        const text = normalize(`${question || ""} ${answer || ""}`);
        const has = terms => terms.some(term => text.includes(normalize(term)));
        const warnings = [];
        const nsaids = ["aspirin", "ibuprofen", "naproxen", "diclofenac", "mefenamic acid", "ketorolac", "indomethacin", "celecoxib", "aceclofenac", "nsaid", "nonsteroidal anti-inflammatory"];
        if (has(nsaids)) warnings.push({ id: "nsaid_bleeding_risk", level: "high" });
        if (has(["warfarin", "apixaban", "rivaroxaban", "dabigatran", "clopidogrel", "blood thinner", "anticoagulant", "রক্ত পাতলা করার ওষুধ"])) warnings.push({ id: "prescribed_anticoagulant_caution", level: "high" });
        if (has(["paracetamol", "acetaminophen", "napa", "প্যারাসিটামল"])) warnings.push({ id: "paracetamol_dose_caution", level: "medium" });
        if (has(["antibiotic", "antibiotics", "অ্যান্টিবায়োটিক", "অ্যান্টিবায়োটিক"])) warnings.push({ id: "antibiotic_not_routine", level: "medium" });
        if (has(["steroid", "dexamethasone", "prednisolone", "স্টেরয়েড", "স্টেরয়েড"])) warnings.push({ id: "steroid_not_routine", level: "medium" });
        if (has(["child", "children", "baby", "infant", "শিশু", "বাচ্চা"]) && has(["dose", "dosage", "mg", "ml", "ডোজ", "মাত্রা"])) warnings.push({ id: "child_dose_requires_clinician", level: "high" });
        if (has(["pregnant", "pregnancy", "গর্ভবতী", "গর্ভাবস্থা"])) warnings.push({ id: "pregnancy_clinician_review", level: "medium" });
        return { hasWarnings: warnings.length > 0, warnings };
    }

    function answerFingerprint(answerBn, answerEn) {
        const input = `${normalize(answerBn)}|${normalize(answerEn)}`;
        let hash = 2166136261;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return `af_${(hash >>> 0).toString(16)}`;
    }

    function assessAnswer(record) {
        const bn = String(record && record.answerBn || "");
        const en = String(record && record.answerEn || "");
        const topic = String(record && record.topic || "general").toLowerCase();
        const warnings = [];
        if (bn.trim().length < 20 || en.trim().length < 20) warnings.push("Answer is missing or too short in one language.");
        const dosagePattern = /(?:\b\d+(?:\.\d+)?\s*(?:mg|mcg|μg|g|ml|tablet|tablets|capsule|capsules)\b|\b(?:one|two|three|four)\s+(?:tablets?|capsules?)\b|\b\d+\s*(?:মিগ্রা|মিলিগ্রাম|মিলি|ট্যাবলেট|ক্যাপসুল)|(?:এক|দুই|একটি|দুটি)\s*(?:ট্যাবলেট|ক্যাপসুল))/i;
        if (dosagePattern.test(normalize(bn)) || dosagePattern.test(normalize(en))) warnings.push("Specific medicine quantity detected; clinician review is required before publication.");
        const med = detectMedicineRisk(record && record.question, `${bn} ${en}`);
        if (med.warnings.some(item => item.id === "nsaid_bleeding_risk") && !/(avoid|do not take|not take|bleeding risk|এড়িয়ে|এড়িয়ে|খাবেন না|রক্তপাত)/i.test(`${bn} ${en}`)) {
            warnings.push("NSAID/aspirin mention found without a clear dengue bleeding-risk caution.");
        }
        if (["warning", "emergency", "dengue_bleeding_emergency"].includes(topic) && !/(emergency|urgent|hospital|জরুরি|হাসপাতাল)/i.test(`${bn} ${en}`)) {
            warnings.push("Warning-sign topic lacks an explicit urgent-care direction.");
        }
        const status = warnings.length ? "needs_clinician_review" : "automated_checks_passed_not_clinically_verified";
        return { status, warnings, fingerprint: answerFingerprint(bn, en), clinicalVerification: "not_established_by_automated_checks" };
    }

    function getReviewStatus(match) {
        if (!match) return { status: "unreviewed", label: "No matched answer record" };
        const fingerprint = answerFingerprint(match.answerBn, match.answerEn);
        const reviews = Array.isArray(window.approvedMedicalReviews) ? window.approvedMedicalReviews : [];
        const review = reviews.find(item => item.sourceEntryId === String(match.id || match.entryId || "") && item.answerFingerprint === fingerprint);
        if (!review) {
            const anyReview = reviews.find(item => item.sourceEntryId === String(match.id || match.entryId || ""));
            return anyReview
                ? { status: "outdated", label: "Answer changed after last clinical review", review: anyReview }
                : { status: "unreviewed", label: "No clinician approval recorded" };
        }
        const due = review.reviewDueAt ? new Date(review.reviewDueAt) : null;
        if (due && !Number.isNaN(due.getTime()) && due.getTime() < Date.now()) {
            return { status: "outdated", label: "Clinical review is past its review date", review };
        }
        const reviewedSourceIds = Array.isArray(review.reviewedSourceIds) ? review.reviewedSourceIds : [];
        if (window.medicalSourceRegistryLoaded === true && reviewedSourceIds.length && typeof window.getMedicalSourceRegistry === "function") {
            const sources = window.getMedicalSourceRegistry();
            const staleSource = reviewedSourceIds.some(id => {
                const source = sources.find(item => item.id === id);
                if (!source || source.status !== "active") return true;
                if (!source.reviewDueAt) return false;
                const sourceDue = new Date(source.reviewDueAt);
                return !Number.isNaN(sourceDue.getTime()) && sourceDue.getTime() < Date.now();
            });
            if (staleSource) return { status: "outdated", label: "A source used for this review is missing or overdue", review };
        }
        return { status: "verified", label: "Clinician reviewed", review };
    }

    window.normalizeMedicalText = normalize;
    window.detectDengueEmergencySignals = detectEmergency;
    window.detectDengueMedicineRisks = detectMedicineRisk;
    window.assessMedicalAnswer = assessAnswer;
    window.getMedicalAnswerFingerprint = answerFingerprint;
    window.getMedicalAnswerReviewStatus = getReviewStatus;
})();
