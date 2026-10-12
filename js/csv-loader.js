"use strict";

window.RaceDayCsv = {
  clean(value) { return String(value || "").replace(/^\uFEFF/, "").trim(); },
  parseDate(dateText, timeText = "00:00") {
    const dateMatch = /^(\d{2})-(\d{2})-(\d{2}|\d{4})$/.exec(dateText || "");
    const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeText || "");
    if (!dateMatch || !timeMatch) return null;
    let year = Number(dateMatch[3]);
    if (year < 100) year += 2000;
    const date = new Date(year, Number(dateMatch[2]) - 1, Number(dateMatch[1]), Number(timeMatch[1]), Number(timeMatch[2]));
    return date.getFullYear() === year && date.getMonth() === Number(dateMatch[2]) - 1 && date.getDate() === Number(dateMatch[1]) ? date : null;
  },
  load(path) {
    return new Promise((resolve, reject) => Papa.parse(path, {
      download: true, header: true, skipEmptyLines: "greedy", transformHeader: this.clean,
      complete: result => resolve(result.data.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [this.clean(key), typeof value === "string" ? value.trim() : value])))),
      error: reject
    }));
  }
};
