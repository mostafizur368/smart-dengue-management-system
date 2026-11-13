const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("assets/css/style.css");
const js = read("assets/js/script.js");
const sw = read("service-worker.js");
const checks = [];
const check = (name, condition) => checks.push([name, Boolean(condition)]);

const settingsStart = html.indexOf('<details id="chatbot-settings-panel"');
const settingsEnd = html.indexOf("</details>", settingsStart);
const settings = settingsStart >= 0 && settingsEnd >= 0
  ? html.slice(settingsStart, settingsEnd + "</details>".length)
  : "";

check("Settings panel exists and is collapsed by default",
  settings.includes('id="chatbot-settings-panel"') && !/<details[^>]*\sopen(?:\s|>|=)/i.test(settings));
check("Chat history controls remain inside Settings",
  settings.includes('id="chatbot-save-history"') &&
  settings.includes('id="chatbot-clear-context"') &&
  settings.includes('id="chatbot-clear-history"'));
check("Voice language, auto-speak and privacy notice remain inside Settings",
  settings.includes('id="chatbot-voice-language"') &&
  settings.includes('id="chatbot-auto-speak"') &&
  settings.includes('id="chatbot-voice-privacy-note"'));
check("Language hint and question suggestion feature remain inside Settings",
  settings.includes('id="chatbot-language-status"') &&
  settings.includes('id="open-question-suggestion"') &&
  settings.includes('id="question-suggestion-form"'));
check("Message history and message composer remain outside the collapsible Settings panel",
  html.indexOf('id="chatbot-messages"') < settingsStart &&
  html.indexOf('id="chatbot-form"') > settingsEnd);
check("Voice status remains available after the message composer",
  html.indexOf('id="chatbot-voice-status"') > html.indexOf('id="chatbot-form"'));
check("Starter questions retain all five original prompt buttons",
  (html.match(/data-starter-question=/g) || []).length === 5);
check("Starter questions are hidden after a user message and restored after clearing chat",
  js.includes('starter.hidden = hasUserMessage') &&
  js.includes('starter.style.setProperty("display", "none", "important")') &&
  js.includes("syncChatbotStarterVisibility();"));
check("Chat auto-scroll is deferred until the browser has rendered updated messages",
  js.includes("function scrollChatToLatest()") &&
  js.includes("requestAnimationFrame(() => requestAnimationFrame(scroll))") &&
  js.includes("scrollChatToLatest();"));
check("Chat messages flex to use the available answer area",
  css.includes("#chatbot-messages {\n    flex: 1 1 auto;") &&
  css.includes("min-height: 0;"));
check("Settings summary is compact and expanded settings content has its own scroll",
  css.includes(".chatbot-settings-panel > summary") &&
  css.includes(".chatbot-settings-content") &&
  css.includes("overflow-y: auto;"));
check("Starter prompts wrap instead of creating a horizontal scrollbar",
  css.includes(".chatbot-starter-list {") &&
  css.includes("flex-wrap: wrap;") &&
  css.includes("overflow: visible;"));
check("Voice status does not reserve blank space when empty",
  css.includes("#chatbot-voice-status:empty") &&
  css.includes("display: none;"));
check("Mobile layout keeps the input controls responsive",
  css.includes("@media (max-width: 600px)") &&
  css.includes("width: calc(100vw - 16px)") &&
  css.includes("#chatbot-input {"));
check("PWA cache version is bumped so clients refresh the new chatbot UI",
  sw.includes('const CACHE_NAME = "smart-dengue-shell-v4-chatbot-ui";'));

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
console.log(`\nCHATBOT UI LAYOUT SUMMARY: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
