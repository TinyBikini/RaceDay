"use strict";
window.RaceDayEventCard = {
  descriptions: {"2 Mangas + Finais":{en:"2 Heats + Finals",pt:"2 Mangas + Finais",ru:"2 заезда + финалы"},"Endurance Race 2x2 horas":{en:"Endurance race: 2 × 2 hours",pt:"Endurance Race 2x2 horas",ru:"Гонка на выносливость: 2 × 2 часа"}},
  description(value) { if (!value) return ""; return this.descriptions[value]?.[RaceDayState.language] || value; },
  field(list, label, value) { if (value === undefined || value === null || String(value).trim() === "") return; const wrap=document.createElement("div"), term=document.createElement("dt"), detail=document.createElement("dd"); term.textContent=label; detail.textContent=value; wrap.append(term,detail); list.append(wrap); },
  create(race) {
    const {t, locale, eventStatus} = RaceDayUtils; const article=document.createElement("article"); article.className=`event-card ${eventStatus(race)}`;
    const poster=RaceDayValidation.safeImageName(race.poster_image); if(poster){const img=document.createElement("img");img.className="poster";img.src=`assets/images/race-posters/${poster}`;img.alt=t("posterAlt",{name:race.name});img.loading="lazy";img.onerror=()=>img.remove();article.append(img)}
    const body=document.createElement("div");body.className="event-card-body";const heading=document.createElement("div");heading.className="card-heading";const title=document.createElement("h4");title.textContent=race.name;const badge=document.createElement("span");badge.className="race-badge";badge.textContent=t(eventStatus(race));heading.append(title,badge);body.append(heading);
    const list=document.createElement("dl");this.field(list,t("time"),[race.start_time,race.end_time].filter(Boolean).join("–"));this.field(list,t("venue"),race.venue?.name);this.field(list,t("type"),race.race_type);const price=Number(race.price_eur);this.field(list,t("price"),race.price_eur&&Number.isFinite(price)?new Intl.NumberFormat(locale(),{style:"currency",currency:"EUR"}).format(price):"");this.field(list,t("age"),race.age_group);this.field(list,t("model"),race.kart_model);this.field(list,t("weight"),race.minimal_weight?`${race.minimal_weight} kg`:"");this.field(list,t("organizer"),race.organizer_name);this.field(list,t("description"),this.description(race.description));body.append(list);
    const button=document.createElement("button");button.className="button button-primary button-compact";button.textContent=t("add");button.onclick=()=>RaceDayIcs.download(race,this.description(race.description));body.append(button);article.append(body);return article;
  }
};
