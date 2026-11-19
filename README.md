# Knull Calendar

A dependency-free calendar inspired by a dark year-at-a-glance planning canvas.

## Run

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. Deploy the contents of `dist/` to any static web host.

## Features

- Complete ISO week-year overview grouped into four quarters
- Four-part monthly planning, seven-day weekly boards, and 24-hour day schedules
- Daily tasks, weekly intentions, monthly goals, and custom color-coded projects
- Search (Ctrl/Cmd K), quick creation (N), completion tracking, and JSON backup export
- Responsive layouts and keyboard-accessible controls

Data is saved in browser localStorage under `tempo-v1`, preserving existing Tempo plans. No server, account sync, or calendar integration is included. Export backups before clearing browser storage. New installations include editable sample plans.

## Check

```sh
node --check dist/app.js
node --test tests/calendar.test.cjs
```
