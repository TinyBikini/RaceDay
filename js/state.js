"use strict";

window.RaceDayState = {
  language: ["en", "pt", "ru"].includes(localStorage.getItem("raceDayLanguage"))
    ? localStorage.getItem("raceDayLanguage")
    : "en",
  races: [], venues: [], filteredRaces: [], racesByDate: new Map(),
  filters: { region: "", venue: "", type: "", age: "" },
  viewMonth: new Date(), selectedDate: new Date(), selectedRace: null,
  map: null, markers: new Map(), activeVenue: null
};

window.RaceDayUtils = {
  t(key, values = {}) {
    const state = window.RaceDayState;
    let text = window.RaceDayTranslations[state.language][key] || window.RaceDayTranslations.en[key] || key;
    Object.entries(values).forEach(([name, value]) => { text = text.replace(`{${name}}`, value); });
    return text;
  },
  locale() { return window.RaceDayTranslations[window.RaceDayState.language].locale; },
  dateKey(date) { return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; },
  eventStatus(race) {
    if (["cancelled", "canceled"].includes(String(race.status).toLowerCase())) return "cancelled";
    return (race.endDate || race.startDate) < new Date() ? "completed" : "upcoming";
  }
};
