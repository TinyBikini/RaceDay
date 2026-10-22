"use strict";

window.RaceDayToday = {
  render() {
    const state = RaceDayState;
    const { t, locale, dateKey } = RaceDayUtils;
    const today = new Date();
    const races = state.races.filter(race => dateKey(race.startDate) === dateKey(today));
    const title = document.querySelector("#today-title");
    const list = document.querySelector("#today-event-list");

    title.textContent = new Intl.DateTimeFormat(locale(), {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(today);
    list.replaceChildren();

    if (!races.length) {
      const message = document.createElement("p");
      message.className = "today-empty";
      message.textContent = t("noEventsToday");
      list.append(message);
      return;
    }

    const active = races.find(race => race.id === state.todayRaceId) || races[0];
    state.todayRaceId = active.id;
    list.append(RaceDayEventCard.create(active));

    races
      .filter(race => race.id !== active.id)
      .forEach(race => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "collapsed-race";
        button.textContent = `${new Intl.DateTimeFormat(locale(), {
          day: "2-digit",
          month: "short"
        }).format(race.startDate)}  ${race.name}  +`;
        button.onclick = () => {
          state.todayRaceId = race.id;
          this.render();
          if (race.venue) RaceDayMap.focus(race.venue);
        };
        list.append(button);
      });
  }
};
