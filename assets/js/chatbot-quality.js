/* Task 11 retained; Task 29 adds a distinct retrieval-confidence tier.
   No score here represents diagnosis, clinical certainty or answer accuracy. */
(function () {
    const TOPIC_LABELS = {
        symptoms: "Symptoms", prevention: "Prevention", tests: "Tests & reports",
        platelets: "Platelets", food: "Food & nutrition", medicine: "Medicine safety",
        recovery: "Recovery", warning: "Warning signs", transmission: "Transmission",
        general: "General dengue information"
    };

    function getQuality(question) {
        let confidence = null;
        try {
            if (typeof window.getChatbotRetrievalConfidence === "function") {
                confidence = window.getChatbotRetrievalConfidence(question);
            }
        } catch (error) {
            console.warn("Chatbot retrieval confidence check failed:", error);
        }
        if (!confidence) {
            let matches = [];
            try {
                matches = typeof window.getTopDengueMatches === "function"
                    ? (window.getTopDengueMatches(question, 15) || []) : [];
            } catch (error) {
                console.warn("Chatbot relevance check failed:", error);
            }
            const top = matches[0] || null;
            const score = top ? Math.max(0, Math.min(100, Number(top.similarityPercent) || 0)) : 0;
            confidence = { level: score >= 65 ? "high" : score >= 40 ? "medium" : "low", score, margin: 0, matchCount: matches.length, bestMatch: top };
        }
        const top = confidence.bestMatch || null;
        return {
            level: confidence.level,
            confidenceLevel: confidence.level,
            score: confidence.score,
            margin: confidence.margin || 0,
            intent: top ? (TOPIC_LABELS[top.topic] || String(top.topic || "Dengue")) : "Unmatched",
            matchCount: confidence.matchCount,
            bestMatch: top,
            meaning: "retrieval_relevance_only"
        };
    }

    window.getChatbotAnswerQuality = getQuality;
})();
