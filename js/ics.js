"use strict";

window.RaceDayIcs = {
  escape(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\r?\n/g, "\\n");
  },

  date(value) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}00`;
  },

  filename(value) {
    return (value || "race-event")
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "race-event";
  },

  download(race, description) {
    const venue = race.venue || {};
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Race Day//PT//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VTIMEZONE",
      "TZID:Europe/Lisbon",
      "X-LIC-LOCATION:Europe/Lisbon",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0100",
      "TZOFFSETTO:+0000",
      "TZNAME:WET",
      "DTSTART:19701025T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
      "END:STANDARD",
      "BEGIN:DAYLIGHT",
      "TZOFFSETFROM:+0000",
      "TZOFFSETTO:+0100",
      "TZNAME:WEST",
      "DTSTART:19700329T010000",
      "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
      "END:DAYLIGHT",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      `UID:${this.escape(race.id)}@race-day.pt`,
      `DTSTAMP:${this.date(new Date())}Z`,
      `DTSTART;TZID=Europe/Lisbon:${this.date(race.startDate)}`,
      `DTEND;TZID=Europe/Lisbon:${this.date(race.endDate || race.startDate)}`,
      `SUMMARY:${this.escape(race.name)}`,
      `LOCATION:${this.escape([venue.name, venue.address].filter(Boolean).join(", "))}`,
      `DESCRIPTION:${this.escape([description, race.organizer_name].filter(Boolean).join("\n"))}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" })
    );
    link.download = `${this.filename(race.name)}.ics`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
};
