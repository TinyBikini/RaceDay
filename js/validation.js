"use strict";
window.RaceDayValidation = {
  unique(rows, key, label) {
    const seen = new Set();
    return rows.filter((row, index) => {
      const id = String(row[key] || "").trim();
      if (!id) return false;
      if (seen.has(id)) { console.warn(`Duplicate ${label}: ${id}, row ${index + 2}`); return false; }
      seen.add(id); return true;
    });
  },
  race(race) {
    const price = String(race.price_eur || "").trim();
    const weight = String(race.minimal_weight || "").trim();
    if (price && (!Number.isFinite(Number(price)) || Number(price) < 0)) return false;
    if (weight && (!Number.isFinite(Number(weight)) || Number(weight) < 0)) return false;
    if (race.startDate && race.endDate && race.endDate < race.startDate) return false;
    return Boolean(race.startDate);
  },
  safeImageName(value) { const name = String(value || "").trim(); return /^[\w.-]+\.(webp|png|jpe?g)$/i.test(name) ? name : null; },
  safeUrl(value) {
    if (!value) return null;
    try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return ["http:", "https:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  }
};
