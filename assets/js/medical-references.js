/* Task 32: official reference registry with safe local fallbacks. */
(function () {
    const DEFAULT_SOURCES = [
        { id: "dghs_dengue_2025", title: "National Guideline for Clinical Management of Dengue (5th Edition, 2025)", organization: "Directorate General of Health Services, Bangladesh", url: "https://dghs.gov.bd/pages/static-pages/6922e05c933eb65569e26afe", topics: ["general", "symptoms", "warning", "medicine", "tests", "platelets", "recovery"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "who_arboviral_guideline_2025", title: "WHO guidelines for clinical management of arboviral diseases (4 July 2025)", organization: "World Health Organization", url: "https://www.who.int/publications/i/item/9789240111110", publicationDate: "2025-07-04", topics: ["general", "warning", "medicine", "tests", "recovery"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "cdc_clinical_care_2026", title: "Clinical Care of Dengue (updated 15 April 2026)", organization: "Centers for Disease Control and Prevention", url: "https://www.cdc.gov/dengue/hcp/clinical-care/index.html", publicationDate: "2026-04-15", topics: ["general", "symptoms", "warning", "medicine", "tests", "platelets", "recovery"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "cdc_clinical_care", title: "Clinical Care of Dengue", organization: "Centers for Disease Control and Prevention", url: "https://www.cdc.gov/dengue/hcp/clinical-care/", topics: ["general", "symptoms", "warning", "medicine", "tests", "platelets", "recovery"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "cdc_treatment", title: "Manage Dengue", organization: "Centers for Disease Control and Prevention", url: "https://www.cdc.gov/dengue/treatment/index.html", topics: ["medicine", "recovery", "warning"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "who_dengue", title: "Dengue and severe dengue", organization: "World Health Organization", url: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue", topics: ["general", "symptoms", "warning", "prevention", "transmission"], status: "active", reviewStatus: "unverified", builtIn: true },
        { id: "who_arboviral_guideline", title: "WHO Handbook for Clinical Management of Dengue", organization: "World Health Organization", url: "https://www.ncbi.nlm.nih.gov/books/NBK143157/", topics: ["general", "warning", "medicine", "tests", "recovery"], status: "active", reviewStatus: "unverified", builtIn: true }
    ];
    let registry = DEFAULT_SOURCES.map(item => ({ ...item }));

    function load(records) {
        if (!Array.isArray(records)) return registry.length;
        const merged = new Map(DEFAULT_SOURCES.map(item => [item.id, { ...item }]));
        records.forEach(record => {
            if (!record || record.status !== "active" || !record.url || !/^https:\/\//i.test(record.url)) return;
            const id = String(record.id || record.sourceId || "");
            if (!id) return;
            merged.set(id, { ...record, id });
        });
        registry = [...merged.values()];
        window.medicalSourceRegistryLoaded = true;
        return registry.length;
    }

    function getForAnswer(match) {
        if (!match) return [];
        const topic = String(match.topic || "general").toLowerCase();
        const review = typeof window.getMedicalAnswerReviewStatus === "function"
            ? window.getMedicalAnswerReviewStatus(match) : null;
        const reviewedIds = review && review.status === "verified" && review.review
            ? (Array.isArray(review.review.reviewedSourceIds) ? review.review.reviewedSourceIds : []) : [];
        const attachedIds = Array.isArray(match.sourceIds) ? match.sourceIds : [];
        const topicSources = registry.filter(item => Array.isArray(item.topics) && item.topics.includes(topic));
        const selected = reviewedIds.length
            ? registry.filter(item => reviewedIds.includes(item.id))
            : [...registry.filter(item => attachedIds.includes(item.id)), ...topicSources]
                .filter((item, index, list) => list.findIndex(candidate => candidate.id === item.id) === index);
        return selected.slice(0, 4).map(item => ({
            ...item,
            clinicianReferenced: reviewedIds.includes(item.id),
            stale: Boolean(item.reviewDueAt && new Date(item.reviewDueAt).getTime() < Date.now())
        }));
    }

    function getAll() { return registry.map(item => ({ ...item })); }
    window.loadMedicalSourceRegistry = load;
    window.getMedicalReferencesForAnswer = getForAnswer;
    window.getMedicalSourceRegistry = getAll;
})();
