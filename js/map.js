"use strict";

window.RaceDayMap = {
  pin(active = false) {
    return L.divIcon({
      className: "race-pin",
      html: `<span class="map-pin${active ? " active" : ""}"></span>`,
      iconSize: [28, 38],
      iconAnchor: [14, 36]
    });
  },

  routeUrl(venue) {
    const latitude = Number(venue?.latitude);
    const longitude = Number(venue?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
  },

  externalButton(label, url) {
    const safeUrl = RaceDayValidation.safeUrl(url);
    if (!safeUrl) return null;
    const link = document.createElement("a");
    link.className = "button button-dark button-compact";
    link.href = safeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  },

  init() {
    const state = RaceDayState;
    state.map = L.map("map", { scrollWheelZoom: false }).setView([39.6, -8], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(state.map);

    const bounds = [];
    state.venues.forEach(venue => {
      const latitude = Number(venue.latitude);
      const longitude = Number(venue.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      const marker = L.marker([latitude, longitude], { icon: this.pin() }).addTo(state.map);
      marker.on("click", () => this.focus(venue, false));
      state.markers.set(venue.ID, marker);
      bounds.push([latitude, longitude]);
    });
    if (bounds.length) state.map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });
  },

  focus(venue, center = true) {
    if (!venue) return;
    const state = RaceDayState;
    if (state.activeVenue && state.markers.has(state.activeVenue.ID)) {
      state.markers.get(state.activeVenue.ID).setIcon(this.pin());
    }
    state.activeVenue = venue;
    const marker = state.markers.get(venue.ID);
    if (marker) {
      marker.setIcon(this.pin(true));
      marker.setZIndexOffset(1000);
      if (center) state.map.setView(marker.getLatLng(), 12);
    }
    this.renderVenue(venue);
  },

  renderVenue(venue) {
    const { t } = RaceDayUtils;
    const panel = document.querySelector("#venue-panel");
    panel.replaceChildren();

    const imageName = RaceDayValidation.safeImageName(venue.image);
    if (imageName) {
      const image = document.createElement("img");
      image.className = "venue-image";
      image.src = `assets/images/kartodroms/${imageName}`;
      image.alt = venue.name;
      image.onerror = () => image.replaceWith(this.placeholder());
      panel.append(image);
    } else {
      panel.append(this.placeholder());
    }

    const title = document.createElement("h3");
    title.textContent = venue.name;
    panel.append(title);

    const details = document.createElement("dl");
    RaceDayEventCard.field(details, t("address"), venue.address);
    RaceDayEventCard.field(details, t("region"), venue.region);
    RaceDayEventCard.field(details, t("hours"), venue[`opening_hours_${RaceDayState.language}`] || venue.opening_hours_en);
    RaceDayEventCard.field(details, t("track"), venue.track_type);
    if (venue.phone) {
      const link = document.createElement("a");
      link.href = `tel:${venue.phone.replace(/[^+\d]/g, "")}`;
      link.textContent = venue.phone;
      this.linkField(details, t("phone"), link);
    }
    const website = RaceDayValidation.safeUrl(venue.website);
    if (website) {
      const link = document.createElement("a");
      link.href = website;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = venue.website;
      this.linkField(details, t("website"), link);
    }
    panel.append(details);

    const actions = document.createElement("div");
    actions.className = "venue-actions";
    const liveTiming = this.externalButton(t("liveTiming"), venue.live_timing);
    if (liveTiming) actions.append(liveTiming);
    const route = this.externalButton(t("buildRoute"), this.routeUrl(venue));
    if (route) actions.append(route);
    if (actions.children.length) panel.append(actions);
  },

  placeholder() {
    const element = document.createElement("div");
    element.className = "track-placeholder";
    element.append(document.createElement("span"));
    return element;
  },

  linkField(list, label, link) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.append(link);
    wrapper.append(term, detail);
    list.append(wrapper);
  }
};
