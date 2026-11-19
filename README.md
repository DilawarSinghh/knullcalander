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

Data is saved in browser localStorage under `tempo-v1`, preserving existing Tempo plans. No server, account sync, or calendar integration is included. Export backups before clearing browser storage. New installations start with an empty calendar.

## Check

```sh
node --check dist/app.js
node --test tests/calendar.test.cjs
```

## Everyday use and recovery

New users start with an empty calendar and first-plan guidance. Existing local calendars are preserved. Plans support notes; All plans lists every saved date. Deleted plans move to Recently deleted (last 50), available under Backups. Backup import validates projects, dates, times, and references before merging; existing plan IDs are skipped. File imports are limited to 5 MB. Invalid saved data is not silently overwritten, and a persistent warning appears when storage is unavailable.

This remains a device-local planner, not a multi-user cloud service: no accounts, synchronization, shared projects, or background reminders. The hosted version retains its existing private access setting. Browser visual QA remains necessary before a wider release.
