"use strict";

window.RaceDayEventCard = {
  descriptions: {
    "2 Mangas + Finais": {
      en: "2 Heats + Finals",
      pt: "2 Mangas + Finais",
      ru: "2 заезда + финалы"
    },
    "Endurance Race 2x2 horas": {
      en: "Endurance race: 2 × 2 hours",
      pt: "Endurance Race 2x2 horas",
      ru: "Гонка на выносливость: 2 × 2 часа"
    }
  },

  description(value) {
    if (!value) return "";
    return this.descriptions[value]?.[RaceDayState.language] || value;
  },

  field(list, label, value) {
    if (value === undefined || value === null || String(value).trim() === "") return;
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    wrapper.append(term, detail);
    list.append(wrapper);
  },

  externalButton(label, url, className = "button button-dark button-compact") {
    const safeUrl = RaceDayValidation.safeUrl(url);
    if (!safeUrl) return null;
    const link = document.createElement("a");
    link.className = className;
    link.href = safeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  },

  routeUrl(venue) {
    const latitude = Number(venue?.latitude);
    const longitude = Number(venue?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
  },

  create(race) {
    const { t, locale, eventStatus } = RaceDayUtils;
    const article = document.createElement("article");
    article.className = `event-card ${eventStatus(race)}`;

    const poster = RaceDayValidation.safeImageName(race.poster_image);
    if (poster) {
      const image = document.createElement("img");
      image.className = "poster";
      image.src = `assets/images/race-posters/${poster}`;
      image.alt = t("posterAlt", { name: race.name });
      image.loading = "lazy";
      image.onerror = () => image.remove();
      article.append(image);
    }

    const body = document.createElement("div");
    body.className = "event-card-body";

    const heading = document.createElement("div");
    heading.className = "card-heading";
    const title = document.createElement("h4");
    title.textContent = race.name;
    const badge = document.createElement("span");
    badge.className = "race-badge";
    badge.textContent = t(eventStatus(race));
    heading.append(title, badge);
    body.append(heading);

    const details = document.createElement("dl");
    this.field(details, t("time"), [race.start_time, race.end_time].filter(Boolean).join("–"));
    this.field(details, t("venue"), race.venue?.name);
    this.field(details, t("type"), race.race_type);
    const price = Number(race.price_eur);
    this.field(details, t("price"), race.price_eur && Number.isFinite(price)
      ? new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR" }).format(price)
      : "");
    this.field(details, t("age"), race.age_group);
    this.field(details, t("model"), race.kart_model);
    this.field(details, t("weight"), race.minimal_weight ? `${race.minimal_weight} kg` : "");
    this.field(details, t("organizer"), race.organizer_name);
    this.field(details, t("description"), this.description(race.description));
    body.append(details);

    const actions = document.createElement("div");
    actions.className = "event-actions";

    const calendarButton = document.createElement("button");
    calendarButton.type = "button";
    calendarButton.className = "button button-primary button-compact";
    calendarButton.textContent = t("add");
    calendarButton.onclick = () => RaceDayIcs.download(race, this.description(race.description));
    actions.append(calendarButton);

    const liveTimingButton = this.externalButton(t("liveTiming"), race.venue?.live_timing);
    if (liveTimingButton) actions.append(liveTimingButton);

    const chatButton = this.externalButton(t("championshipChat"), race.championship_chat);
    if (chatButton) actions.append(chatButton);

    const routeButton = this.externalButton(t("buildRoute"), this.routeUrl(race.venue));
    if (routeButton) actions.append(routeButton);

    body.append(actions);
    article.append(body);
    return article;
  }
};
