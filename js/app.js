"use strict";

window.RaceDayApp = {
  addTranslations() {
    const additions = {
      en: {
        todayEvents: "Today",
        todayLabel: "Today",
        noEventsToday: "There are no events today.",
        liveTiming: "Live Timing",
        championshipChat: "Championship chat",
        buildRoute: "Build route"
      },
      pt: {
        todayEvents: "Hoje",
        todayLabel: "Hoje",
        noEventsToday: "Não existem eventos hoje.",
        liveTiming: "Live Timing",
        championshipChat: "Chat do campeonato",
        buildRoute: "Criar rota"
      },
      ru: {
        todayEvents: "Сегодня",
        todayLabel: "Сегодня",
        noEventsToday: "Сегодня мероприятий нет.",
        liveTiming: "Live Timing",
        championshipChat: "Чат чемпионата",
        buildRoute: "Проложить маршрут"
      }
    };
    Object.entries(additions).forEach(([language, values]) => {
      Object.assign(RaceDayTranslations[language], values);
    });
  },

  applyLanguage() {
    const state = RaceDayState;
    const { t } = RaceDayUtils;
    document.documentElement.lang = state.language === "pt" ? "pt-PT" : state.language;
    document.querySelectorAll("[data-i18n]").forEach(node => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => {
      node.setAttribute("aria-label", t(node.dataset.i18nAria));
    });
    document.querySelectorAll("[data-language]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
    });
    if (state.races.length) {
      RaceDayFilters.populate();
      this.render();
      if (state.activeVenue) RaceDayMap.renderVenue(state.activeVenue);
    }
  },

  indexRaces() {
    const state = RaceDayState;
    state.racesByDate = new Map();
    state.filteredRaces.forEach(race => {
      const key = RaceDayUtils.dateKey(race.startDate);
      if (!state.racesByDate.has(key)) state.racesByDate.set(key, []);
      state.racesByDate.get(key).push(race);
    });
  },

  render() {
    RaceDayToday.render();
    RaceDayCalendar.render();
    RaceDayCalendar.renderSelected();
    RaceDayCalendar.renderUpcoming();
    RaceDayCommunities.render();
  },

  selectDate(date, race = null, scroll = false) {
    const state = RaceDayState;
    state.selectedDate = new Date(date);
    state.viewMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    state.selectedRace = race || (state.racesByDate.get(RaceDayUtils.dateKey(date)) || [])[0] || null;
    this.render();
    if (state.selectedRace?.venue) RaceDayMap.focus(state.selectedRace.venue);
    if (scroll) {
      setTimeout(() => document.querySelector(".selected-event").scrollIntoView({ behavior: "smooth" }), 50);
    }
  },

  visibleByRetention(race) {
    if (RaceDayUtils.eventStatus(race) !== "completed") return true;
    const cutoff = new Date(race.startDate);
    cutoff.setMonth(cutoff.getMonth() + 3);
    return cutoff >= new Date();
  },

  async init() {
    this.addTranslations();
    this.applyLanguage();
    try {
      const [raceRows, venueRows] = await Promise.all([
        RaceDayCsv.load("data/Race_List.csv"),
        RaceDayCsv.load("data/Cartodrom_list.csv")
      ]);
      const venues = RaceDayValidation.unique(
        venueRows.filter(venue => venue.ID && venue.name),
        "ID",
        "venue ID"
      );
      const venuesById = new Map(venues.map(venue => [venue.ID, venue]));
      const races = RaceDayValidation.unique(
        raceRows.filter(race => race.id && race.name && race.date),
        "id",
        "race ID"
      )
        .map(race => {
          race.startDate = RaceDayCsv.parseDate(race.date, race.start_time);
          race.endDate = RaceDayCsv.parseDate(race.date, race.end_time || race.start_time);
          race.venue = venuesById.get(race.kartodrom_id) || null;
          return race;
        })
        .filter(race => RaceDayValidation.race(race));

      Object.assign(RaceDayState, {
        races,
        venues,
        filteredRaces: races.filter(race => this.visibleByRetention(race))
      });
      RaceDayFilters.init();
      RaceDayFilters.populate();
      this.indexRaces();

      const first = [...RaceDayState.filteredRaces]
        .sort((a, b) => a.startDate - b.startDate)
        .find(race => RaceDayUtils.eventStatus(race) === "upcoming") || RaceDayState.filteredRaces[0];
      if (first) {
        RaceDayState.selectedDate = new Date(first.startDate);
        RaceDayState.viewMonth = new Date(first.startDate.getFullYear(), first.startDate.getMonth(), 1);
        RaceDayState.selectedRace = first;
      }

      RaceDayMap.init();
      document.querySelector("#loading-message").hidden = true;
      document.querySelector("#calendar-app").hidden = false;
      document.querySelector("#filter-message").textContent = RaceDayUtils.t("matches", {
        count: RaceDayState.filteredRaces.length
      });
      this.render();
      if (first?.venue) RaceDayMap.focus(first.venue);
    } catch (error) {
      console.error(error);
      document.querySelector("#loading-message").textContent = RaceDayUtils.t("loadError");
    }
  }
};

document.querySelector(".language-switcher").addEventListener("click", event => {
  const button = event.target.closest("[data-language]");
  if (!button) return;
  RaceDayState.language = button.dataset.language;
  localStorage.setItem("raceDayLanguage", RaceDayState.language);
  RaceDayApp.applyLanguage();
});

document.querySelector("#previous-month").onclick = () => {
  RaceDayState.viewMonth = new Date(
    RaceDayState.viewMonth.getFullYear(),
    RaceDayState.viewMonth.getMonth() - 1,
    1
  );
  RaceDayCalendar.render();
};

document.querySelector("#next-month").onclick = () => {
  RaceDayState.viewMonth = new Date(
    RaceDayState.viewMonth.getFullYear(),
    RaceDayState.viewMonth.getMonth() + 1,
    1
  );
  RaceDayCalendar.render();
};

document.querySelector("#today-button").onclick = () => RaceDayApp.selectDate(new Date());
RaceDayApp.init();
