# Dental Chart

Single-page React app for an embedded dental workspace. It preloads the chart image early, renders a deliberate loading state, and posts lifecycle events back to the parent iframe host.

## Setup

```bash
npm install
npm run dev
```

## Embed Events

When loaded inside an iframe, the app posts these messages to the parent window:

- `DENTAL_CHART_BOOTING`
- `DENTAL_CHART_READY`
- `DENTAL_CHART_ERROR`
- `SYNC_SELECTED_TEETH`

## Files

- [src/App.jsx](src/App.jsx) - boot/loading state and parent iframe messaging
- [src/TeethChart.jsx](src/TeethChart.jsx) - dental chart rendering and selection targets
- [EMBEDDING.md](EMBEDDING.md) - required host-app iframe lifecycle pattern
- [netlify.toml](netlify.toml) - cache headers for Netlify deployment
