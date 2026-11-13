/*
 * Smart Dengue Hybrid Search — Task 2
 * Free, browser-side retrieval. No API key and no paid service.
 * Combines BM25, TF-IDF cosine, character n-gram fuzzy matching,
 * and a small Bangla/English synonym concept map.
 */
(function () {
    "use strict";

    const STOP_WORDS = new Set([
        "the","is","a","an","what","how","do","does","can","i","my","me","to","for",
        "of","in","on","with","and","or","please","tell","about","should","would","why",
        "হলে","কি","কী","কেন","কিভাবে","কীভাবে","থেকে","আমার","আমাকে","একটা","একটি",
        "হয়","হবে","হয়","করব","করবো","বলুন","জানতে","চাই","নিয়ে","নিয়ে","করে",
        "করতে","হচ্ছে","আসে","হয়েছে","হয়েছে","না","হতে","একটু","আপনি","জন্য","কোন","উচিত","করার","করলে","করুন","করা",
        "amr","amar","ami","apni","tumi","tomar","apnar","ki","kivabe","kibhabe","kno","kobe","ekhon","tahole","eta","eita","ache","ase","hoye","hoise","hocche","hoitese"
    ]);
    ["why", "কেন", "করব", "করবো"].forEach(word => STOP_WORDS.delete(word));

    // Tokens that express the same underlying dengue concept.
    // This is lightweight multilingual synonym expansion, not an AI diagnosis.
    const CONCEPT_GROUPS = [
        ["dengue","dengu","ডেঙ্গু","ডেঙ্গুর","ডেঙ্গুতে","ডেঙ্গুকে","ডেঙ্গুজনিত"],
        ["fever","জ্বর","জ্বরের","জ্বরটা","জ্বরেতে","jor","jhor","jwor"],
        ["symptom","symptoms","sign","signs","লক্ষণ","লক্ষন","উপসর্গ","চিহ্ন","lokkhon","lokkhon gula","lokkhon gulo"],
        ["headache","মাথাব্যথা","মাথা","matha","mathay"],
        ["bodypain","body pain","muscle pain","joint pain","শরীরব্যথা","শরীর","গা","মাংসপেশি","জয়েন্ট","জয়েন্ট","shorir","sorir","shorire","sorire","betha","batha","byatha","ব্যথা"],
        ["mosquito","mosquitoes","aedes","মশা","মশার","এডিস","mosha"],
        ["prevention","prevent","protect","প্রতিরোধ","বাঁচা","রক্ষা","সুরক্ষা"],
        ["platelet","platelets","platlet","প্লেটলেট","প্লাটিলেট","অনুচক্রিকা"],
        ["food","eat","eating","diet","খাবার","খেতে","খাওয়া","খাওয়া","খাদ্য","khabar","khaoa","khawa"],
        ["medicine","medication","drug","ওষুধ","ঔষধ","মেডিসিন","oshudh","osudh","oshud","osud","ausudh"],
        ["vomiting","vomit","বমি","বমি করা","bomi"],
        ["nausea","বমি বমি","বমিভাব"],
        ["rash","skin rash","র‍্যাশ","ফুসকুড়ি","ফুসকুড়ি","চামড়ায় দাগ","চামড়ায় দাগ"],
        ["bleeding","blood","রক্তপাত","রক্ত","রক্তক্ষরণ","rokto"],
        ["recovery","recover","weakness","fatigue","দুর্বলতা","সুস্থ","সেরে","ক্লান্তি"],
        ["test","testing","পরীক্ষা","টেস্ট","ns1","igm","igg","cbc"],
        ["spread","transmission","transmitted","ছড়ায়","ছড়ায়","সংক্রমণ","ছড়ানো","ছড়ানো"],
        ["warning","danger","emergency","বিপদ","বিপদের","সতর্কতা","জরুরি"],
        ["abdominal pain","stomach pain","পেটব্যথা","পেট ব্যথা","পেটে ব্যথা","pet betha","pete betha"],
        ["eye pain","retro orbital pain","চোখের পেছনে ব্যথা","চোখে ব্যথা"]
    ];

    const TOKEN_TO_CONCEPT = new Map();
    CONCEPT_GROUPS.forEach((group, index) => {
        group.forEach(term => TOKEN_TO_CONCEPT.set(normalizeToken(term), `concept_${index}`));
    });

    function normalizeToken(value) {
        return String(value || "").toLocaleLowerCase().normalize("NFKC")
            .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
            .replace(/[.,!?;:।"'“”‘’(){}\[\]\-_/\\]/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    function tokenize(value) {
        return normalizeToken(value).split(/\s+/)
            .filter(token => token.length > 1 && !STOP_WORDS.has(token));
    }

    function canonicalTokens(value) {
        let normalized = normalizeToken(value);
        // Phrase aliases bridge Bangla, English and common Banglish spellings.
        if (typeof SEMANTIC_PHRASE_ALIASES !== "undefined") {
            SEMANTIC_PHRASE_ALIASES.forEach((aliases, index) => {
                const canonical = ` semanticphrase${index} `;
                aliases.slice().sort((a, b) => b.length - a.length).forEach(alias => {
                    const phrase = normalizeToken(alias);
                    if (!phrase) return;
                    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    normalized = normalized.replace(
                        new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"),
                        (match, prefix) => `${prefix}${canonical.trim()}`
                    );
                });
            });
        }
        return tokenize(normalized).map(token => TOKEN_TO_CONCEPT.get(token) || token);
    }

    // Task 13: concept-level normalization for cross-language duplicate detection.
    // Phrase aliases are normalized before tokenization so "body pain" and
    // "শরীর ব্যথা" become the same concept token.
    const SEMANTIC_PHRASE_ALIASES = [
        ["body pain", "body ache", "body aches", "muscle pain", "muscle ache",
         "joint pain", "joint aches", "শরীর ব্যথা", "শরীরব্যথা", "গা ব্যথা",
         "পেশি ব্যথা", "মাংসপেশি ব্যথা", "জয়েন্টে ব্যথা", "জয়েন্টে ব্যথা",
         "shorir betha", "sorir betha", "shorir batha", "ga betha", "gaye betha",
         "gaye betha kore", "shorir betha kore", "shorir e betha", "sorire betha",
         "shorire batha", "sorir betha kore", "গায়ে ব্যথা", "গায়ে ব্যথা"],
        ["headache", "head pain", "মাথাব্যথা", "মাথা ব্যথা", "matha betha", "matha batha",
         "mathay betha", "matha betha kore", "mathay batha", "মাথায় ব্যথা", "মাথায় ব্যথা"],
        ["eye pain", "pain behind the eyes", "retro orbital pain",
         "চোখের পেছনে ব্যথা", "চোখে ব্যথা"],
        ["stomach pain", "abdominal pain", "পেট ব্যথা", "পেটব্যথা", "পেটে ব্যথা", "pet betha", "pete betha"],
        ["mosquito bite", "mosquito bites", "মশার কামড়", "মশার কামড়"],
        ["low platelet", "low platelets", "platelet count low", "প্লেটলেট কম",
         "প্লেটলেট কমে", "অনুচক্রিকা কম", "platelet kom", "platelet kome", "platlet kom",
         "platlet komse", "platelet komse", "platelet komche", "platelet kome geche",
         "platelet kome gese", "platlets kom", "প্লেটলেট কমেছে", "প্লেটলেট কমে গেছে"],
        ["dengue fever", "dengu fever", "dengu jor", "dengue jor", "dengu jor hoise",
         "dengue hoise", "dengu hoise", "dengu hoyeche", "dengue hoyeche", "ডেঙ্গু জ্বর",
         "ডেঙ্গু হয়েছে", "ডেঙ্গু হয়েছে"],
        ["fever", "jor", "jhor", "jwor", "amar jor", "amr jor", "jor ache", "jor ase",
         "jor asche", "jhor ache", "jwor ache", "জ্বর", "জ্বর এসেছে", "জ্বর আছে"],
        ["vomiting", "bomi", "bomi hocche", "bomi hoitese", "bomi hochhe", "bomi ashe",
         "bomi hoy", "বমি হচ্ছে", "বমি আসছে"],
        ["bleeding", "rokto pore", "rokto pora", "rokto khoron", "rokto porchhe",
         "rokto porche", "rokto jacche", "nak diye rokto", "mari diye rokto",
         "নাক দিয়ে রক্ত", "মাড়ি দিয়ে রক্ত"],
        ["medicine", "oshudh", "osudh", "oshud", "osud", "ausudh", "oshudh khabo",
         "osudh khabo", "ওষুধ", "কোন ওষুধ খাব"],
        ["food", "khabar", "khaoa", "khawa", "ki khabo", "ki khaoa uchit",
         "ki khawa uchit", "ki khete pari", "ki khete hobe", "খাবার", "কি খাব", "কী খাওয়া উচিত"],
        ["why", "why does", "why do", "keno", "karon", "কেন", "কারণ"],
        ["what should i do", "what to do", "ki korbo", "korbo ki", "কি করব", "কী করব", "কী করবো"],
        ["breathing difficulty", "difficulty breathing", "shortness of breath",
         "shashkosto", "shash koshto", "shash nite koshto", "dom nite koshto",
         "শ্বাসকষ্ট", "শ্বাস নিতে কষ্ট"],
        ["warning signs", "warning sign", "danger signs", "kokhon hospital e jabo",
         "hospital e jete hobe", "kokhon hospital jete hobe", "bipod lokkhon",
         "বিপদের লক্ষণ", "কখন হাসপাতালে যাব"],
        ["ns1 test", "ns1 পরীক্ষা", "ns1 test for dengue", "ns1 পরীক্ষা কখন", "ডেঙ্গুতে ns1 পরীক্ষা", "ডেঙ্গুতে ns1 পরীক্ষা কখন করাতে হয়", "ns1 kokhon korbo", "ns1 test kokhon", "ns1 kobe korbo", "এনএস১ পরীক্ষা কখন"]
    ];

    const SEMANTIC_STOP_WORDS = new Set([
        ...STOP_WORDS, "cause", "causes", "caused", "reason", "reasons",
        "কারণ", "হয়েছে", "হয়েছে", "হয়", "হয়", "করছে", "করে", "হলো",
        "does", "did", "why", "what", "how", "when", "is", "are", "was", "were",
        "the", "a", "an", "of", "for", "in", "on", "to", "with", "about", "get", "take", "কখন", "কবে", "করাতে", "করাব", "করাবো"
    ]);

    function semanticQuestionTokens(value) {
        let normalized = normalizeToken(value);
        SEMANTIC_PHRASE_ALIASES.forEach((aliases, index) => {
            const canonical = ` semanticphrase${index} `;
            aliases.slice().sort((a, b) => b.length - a.length).forEach(alias => {
                const phrase = normalizeToken(alias);
                if (!phrase) return;
                const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                normalized = normalized.replace(
                    new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"),
                    (match, prefix) => `${prefix}${canonical.trim()}`
                );
            });
        });

        return normalized.split(/\s+/)
            .filter(token => token.length > 1 && !SEMANTIC_STOP_WORDS.has(token))
            .map(token => TOKEN_TO_CONCEPT.get(token) || token)
            .filter((token, index, array) => array.indexOf(token) === index);
    }

    function compareDengueQuestionSimilarity(questionA, questionB) {
        const normalizedA = normalizeToken(questionA);
        const normalizedB = normalizeToken(questionB);
        const a = semanticQuestionTokens(questionA);
        const b = semanticQuestionTokens(questionB);
        const shared = a.filter(token => b.includes(token));
        const dice = (a.length && b.length) ? (2 * shared.length) / (a.length + b.length) : 0;
        const containment = (a.length && b.length) ? shared.length / Math.min(a.length, b.length) : 0;
        const characterSimilarity = fuzzyDice(questionA, questionB);
        const exact = Boolean(normalizedA && normalizedA === normalizedB);
        const score = exact ? 1 : Math.max(0, Math.min(1,
            (dice * 0.60) + (containment * 0.30) + (characterSimilarity * 0.10)
        ));

        return {
            score,
            similarityPercent: Math.round(score * 100),
            sharedConcepts: shared,
            tokenCountA: a.length,
            tokenCountB: b.length,
            characterSimilarity: Math.round(characterSimilarity * 100),
            matchType: exact ? "exact" : shared.length >= 2 ? "semantic" : "fuzzy"
        };
    }

    function findDengueQuestionDuplicates(question, candidates, limit = 5) {
        if (!Array.isArray(candidates)) return [];
        const seen = new Set();
        return candidates
            .filter(item => item && typeof item.question === "string")
            .map(item => {
                const comparison = compareDengueQuestionSimilarity(question, item.question);
                return { ...item, ...comparison };
            })
            .filter(item =>
                item.score >= 0.42 &&
                (item.sharedConcepts.length >= 2 || item.characterSimilarity >= 80)
            )
            .sort((a, b) => b.score - a.score)
            .filter(item => {
                const key = normalizeToken(item.question);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .slice(0, Math.max(1, Math.min(10, Number(limit) || 5)));
    }

    function termFrequency(tokens) {
        const tf = new Map();
        tokens.forEach(token => tf.set(token, (tf.get(token) || 0) + 1));
        return tf;
    }

    function buildIndex(records) {
        const docs = records.map(record => {
            const tokens = canonicalTokens(record.question);
            return { ...record, tokens, tf: termFrequency(tokens), length: tokens.length };
        });
        const df = new Map();
        docs.forEach(doc => {
            new Set(doc.tokens).forEach(token => df.set(token, (df.get(token) || 0) + 1));
        });
        const avgLength = docs.reduce((sum, doc) => sum + doc.length, 0) / Math.max(docs.length, 1);
        return { docs, df, avgLength, total: docs.length };
    }

    function bm25(queryTokens, doc, index) {
        const k1 = 1.5, b = 0.75;
        let score = 0;
        const uniqueQuery = [...new Set(queryTokens)];
        uniqueQuery.forEach(token => {
            const tf = doc.tf.get(token) || 0;
            if (!tf) return;
            const df = index.df.get(token) || 0;
            const idf = Math.log(1 + (index.total - df + 0.5) / (df + 0.5));
            const denominator = tf + k1 * (1 - b + b * doc.length / (index.avgLength || 1));
            score += idf * (tf * (k1 + 1)) / denominator;
        });
        return score;
    }

    function tfidfVector(tokens, index) {
        const tf = termFrequency(tokens);
        const vector = new Map();
        tf.forEach((count, token) => {
            const df = index.df.get(token) || 0;
            const idf = Math.log((index.total + 1) / (df + 1)) + 1;
            vector.set(token, (1 + Math.log(count)) * idf);
        });
        return vector;
    }

    function cosineSimilarity(a, b) {
        if (!a.size || !b.size) return 0;
        let dot = 0, normA = 0, normB = 0;
        a.forEach((value, key) => {
            normA += value * value;
            if (b.has(key)) dot += value * b.get(key);
        });
        b.forEach(value => normB += value * value);
        return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
    }

    function charNgrams(value, n = 3) {
        const clean = ` ${normalizeToken(value).replace(/\s+/g, " ")} `;
        const grams = new Set();
        if (clean.length <= n) grams.add(clean);
        else for (let i = 0; i <= clean.length - n; i++) grams.add(clean.slice(i, i + n));
        return grams;
    }

    function fuzzyDice(a, b) {
        const aa = charNgrams(a), bb = charNgrams(b);
        if (!aa.size || !bb.size) return 0;
        let common = 0;
        aa.forEach(gram => { if (bb.has(gram)) common++; });
        return (2 * common) / (aa.size + bb.size);
    }

    function normalizeScores(items, field) {
        const max = Math.max(...items.map(item => item[field]), 0);
        items.forEach(item => item[`${field}Normalized`] = max ? item[field] / max : 0);
    }

    let cachedIndex = null;
    function getIndex() {
        const records = window.dengueQuestionIndex;
        if (!Array.isArray(records) || !records.length) return null;
        if (!cachedIndex || cachedIndex.total !== records.length) cachedIndex = buildIndex(records);
        return cachedIndex;
    }

    function searchDengueCandidates(message, limit = 30) {
        const index = getIndex();
        if (!index) return [];
        const rawTokens = tokenize(message);
        const queryTokens = canonicalTokens(message);
        if (!queryTokens.length) return [];

        const queryVector = tfidfVector(queryTokens, index);
        const normalizedQuery = normalizeToken(message);
        const querySet = new Set(queryTokens);
        const rows = index.docs.map(doc => {
            const overlap = queryTokens.filter(token => doc.tokens.includes(token)).length;
            const docSet = new Set(doc.tokens);
            const union = new Set([...querySet, ...docSet]).size;
            return {
                id: doc.id,
                topic: doc.topic,
                question: doc.question,
                answerBn: doc.answerBn,
                answerEn: doc.answerEn,
                communityApproved: doc.communityApproved === true,
                adminManaged: doc.adminManaged === true,
                source: doc.communityApproved === true ? "community" : (doc.adminManaged === true ? "admin" : "builtin"),
                bm25: bm25(queryTokens, doc, index),
                tfidf: cosineSimilarity(queryVector, tfidfVector(doc.tokens, index)),
                fuzzy: fuzzyDice(message, doc.question),
                conceptOverlap: overlap,
                tokenJaccard: union ? overlap / union : 0,
                exactMatch: normalizedQuery === normalizeToken(doc.question)
            };
        });

        normalizeScores(rows, "bm25");
        rows.forEach(row => {
            // Semantic proxy: concept-level synonym expansion lets Bangla/English
            // paraphrases meet even when their surface words differ.
            row.semantic = row.conceptOverlap / Math.max(new Set(queryTokens).size, 1);
            row.score = row.exactMatch ? 1 :
                (row.bm25Normalized * 0.40) +
                (row.tfidf * 0.25) +
                (row.fuzzy * 0.10) +
                (row.semantic * 0.15) +
                (row.tokenJaccard * 0.10);
            row.score = Math.max(0, Math.min(1, row.score));
            row.similarityPercent = Math.round(row.score * 100);

            // Task 63: explain the text-retrieval signals behind each result.
            // These signals describe wording/concept overlap, never medical correctness.
            row.matchSignals = [];
            if (row.exactMatch) row.matchSignals.push("exact");
            if (row.semantic >= 0.30) row.matchSignals.push("concept");
            if (row.fuzzy >= 0.38) row.matchSignals.push("spelling");
            if (row.bm25Normalized >= 0.25 || row.tfidf >= 0.25) row.matchSignals.push("keywords");
            if (!row.matchSignals.length && row.score >= 0.10) row.matchSignals.push("weak-overlap");
            row.matchType = row.exactMatch ? "exact" :
                row.semantic >= 0.30 ? "semantic" :
                row.fuzzy >= 0.38 ? "fuzzy" : "keyword";
        });

        rows.sort((a, b) =>
            b.score - a.score ||
            b.conceptOverlap - a.conceptOverlap ||
            a.id.localeCompare(b.id)
        );
        return rows.slice(0, Math.max(1, limit));
    }

    // Task 3: keep only meaningful results and return the best 15.
    // The score is a text-relevance score, not medical certainty.
    function getTopDengueMatches(message, limit = 15) {
        const requestedLimit = Math.max(1, Math.min(15, Number(limit) || 15));
        const effectiveMessage = typeof window.resolveDengueFollowUpQuery === "function"
            ? window.resolveDengueFollowUpQuery(message)
            : message;

        // Do not display random nearest-neighbour results for greetings or unrelated topics.
        if (
            typeof window.isDengueRelated === "function" &&
            typeof window.dengueTokens === "function" &&
            !window.isDengueRelated(window.dengueTokens(effectiveMessage))
        ) {
            return [];
        }

        const ranked = searchDengueCandidates(effectiveMessage, 100);
        if (!ranked.length) return [];

        const topScore = ranked[0].score;
        const minimumScore = Math.max(0.10, topScore * 0.42);
        const selected = [];
        const seenQuestions = new Set();

        // Diversity filter: skip near-identical paraphrases so the list
        // contains meaningfully different questions, not 15 tiny rewrites.
        function questionTokenSet(question) {
            return new Set(canonicalTokens(question));
        }

        function tokenJaccard(a, b) {
            const aa = questionTokenSet(a);
            const bb = questionTokenSet(b);
            if (!aa.size || !bb.size) return 0;
            let intersection = 0;
            aa.forEach(token => { if (bb.has(token)) intersection++; });
            const union = new Set([...aa, ...bb]).size;
            return union ? intersection / union : 0;
        }

        for (const item of ranked) {
            if (item.score < minimumScore) continue;

            const key = normalizeToken(item.question);
            if (seenQuestions.has(key)) continue;

            const tooSimilarToSelected = selected.some(existing =>
                tokenJaccard(existing.question, item.question) >= 0.78
            );
            if (tooSimilarToSelected) continue;

            seenQuestions.add(key);
            selected.push(item);
            if (selected.length >= requestedLimit) break;
        }

        // Fill remaining slots from the same relevance band. This keeps the
        // promised Top-15 list useful even when paraphrase diversity is limited.
        if (selected.length < requestedLimit) {
            const fillThreshold = Math.max(0.08, topScore * 0.20);
            for (const item of ranked) {
                if (item.score < fillThreshold || selected.length >= requestedLimit) continue;
                const key = normalizeToken(item.question);
                if (seenQuestions.has(key)) continue;
                seenQuestions.add(key);
                selected.push(item);
            }
        }

        selected.sort((a, b) => b.score - a.score);
        return selected.map((item, index) => ({
            ...item,
            rank: index + 1,
            similarityPercent: Math.round(item.score * 100)
        }));
    }

    window.invalidateDengueSearchIndex = function () {
        cachedIndex = null;
    };

    window.searchDengueCandidates = searchDengueCandidates;
    window.getTopDengueMatches = getTopDengueMatches;
    window.compareDengueQuestionSimilarity = compareDengueQuestionSimilarity;
    window.findDengueQuestionDuplicates = findDengueQuestionDuplicates;
    window.dengueSearchNormalize = normalizeToken;
    window.dengueSearchEngineInfo = {
        name: "Free Hybrid Search",
        methods: ["BM25", "TF-IDF Cosine", "Character N-gram Fuzzy Matching", "Bangla-English Synonym Expansion"],
        apiRequired: false,
        paidServiceRequired: false
    };
})();
