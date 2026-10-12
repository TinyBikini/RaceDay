"use strict";
window.RaceDayCommunities = {
  items:[{name:"Karting Gang Porto",description:"porto",language:"Português / English",url:"https://t.me/+PW56GrRmejRiNjNi"},{name:"Катаемся Чатом",description:"chat",language:"Русский",url:"https://t.me/RaceChat_pt"}],
  render(){const {t}=RaceDayUtils,box=document.querySelector("#community-list");box.replaceChildren();this.items.forEach(item=>{const card=document.createElement("article");card.className="community-card";const title=document.createElement("h3");title.textContent=item.name;const p=document.createElement("p");p.textContent=t(item.description);const small=document.createElement("small");small.textContent=`${t("language")}: ${item.language}`;const link=document.createElement("a");link.className="button button-primary button-compact";link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=t("join");card.append(title,p,small,link);box.append(card)})}
};
