export function escapeReportHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function normalizeDigits(value) {
  return String(value ?? "").replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit).toString())
    .replace(/[٠-٩]/g, digit => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());
}

function findLabeledValue(text, labelPattern) {
  const lines = normalizeDigits(text).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  for (let index = 0; index < lines.length; index += 1) {
    const combined = `${lines[index]}\n${lines[index + 1] || ""}`.slice(0, 240);
    const label = labelPattern.exec(combined);
    if (!label) continue;
    const afterLabel = combined.slice(label.index + label[0].length);
    const match = afterLabel.match(/(?:^|[^\d])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/);
    if (!match) continue;
    const raw = match[1];
    const value = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(value)) continue;
    const numberEnd = match.index + match[0].length;
    const unit = afterLabel.slice(numberEnd, numberEnd + 50).split(/\r?\n/, 1)[0].trim();
    return { raw, value, unit };
  }
  return null;
}

function normalizeUnit(unit) {
  return String(unit || "").toLowerCase().replace(/[μµ]/g, "u").replace(/\s+/g, "");
}

function convertCountValue(field, parsed) {
  if (!parsed) return null;
  let value = parsed.value;
  let note = "";
  const unit = normalizeUnit(parsed.unit);
  const perMicroliter = /(?:\/|per)(?:ul|mm3|mm³|cmm|microliter|microlitre)/.test(unit)
    || /cells\/?(?:ul|mm3|cmm)/.test(unit);
  const alreadyThousands = /10\^?3|10³|thousand/.test(unit);
  const perLiter = /10\^?9|10⁹|\/l(?:itre)?/.test(unit);

  if ((field === "plateletCount" || field === "wbcCount") && value > 2000) {
    if (perMicroliter && !alreadyThousands && !perLiter) {
      value = value / 1000;
      note = "Converted from cells per microlitre to ×10⁹/L; verify the printed unit.";
    } else {
      return {
        value: null,
        raw: parsed.raw,
        unit: parsed.unit,
        warning: `${field === "plateletCount" ? "Platelet" : "WBC"} value ${parsed.raw} is ambiguous without a clear unit. It was not inserted.`
      };
    }
  }

  const bounds = {
    plateletCount: [0, 2000],
    hematocrit: [0, 80],
    wbcCount: [0, 100],
    hemoglobin: [0, 30]
  }[field];
  if (!bounds || value < bounds[0] || value > bounds[1]) {
    return { value: null, raw: parsed.raw, unit: parsed.unit, warning: `${field} OCR value is outside the input field's supported range and was not inserted.` };
  }
  return { value: String(Number(value.toFixed(3))), raw: parsed.raw, unit: parsed.unit, note };
}

export function extractLabValuesFromOcr(text) {
  const definitions = [
    ["plateletCount", /(?:platelets?|plt\b|platelet\s+count|প্লেটলেট|প্লাটিলেট|অণুচক্রিকা)/i],
    ["hematocrit", /(?:hematocrit|haematocrit|\bhct\b|হেমাটোক্রিট)/i],
    ["wbcCount", /(?:\bwbc\b|white\s+blood\s+cells?|total\s+leucocyte\s+count|\btlc\b|শ্বেত\s+রক্তকণিকা)/i],
    ["hemoglobin", /(?:hemoglobin|haemoglobin|\bhgb\b|\bhb\b|হিমোগ্লোবিন)/i]
  ];
  const suggestions = {};
  const warnings = [];
  definitions.forEach(([field, label]) => {
    const parsed = findLabeledValue(text, label);
    if (!parsed) return;
    const converted = convertCountValue(field, parsed);
    if (converted?.value !== null && converted?.value !== undefined) {
      suggestions[field] = converted;
    } else if (converted?.warning) {
      warnings.push(converted.warning);
    }
  });
  if (!Object.keys(suggestions).length && !warnings.length) {
    warnings.push("No supported lab values were confidently identified. Enter values manually from the original report.");
  }
  return { suggestions, warnings, count: Object.keys(suggestions).length };
}

function toIsoDate(value) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value && typeof value.toDate === "function") return value.toDate().toISOString().slice(0, 10);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function buildRecoveryTimeline({ symptoms = [], reports = [], hydration = [] } = {}) {
  const events = [];
  symptoms.forEach(item => events.push({
    date: toIsoDate(item.logDate),
    timestamp: item.logDate ? new Date(`${toIsoDate(item.logDate)}T12:00:00`).getTime() : 0,
    kind: "Symptom log",
    detail: [
      (item.symptoms || []).join(", ") || "No symptoms selected",
      item.temperatureC !== null && item.temperatureC !== undefined ? `Temperature ${item.temperatureC} °C` : ""
    ].filter(Boolean).join(" · ")
  }));
  reports.forEach(item => events.push({
    date: toIsoDate(item.reportDate),
    timestamp: item.reportDate ? new Date(`${toIsoDate(item.reportDate)}T12:00:00`).getTime() : 0,
    kind: "Blood report",
    detail: [
      item.plateletCount !== null && item.plateletCount !== undefined ? `Platelets ${item.plateletCount} ×10⁹/L` : "",
      item.hematocrit !== null && item.hematocrit !== undefined ? `HCT ${item.hematocrit}%` : "",
      item.wbcCount !== null && item.wbcCount !== undefined ? `WBC ${item.wbcCount} ×10⁹/L` : "",
      item.hemoglobin !== null && item.hemoglobin !== undefined ? `Hb ${item.hemoglobin} g/dL` : ""
    ].filter(Boolean).join(" · ") || "Report saved"
  }));
  hydration.forEach(item => events.push({
    date: toIsoDate(item.dateKey || item.loggedAt),
    timestamp: item.dateKey ? new Date(`${toIsoDate(item.dateKey)}T12:00:00`).getTime() : Date.parse(item.loggedAt || "") || 0,
    kind: "Fluid log",
    detail: `${Number(item.amountMl) || 0} mL · ${String(item.fluidType || "other").replace(/-/g, " ")}`
  }));
  return events.filter(item => item.date).sort((a, b) => b.timestamp - a.timestamp || a.kind.localeCompare(b.kind));
}

