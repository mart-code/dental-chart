# Dental Chart

Single-page React app: click a tooth on the dental diagram, the action is recorded to a Base44 `ToothAction` entity, and the log is rendered next to the chart.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_BASE44_APP_ID
npm run dev
```

## Base44 entity

Create a `ToothAction` entity in your Base44 app using the schema in `entities/ToothAction.json`:

| field | type | notes |
|---|---|---|
| `tooth_number` | number | FDI: 11-18, 21-28, 31-38, 41-48 |
| `action` | string | defaults to `"clicked"` |

`id` and `created_date` are provided by Base44 automatically.

## Files

- [src/App.jsx](src/App.jsx) — page, loads list and creates new actions on click
- [src/TeethChart.jsx](src/TeethChart.jsx) — SVG dental chart (FDI numbering)
- [src/base44Client.js](src/base44Client.js) — Base44 SDK client + `ToothAction` entity
