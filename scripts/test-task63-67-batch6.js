const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(read("assets/js/dengue-questions.js"), context);
vm.runInContext(read("assets/js/dengue-search.js"), context);

const checks = [];
const check = (label, ok) => checks.push([label, Boolean(ok)]);
const top15 = context.window.getTopDengueMatches("ডেঙ্গুর লক্ষণ কী?", 15);
check("Task 63: preserves existing Top-15 similarity search", top15.length > 0 && top15.length <= 15);
check("Task 63: every ranked result includes transparent match signals",
  top15.length > 0 && top15.every(item => Array.isArray(item.matchSignals) && typeof item.matchType === "string"));
check("Task 63: exact wording is identified separately from semantic matches",
  top15[0]?.matchType === "exact" && top15[0]?.matchSignals.includes("exact"));
check("Task 63: similar-question UI explains why a result matched",
  read("assets/js/script.js").includes("Why it matched:") && read("assets/js/script.js").includes("মিলের কারণ:"));
check("Task 63: similarity notice remains separate from medical accuracy",
  read("assets/js/script.js").includes("not diagnostic or medical accuracy"));

const banglishCases = [
  ["amr platelet komse", "platelets"],
  ["mathay betha", "symptoms"],
  ["shorir batha hocche", "symptoms"],
  ["bomi hocche", "warning"],
  ["shash nite koshto", "warning"],
  ["pet betha", "warning"]
];
let banglishPass = true;
for (const [question, topic] of banglishCases) {
  const matches = context.window.getTopDengueMatches(question, 15);
  const passed = matches.length > 0 && matches[0].topic === topic;
  console.log(`${passed ? "PASS" : "FAIL"} | Banglish search: ${question} -> ${matches[0]?.topic || "no match"}`);
  if (!passed) banglishPass = false;
}
check("Task 64: Banglish spelling variants retrieve relevant topics", banglishPass);
const banglishAnswer = context.getDengueBankAnswer("shash nite koshto");
check("Task 64: Banglish emergency phrasing receives a Bangla answer",
  /[\u0980-\u09FF]/.test(banglishAnswer));
const compare = context.window.compareDengueQuestionSimilarity("platelet komse", "low platelet");
check("Task 64: transliterated platelet phrase shares semantic meaning",
  compare.similarityPercent >= 70 && compare.sharedConcepts.length > 0);
check("Task 64: semantic phrase aliases use consolidated concept groups",
  read("assets/js/dengue-search.js").split("const SEMANTIC_PHRASE_ALIASES = [").length === 2);

const sampleMatch = { question: "ডেঙ্গুতে প্লেটলেট কমে কেন?", topic: "platelets", score: 0.82 };
context.rememberDengueConversationContext("ডেঙ্গুতে প্লেটলেট কমে কেন?", sampleMatch);
const followUp = context.resolveDengueFollowUpQuery("এটা কত হলে বিপদ?");
check("Task 65: contextual follow-up uses the previous dengue question",
  followUp.includes("ডেঙ্গুতে প্লেটলেট কমে কেন?") && followUp.endsWith("এটা কত হলে বিপদ?"));
for (let i = 0; i < 6; i++) {
  context.rememberDengueConversationContext(`ডেঙ্গু বিষয়ে প্রশ্ন ${i + 1}`, {
    question: `ডেঙ্গু বিষয়ে প্রশ্ন ${i + 1}`, topic: "general", score: 0.8
  });
}
check("Task 65: context keeps no more than five recent turns",
  Array.isArray(context.window.dengueConversationTurns) && context.window.dengueConversationTurns.length === 5);
context.window.dengueConversationContext.timestamp = Date.now() - 16 * 60 * 1000;
check("Task 65: context expires after 15 minutes",
  context.resolveDengueFollowUpQuery("এটা কত?") === "এটা কত?");
context.rememberDengueConversationContext("আজ আবহাওয়া কেমন?", null);
check("Task 65: unrelated topics clear dengue context",
  context.window.dengueConversationContext === null && context.window.dengueConversationTurns.length === 0);
context.rememberDengueConversationContext("ডেঙ্গুর লক্ষণ কী?", sampleMatch);
context.window.clearDengueConversationContext();
check("Task 65: user can explicitly reset context without deleting saved chat",
  context.window.dengueConversationContext === null && context.window.dengueConversationTurns.length === 0);
const contextSource = read("assets/js/dengue-questions.js").slice(
  read("assets/js/dengue-questions.js").indexOf("// Task 27 / Task 65:"),
  read("assets/js/dengue-questions.js").indexOf("// Task 26: retrieve the selected bank record")
);
check("Task 65: context manager is memory-only and does not use browser storage or Firestore",
  !contextSource.replace(/\/\/.*$/gm, "").includes("localStorage") &&
  !contextSource.includes("addDoc"));

const html = read("index.html");
const chatbot = read("assets/js/script.js");
check("Task 66: voice input language selector offers auto, Bangla and English",
  html.includes('id="chatbot-voice-language"') && html.includes('value="auto"') && html.includes('value="bn-BD"') && html.includes('value="en-US"'));
check("Task 66: voice recognition honors the selected input language",
  chatbot.includes('getElementById("chatbot-voice-language")') && chatbot.includes("recognition.lang = languageChoice"));
check("Task 66: answer read-aloud is optional and unchecked by default",
  html.includes('id="chatbot-auto-speak"') && !/id="chatbot-auto-speak"[^>]*checked/i.test(html));
check("Task 66: no custom speech API is added and browser-provider audio processing is disclosed",
  chatbot.includes("SpeechRecognition") && chatbot.includes("speechSynthesis") &&
  !/cloud speech|speech api key|text-to-speech api/i.test(chatbot) &&
  html.includes('id="chatbot-voice-privacy-note"') && html.includes("audio may be processed by that provider"));
check("Task 66: speech controls retain manual Listen and Stop actions",
  chatbot.includes("🔊 Listen") && chatbot.includes("⏹ Stop"));

const languageTests = [
  ["amr platelet komse", "bn"],
  ["ami ki khabo", "bn"],
  ["dengu te amar jor", "bn"],
  ["shash nite koshto", "bn"],
  ["What are the symptoms of dengue?", "en"],
  ["ডেঙ্গুর সাধারণ লক্ষণ কী?", "bn"],
  ["I have fever, amar matha betha", "bn"]
];
let languagePass = true;
for (const [value, expected] of languageTests) {
  const details = context.window.detectDengueLanguageDetails(value);
  const passed = details.language === expected && details.confidence >= 0.5;
  console.log(`${passed ? "PASS" : "FAIL"} | Language detection: ${value} -> ${details.language}`);
  if (!passed) languagePass = false;
}
check("Task 67: detects Bangla, Banglish, English and mixed-language input", languagePass);
check("Task 67: exposes a confidence-labelled language hint in the UI",
  html.includes('id="chatbot-language-status"') && chatbot.includes("detectDengueLanguageDetails"));
check("Task 67: chatbot and question-bank language detection share the same detector",
  chatbot.includes("window.detectDengueLanguage(text)") && read("assets/js/dengue-questions.js").includes("window.detectDengueLanguage = detectDengueLanguage"));

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? "PASS" : "FAIL"} | ${label}`));
console.log(`\nTASK 63–67 SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
