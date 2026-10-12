# Race Day: readable source version

This version has the same functional architecture but is reorganized for learning and maintenance.

## JavaScript modules

- `app.js`: starts the application and coordinates modules.
- `state.js`: central application state and shared helpers.
- `csv-loader.js`: downloads and parses CSV files.
- `validation.js`: validates IDs, numbers, image names and URLs.
- `calendar.js`: renders the calendar, selected event and upcoming list.
- `event-card.js`: creates event cards and translates known descriptions.
- `filters.js`: builds and applies filters.
- `map.js`: creates the Leaflet map, markers and venue card.
- `ics.js`: creates downloadable calendar files.
- `translations.js`: EN, PT-PT and RU interface text.
- `communities.js`: Telegram community data and cards.

## Styles

- `styles.css`: approved base design.
- `custom.css`: yellow accents. Edit or remove this file without touching the base design.

## Logo and favicon

- Temporary logo: `assets/images/race-day-logo.png`.
- Favicon: `assets/icons/favicon.png`.
- Replace either file while keeping its filename to update the visual without editing HTML.

## Run locally

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`. Because a favicon is included, the previous `/favicon.ico` 404 no longer occurs.

## Images

- Race posters: `assets/images/race-posters/`; filename in `Race_List.csv` column `poster_image`.
- Venue images: `assets/images/kartodroms/`; filename in `Cartodrom_list.csv` column `image`.

## GitHub Pages

Upload the contents of this folder to a repository, then enable Pages from the default branch and root folder.
