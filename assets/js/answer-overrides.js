// Task 14 — apply only admin-approved, versioned answer corrections.
(function () {
    const approvedOverrides = new Map();

    function normalizeQuestion(value) {
        return String(value || "").toLocaleLowerCase().normalize("NFKC")
            .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
            .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    function questionKey(value) {
        const normalized = normalizeQuestion(value);
        let hash = 2166136261;
        for (let i = 0; i < normalized.length; i++) {
            hash ^= normalized.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return `q_${(hash >>> 0).toString(16)}`;
    }

    function load(records) {
        approvedOverrides.clear();
        if (!Array.isArray(records)) return 0;

        records
            .filter(item => item && item.status === "approved" &&
                item.sourceQuestion && item.answerBn && item.answerEn)
            .sort((a, b) => Number(a.version || 0) - Number(b.version || 0))
            .forEach(item => {
                const key = questionKey(item.sourceQuestion);
                const previous = approvedOverrides.get(key);
                if (!previous || Number(item.version || 0) >= Number(previous.version || 0)) {
                    approvedOverrides.set(key, item);
                }
            });
        return approvedOverrides.size;
    }

    function get(question) {
        return approvedOverrides.get(questionKey(question)) || null;
    }

    window.loadApprovedAnswerOverrides = load;
    window.getApprovedAnswerOverride = get;
    window.getDengueQuestionKey = questionKey;
})();
