# Race Day: Today block update

This is an update package for the current modular Race Day repository.

## Replace these existing files

- `index.html`
- `js/app.js`
- `js/event-card.js`
- `js/map.js`
- `css/custom.css`

## Add this new file

- `js/today.js`

Do not replace `data/Race_List.csv` or `data/Cartodrom_list.csv` with files from this package. Keep the current CSV files in the repository.

## Required CSV columns

Add to `Race_List.csv`:

```text
championship_chat
```

Add to `Cartodrom_list.csv`:

```text
live_timing
```

Both columns are optional. Empty values produce no button.

## Changes

- Today's events appear immediately after the hero block.
- If today has no events, a localized message is shown.
- Several events today use one expanded card and compact rows.
- Calendar comes next; filters are below the calendar.
- Hero Calendar button is removed.
- Header height is reduced by about 40%.
- Event cards can show Live Timing, championship chat and route buttons.
- Venue cards can show Live Timing and route buttons.
- Existing approved visual style and yellow accents are retained.
