// Task 12 — load only admin-approved community questions into the local hybrid index.
(function () {
    const allowedTopics = new Set([
        "symptoms", "prevention", "tests", "platelets", "food",
        "medicine", "recovery", "warning", "transmission", "general"
    ]);

    window.mergeApprovedCommunityQuestions = function (records) {
        if (!Array.isArray(window.dengueQuestionIndex)) return 0;
        const known = new Set(window.dengueQuestionIndex.map(item =>
            normalize(item.question)
        ));
        let added = 0;

        records.forEach(record => {
            const question = String(record.question || "").trim();
            const answerBn = String(record.answerBn || "").trim();
            const answerEn = String(record.answerEn || "").trim();
            const topic = String(record.topic || "").trim();
            const key = normalize(question);

            if (!question || !answerBn || !answerEn ||
                !allowedTopics.has(topic) || !key || known.has(key)) return;

            window.dengueQuestionIndex.push({
                id: `community_${record.id || added + 1}`,
                topic,
                question,
                answerBn,
                answerEn,
                communityApproved: true
            });
            known.add(key);
            added++;
        });

        return added;
    };

    // Task 16: apply Admin-managed edits, deactivations and custom entries
    // over the built-in bank without rewriting the original source data.
    const builtInBase = Array.isArray(window.dengueQuestionIndex)
        ? window.dengueQuestionIndex.filter(item => !String(item.id || "").startsWith("community_")).map(item => ({ ...item }))
        : [];

    window.applyAdminQuestionBankChanges = function (records) {
        if (!Array.isArray(records)) return 0;
        const changes = new Map();
        records.forEach(record => {
            if (record && record.entryId) changes.set(String(record.entryId), record);
        });

        const merged = builtInBase.map(base => {
            const change = changes.get(String(base.id));
            if (!change) return { ...base };
            if (change.status === "deleted") return null;
            if (change.status !== "active") return { ...base };
            return {
                ...base,
                topic: String(change.topic || base.topic),
                question: String(change.question || base.question),
                answerBn: String(change.answerBn || base.answerBn),
                answerEn: String(change.answerEn || base.answerEn),
                adminManaged: true
            };
        }).filter(Boolean);

        // Keep the already-approved community Q&A entries and append active
        // custom Admin entries. Custom records have stable Firestore document IDs.
        const communityEntries = Array.isArray(window.dengueQuestionIndex)
            ? window.dengueQuestionIndex.filter(item => item.communityApproved === true).map(item => ({ ...item }))
            : [];
        const knownIds = new Set(merged.map(item => String(item.id)));
        const knownQuestions = new Set(merged.map(item => normalize(item.question)));

        communityEntries.forEach(base => {
            const change = changes.get(String(base.id));
            if (change && change.status === "deleted") return;
            const item = change && change.status === "active" ? {
                ...base,
                topic: String(change.topic || base.topic),
                question: String(change.question || base.question),
                answerBn: String(change.answerBn || base.answerBn),
                answerEn: String(change.answerEn || base.answerEn),
                adminManaged: true
            } : base;
            if (!knownIds.has(String(item.id)) && !knownQuestions.has(normalize(item.question))) {
                merged.push(item);
                knownIds.add(String(item.id));
                knownQuestions.add(normalize(item.question));
            }
        });

        records.filter(record =>
            record && record.source === "custom" &&
            record.status === "active" && record.question &&
            record.answerBn && record.answerEn
        ).forEach(record => {
            const entry = {
                id: String(record.entryId),
                topic: String(record.topic || "general"),
                question: String(record.question),
                answerBn: String(record.answerBn),
                answerEn: String(record.answerEn),
                adminManaged: true
            };
            const key = normalize(entry.question);
            if (!knownIds.has(entry.id) && !knownQuestions.has(key)) {
                merged.push(entry);
                knownIds.add(entry.id);
                knownQuestions.add(key);
            }
        });

        window.dengueQuestionIndex = merged;
        if (typeof window.invalidateDengueSearchIndex === "function") {
            window.invalidateDengueSearchIndex();
        }
        return merged.length;
    };

    function normalize(value) {
        return String(value || "").toLocaleLowerCase().normalize("NFKC")
            .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
            .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
            .replace(/\s+/g, " ").trim();
    }
})();