export function buildPatientReportHtml({ patientLabel = "Signed-in patient", generatedAt = new Date().toISOString(), history = null, symptoms = [], reports = [], hydration = [], medications = [] } = {}) {
  const esc = escapeReportHtml;
  const historyRows = [
    ["Known conditions", history?.conditions],
    ["Allergies", history?.allergies],
    ["Other medical history", history?.notes],
    ["Emergency contact", history?.emergencyContact]
  ].filter(([, value]) => String(value || "").trim());
  const historyHtml = historyRows.length
    ? `<dl>${historyRows.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}</dl>`
    : "<p>No medical history details entered.</p>";

  const reportRows = [...reports].sort((a, b) => String(a.reportDate).localeCompare(String(b.reportDate))).map(item =>
    `<tr><td>${esc(item.reportDate)}</td><td>${esc(item.plateletCount ?? "—")}</td><td>${esc(item.hematocrit ?? "—")}</td><td>${esc(item.wbcCount ?? "—")}</td><td>${esc(item.hemoglobin ?? "—")}</td><td>${esc(item.labName || "—")}</td></tr>`
  ).join("");

  const symptomRows = [...symptoms].sort((a, b) => String(a.logDate).localeCompare(String(b.logDate))).slice(-50).map(item =>
    `<tr><td>${esc(item.logDate)}</td><td>${esc((item.symptoms || []).join(", ") || "—")}</td><td>${esc(item.temperatureC ?? "—")}</td><td>${esc(item.notes || "—")}</td></tr>`
  ).join("");

  const hydrationRows = [...hydration].sort((a, b) => String(a.dateKey).localeCompare(String(b.dateKey))).slice(-100).map(item =>
    `<tr><td>${esc(item.dateKey || item.loggedAt || "—")}</td><td>${esc(item.fluidType || "—")}</td><td>${esc(item.amountMl ?? "—")}</td><td>${esc(item.note || "—")}</td></tr>`
  ).join("");

  const medicationRows = medications.filter(item => item.active !== false).map(item =>
    `<tr><td>${esc(item.name)}</td><td>${esc(item.dose)}</td><td>${esc(item.schedule)}</td><td>${esc(item.nextReminderAt || "—")}</td></tr>`
  ).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Smart Dengue — Patient Health Report</title>
<style>
  body{font:14px/1.5 Arial,sans-serif;color:#17313a;margin:28px auto;padding:0 18px;max-width:980px}
  h1,h2{color:#075e56}h1{font-size:24px}h2{font-size:17px;margin-top:26px;border-bottom:1px solid #dce8e8;padding-bottom:6px}
  table{border-collapse:collapse;width:100%;font-size:12px;margin-top:10px}th,td{border:1px solid #ccd8d8;padding:7px;text-align:left;vertical-align:top}
  th{background:#edf5f5}dl{display:grid;grid-template-columns:190px 1fr;gap:7px}dt{font-weight:bold}dd{margin:0;white-space:pre-wrap}
  .note{border:1px solid #ead39e;background:#fff8e8;padding:12px;border-radius:8px;margin-top:24px;font-size:12px}
  .toolbar{margin:18px 0}@media print{.toolbar{display:none}body{margin:0;max-width:none}}
</style></head><body>
<div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button></div>
<h1>Smart Dengue Management System — Patient Health Report</h1>
<p><strong>Patient:</strong> ${esc(patientLabel)}<br><strong>Generated:</strong> ${esc(new Date(generatedAt).toLocaleString())}</p>
<h2>Medical history</h2>${historyHtml}
<h2>Blood reports</h2><table><thead><tr><th>Date</th><th>Platelets (×10⁹/L)</th><th>HCT (%)</th><th>WBC (×10⁹/L)</th><th>Hb (g/dL)</th><th>Laboratory</th></tr></thead><tbody>${reportRows || "<tr><td colspan='6'>No blood reports entered.</td></tr>"}</tbody></table>
<h2>Symptom history (latest 50 entries)</h2><table><thead><tr><th>Date</th><th>Symptoms</th><th>Temperature (°C)</th><th>Notes</th></tr></thead><tbody>${symptomRows || "<tr><td colspan='4'>No symptom entries.</td></tr>"}</tbody></table>
<h2>Fluid records (latest 100 entries)</h2><table><thead><tr><th>Date</th><th>Type</th><th>Amount (mL)</th><th>Note</th></tr></thead><tbody>${hydrationRows || "<tr><td colspan='4'>No fluid entries.</td></tr>"}</tbody></table>
<h2>Active medication reminders</h2><table><thead><tr><th>Medicine</th><th>Prescribed instruction</th><th>Schedule</th><th>Next reminder</th></tr></thead><tbody>${medicationRows || "<tr><td colspan='4'>No active medication reminders.</td></tr>"}</tbody></table>
<p class="note"><strong>Important:</strong> This report is generated from information entered by the patient. It is not a diagnosis, prescription, treatment plan, or confirmation that any result is normal. OCR suggestions must be checked against the original laboratory report. Bring original reports and consult a qualified clinician. For urgent warning signs, seek emergency care rather than waiting for this report.</p>
</body></html>`;
}
