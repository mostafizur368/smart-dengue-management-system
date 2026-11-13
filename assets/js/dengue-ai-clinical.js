/* Batch 5 — Tasks 59–62.
   Transparent, deterministic dengue safety and patient-summary helpers.
   This is not a diagnostic model and does not replace clinician assessment. */
(function () {
  "use strict";

  const WARNING_TERMS = [
    { id: "severe_abdominal_pain", labelBn: "তীব্র পেটব্যথা", labelEn: "Severe abdominal pain", phrases: ["তীব্র পেটব্যথা", "পেটে তীব্র ব্যথা", "পেট খুব ব্যথা", "severe abdominal pain", "severe stomach pain", "intense abdominal pain"] },
    { id: "persistent_vomiting", labelBn: "বারবার / অবিরাম বমি", labelEn: "Persistent vomiting", phrases: ["বারবার বমি", "অবিরাম বমি", "বমি থামছে না", "persistent vomiting", "repeated vomiting", "cannot stop vomiting"] },
    { id: "mucosal_bleeding", labelBn: "নাক / মাড়ি বা অন্য জায়গা থেকে রক্তপাত", labelEn: "Mucosal or other bleeding", phrases: ["নাক দিয়ে রক্ত", "নাক থেকে রক্ত", "মাড়ি দিয়ে রক্ত", "মাড়ি দিয়ে রক্ত", "রক্তবমি", "রক্ত বমি", "পায়খানায় রক্ত", "কালো পায়খানা", "মল কালো", "bleeding gums", "nose bleeding", "nosebleed", "blood in vomit", "vomiting blood", "blood in stool", "black stool", "mucosal bleeding"] },
    { id: "fluid_accumulation", labelBn: "শরীরে / পেটে নতুন তরল জমা বা ফোলা", labelEn: "New fluid accumulation or swelling", phrases: ["পেটে পানি জমেছে", "পেটে তরল জমেছে", "বুকে পানি জমেছে", "শরীরে পানি জমেছে", "fluid accumulation", "fluid build up", "ascites", "pleural effusion", "new abdominal swelling"] },
    { id: "altered_mental_state", labelBn: "অস্বাভাবিক ঝিমুনি, বিভ্রান্তি বা অস্থিরতা", labelEn: "Unusual drowsiness, confusion or restlessness", phrases: ["অস্বাভাবিক ঝিমুনি", "খুব ঝিমুনি", "অস্বাভাবিক অস্থিরতা", "বিভ্রান্ত", "ডাকলে জাগে না", "unusual drowsiness", "extreme sleepiness", "confusion", "unusual restlessness", "hard to wake", "lethargy"] },
    { id: "fainting_or_dizziness", labelBn: "অজ্ঞান হওয়া বা দাঁড়ালে মাথা ঘোরা", labelEn: "Fainting or postural dizziness", phrases: ["অজ্ঞান হয়ে গেছে", "অজ্ঞান হয়ে", "মূর্ছা গেছে", "মাথা ঘুরে পড়ে", "দাঁড়ালে মাথা ঘোরে", "fainting", "fainted", "passed out", "postural dizziness", "feeling faint", "lipothymia"] },
    { id: "breathing_difficulty", labelBn: "দ্রুত শ্বাস বা শ্বাসকষ্ট", labelEn: "Rapid breathing or breathing difficulty", phrases: ["শ্বাসকষ্ট", "শ্বাস নিতে কষ্ট", "দম নিতে কষ্ট", "দ্রুত শ্বাস", "rapid breathing", "difficulty breathing", "trouble breathing", "shortness of breath", "cannot breathe"] },
    { id: "cold_pale_skin", labelBn: "ফ্যাকাশে / ঠান্ডা ও আঠালো ত্বক", labelEn: "Pale, cold or clammy skin", phrases: ["ফ্যাকাশে ত্বক", "ফ্যাকাশে হয়ে গেছে", "ঠান্ডা আঠালো", "ঠান্ডা-আঠালো", "pale and cold skin", "cold clammy skin", "cold, clammy", "clammy skin"] },
    { id: "reduced_urine", labelBn: "প্রস্রাব উল্লেখযোগ্যভাবে কমে যাওয়া", labelEn: "Markedly reduced urination", phrases: ["প্রস্রাব কমে গেছে", "প্রস্রাব খুব কম", "প্রস্রাব বন্ধ", "প্রস্রাব হচ্ছে না", "very little urine", "reduced urine", "no urine", "urine has stopped", "markedly reduced urination"] },
    { id: "intense_thirst", labelBn: "অস্বাভাবিক বেশি তৃষ্ণা", labelEn: "Unusual intense thirst", phrases: ["খুব বেশি পিপাসা", "অতিরিক্ত তৃষ্ণা", "পানি খেলেও পিপাসা", "very thirsty", "intense thirst", "excessive thirst"] },
    { id: "liver_enlargement", labelBn: "চিকিৎসক জানিয়েছেন লিভার বড় হয়েছে", labelEn: "Clinician-reported liver enlargement", phrases: ["লিভার বড় হয়েছে", "যকৃত বড় হয়েছে", "liver enlargement", "enlarged liver", "hepatomegaly"] }
  ];

  const SYMPTOM_TO_WARNING = {
    "repeated-vomiting": "persistent_vomiting",
    "severe-abdominal-pain": "severe_abdominal_pain",
    "bleeding": "mucosal_bleeding",
    "breathing-difficulty": "breathing_difficulty",
    "rapid-breathing": "breathing_difficulty",
    "unusual-drowsiness": "altered_mental_state",
    "marked-restlessness": "altered_mental_state",
    "cold-clammy-skin": "cold_pale_skin",
    "pale-cold-skin": "cold_pale_skin",
    "reduced-urination": "reduced_urine",
    "fainting": "fainting_or_dizziness",
    "fluid-accumulation": "fluid_accumulation",
    "very-thirsty": "intense_thirst",
    "blood-vomit-stool": "mucosal_bleeding",
    "liver-enlargement": "liver_enlargement"
  };

  const SOURCES = [
    {
      id: "who_arboviral_guideline_2025",
      organization: "World Health Organization",
      title: "WHO guidelines for clinical management of arboviral diseases",
      publicationDate: "2025-07-04",
      url: "https://www.who.int/publications/i/item/9789240111110"
    },
    {
      id: "cdc_clinical_care_2026",
      organization: "Centers for Disease Control and Prevention",
      title: "Clinical Care of Dengue",
      publicationDate: "2026-04-15",
      url: "https://www.cdc.gov/dengue/hcp/clinical-care/index.html"
    },
    {
      id: "who_dengue_fact_sheet",
      organization: "World Health Organization",
      title: "Dengue and severe dengue",
      publicationDate: "",
      url: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue"
    }
  ];

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().normalize("NFKC")
      .replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit).toString())
      .replace(/[.,!?;:।"“”‘’(){}\[\]_-]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  function isNegated(text, phrase) {
    const source = normalize(text);
    const target = normalize(phrase);
    let index = source.indexOf(target);
    if (index < 0) return false;
    const before = source.slice(Math.max(0, index - 36), index);
    const after = source.slice(index + target.length, index + target.length + 26);
    const beforeNegative = /(?:\b(?:no|not|never|without|denies|don'?t have|doesn'?t have|isn'?t|aren'?t)\b\s*(?:(?:any|the|a|an|have|has|currently|experiencing|having|reporting|signs? of)\s*){0,3}|(?:নেই|নয়|না|হয়নি|হচ্ছে না)\s*)$/i.test(before);
    const afterNegative = /^\s*(?:(?:is|are|was|were)\s*)?(?:not|absent)|^\s*(?:নেই|না|হয়নি|হচ্ছে না|nai|nei)/i.test(after);
    return beforeNegative || afterNegative;
  }

  function detectWarningSigns(text) {
    const found = [];
    WARNING_TERMS.forEach(item => {
      const phrase = item.phrases.find(candidate =>
        normalize(text).includes(normalize(candidate)) && !isNegated(text, candidate)
      );
      if (phrase) found.push({ id: item.id, phrase, labelBn: item.labelBn, labelEn: item.labelEn });
    });
    return { hasWarningSigns: found.length > 0, level: found.length ? "urgent_review" : "none", signals: found };
  }

  function assessPatientWarningSigns(symptomEntries) {
    const latestBySignal = new Map();
    (Array.isArray(symptomEntries) ? symptomEntries : []).forEach(entry => {
      (Array.isArray(entry.symptoms) ? entry.symptoms : []).forEach(value => {
        const id = SYMPTOM_TO_WARNING[value];
        if (id) latestBySignal.set(id, entry.logDate || "");
      });
      const noteResult = detectWarningSigns(entry.notes || "");
      noteResult.signals.forEach(signal => latestBySignal.set(signal.id, entry.logDate || ""));
    });
    const signals = [...latestBySignal.entries()].map(([id, date]) => {
      const definition = WARNING_TERMS.find(item => item.id === id);
      return { id, date, labelBn: definition ? definition.labelBn : id, labelEn: definition ? definition.labelEn : id };
    });
    return { hasWarningSigns: signals.length > 0, level: signals.length ? "urgent_review" : "none", signals };
  }

  function validNumber(value) {
    return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
  }

  function compareTrend(previous, latest, key) {
    if (!previous || !latest || !validNumber(previous[key]) || !validNumber(latest[key])) return "insufficient";
    const before = Number(previous[key]);
    const after = Number(latest[key]);
    if (after > before) return "increased";
    if (after < before) return "decreased";
    return "unchanged";
  }

  function interpretBloodReports(reports) {
    const records = (Array.isArray(reports) ? reports : [])
      .filter(item => item && item.reportDate)
      .slice()
      .sort((a, b) => String(a.reportDate).localeCompare(String(b.reportDate)));
    if (!records.length) {
      return {
        hasData: false,
        pairedTrendFlag: false,
        lines: ["No blood report has been entered yet."],
        disclaimer: "Enter values exactly as printed on the laboratory report. A clinician must interpret them."
      };
    }

    const latest = records[records.length - 1];
    const previous = records.length > 1 ? records[records.length - 2] : null;
    const lines = [`Latest report date: ${latest.reportDate}.`];
    const fields = [
      ["Platelet count", "plateletCount", "×10⁹/L"],
      ["Hematocrit (HCT)", "hematocrit", "%"],
      ["White blood cells (WBC)", "wbcCount", "×10⁹/L"],
      ["Hemoglobin", "hemoglobin", "g/dL"]
    ];
    fields.forEach(([label, key, unit]) => {
      if (validNumber(latest[key])) lines.push(`${label}: ${Number(latest[key]).toLocaleString()} ${unit}.`);
    });

    const plateletTrend = compareTrend(previous, latest, "plateletCount");
    const hctTrend = compareTrend(previous, latest, "hematocrit");
    if (previous) {
      if (plateletTrend === "decreased") lines.push("Platelet count is lower than in the previous entered report.");
      else if (plateletTrend === "increased") lines.push("Platelet count is higher than in the previous entered report.");
      else if (plateletTrend === "unchanged") lines.push("Platelet count is unchanged between the two latest entered reports.");
      if (hctTrend === "increased") lines.push("Hematocrit is higher than in the previous entered report.");
      else if (hctTrend === "decreased") lines.push("Hematocrit is lower than in the previous entered report.");
      else if (hctTrend === "unchanged") lines.push("Hematocrit is unchanged between the two latest entered reports.");
    } else {
      lines.push("Only one report is available, so a trend cannot be assessed.");
    }

    const pairedTrendFlag = plateletTrend === "decreased" && hctTrend === "increased";
    if (pairedTrendFlag) {
      lines.push("IMPORTANT: The two latest entries show a higher HCT together with a lower platelet count. If these reports were taken during the same dengue illness episode, this pattern can be clinically important; contact the treating clinician promptly to interpret the dates, measurement intervals, laboratory ranges and clinical condition. The app cannot verify measurement timing or confirm that the reports belong to one illness episode.");
    } else if (plateletTrend === "decreased") {
      lines.push("A decrease in platelet count alone does not determine dengue severity. The trend must be interpreted with symptoms, examination and other results.");
    } else if (hctTrend === "increased") {
      lines.push("A rising HCT needs interpretation against the patient's baseline, hydration status, laboratory range and clinical condition.");
    }

    return {
      hasData: true,
      latest,
      previous,
      plateletTrend,
      hctTrend,
      pairedTrendFlag,
      lines,
      disclaimer: "This is a rule-based summary of values you entered, not an AI diagnosis or a laboratory interpretation. No universal normal/critical range is applied. Contact a clinician for interpretation; warning signs require urgent medical assessment."
    };
  }

  function buildPatientSummary(data) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const symptoms = (data.symptoms || []).filter(item => item && item.logDate && new Date(`${item.logDate}T00:00:00`) >= cutoff)
      .slice().sort((a, b) => String(a.logDate).localeCompare(String(b.logDate)));
    const reports = (data.bloodReports || []).slice().sort((a, b) => String(a.reportDate).localeCompare(String(b.reportDate))).slice(-5);
    const hydration = (data.hydration || []).filter(item => item && item.dateKey && new Date(`${item.dateKey}T00:00:00`) >= cutoff);
    const reminders = (data.reminders || []).filter(item => item && !item.completed)
      .slice().sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt)));
    const warning = assessPatientWarningSigns(data.symptoms || []);
    const blood = interpretBloodReports(data.bloodReports || []);
    const totalFluids = hydration.reduce((sum, item) => sum + (Number(item.amountMl) || 0), 0);

    const lines = [
      "SMART DENGUE — PATIENT SUMMARY",
      `Generated: ${now.toLocaleString()}`,
      "Purpose: Patient-entered information to support a clinician discussion. This is not a diagnosis.",
      "",
      "1) WARNING-SIGN REVIEW"
    ];
    if (warning.hasWarningSigns) {
      lines.push("Warning-sign related information was recorded:");
      warning.signals.forEach(item => lines.push(`- ${item.date || "Date not recorded"}: ${item.labelEn}`));
      lines.push("If any warning sign is present now, seek urgent medical care immediately.");
    } else {
      lines.push("No warning-sign item was found in the recorded symptom selections/notes. This does not rule out dengue warning signs.");
    }
    lines.push("", "2) SYMPTOMS — LAST 7 DAYS");
    if (!symptoms.length) lines.push("- No symptom entries found in the last 7 days.");
    symptoms.forEach(item => {
      const symptomNames = (item.symptoms || []).join(", ") || "No symptoms selected";
      lines.push(`- ${item.logDate}: ${symptomNames}${validNumber(item.temperatureC) ? `; temperature ${item.temperatureC} °C` : ""}${item.notes ? `; note: ${item.notes}` : ""}`);
    });
    lines.push("", "3) BLOOD REPORTS — LATEST ENTRIES");
    if (!reports.length) lines.push("- No blood reports entered.");
    reports.forEach(item => {
      lines.push(`- ${item.reportDate}: Platelets ${validNumber(item.plateletCount) ? item.plateletCount + " ×10⁹/L" : "not entered"}; HCT ${validNumber(item.hematocrit) ? item.hematocrit + "%" : "not entered"}; WBC ${validNumber(item.wbcCount) ? item.wbcCount + " ×10⁹/L" : "not entered"}; Hb ${validNumber(item.hemoglobin) ? item.hemoglobin + " g/dL" : "not entered"}${item.labName ? `; Lab: ${item.labName}` : ""}`);
    });
    lines.push("", "4) RECORDED FLUIDS — LAST 7 DAYS");
    lines.push(`- Total recorded: ${totalFluids.toLocaleString()} mL across ${hydration.length} entries. This is a log, not a prescribed fluid target.`);
    lines.push("", "5) PENDING REMINDERS");
    if (!reminders.length) lines.push("- No pending reminders.");
    reminders.forEach(item => lines.push(`- ${item.title || "Reminder"}: ${item.dueAt || "Date not recorded"}`));
    lines.push("", "6) AUTOMATED TREND NOTES");
    blood.lines.forEach(line => lines.push(`- ${line}`));
    lines.push("", blood.disclaimer);
    lines.push("Bring original laboratory reports and discuss this summary with your treating clinician.");
    return lines.join("\n");
  }

  function getSources() {
    return SOURCES.map(item => ({ ...item }));
  }

  window.DengueClinicalAssistant = Object.freeze({
    detectWarningSigns,
    assessPatientWarningSigns,
    interpretBloodReports,
    buildPatientSummary,
    getSources
  });
})();
