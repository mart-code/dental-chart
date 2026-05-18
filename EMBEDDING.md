# Dental Chart Embedding Guide

This repo only contains the embedded chart app. The parent order-flow app is not present here, so the iframe lifecycle fix must be applied in the host app separately.

## What The Host App Must Do

The iframe must mount once when the user opens `New Order`, and then stay alive for the rest of that order session.

Rules:

- Do not change the iframe `key`.
- Do not conditionally unmount the iframe when the user changes category, restoration, notes, or options.
- Do not reassign the iframe `src` after the first mount.
- Hide/show the iframe container with CSS only.
- Keep a loading overlay on top of the iframe until the chart posts `DENTAL_CHART_READY`.

## Parent React Pattern

```tsx
import { useEffect, useRef, useState } from 'react';

const DENTAL_CHART_URL = 'https://your-dental-chart-site.netlify.app';

export function PersistentDentalChartFrame({
  isOrderOpen,
  isChartVisible,
  onSelectedTeethChange,
}: {
  isOrderOpen: boolean;
  isChartVisible: boolean;
  onSelectedTeethChange?: (teeth: number[]) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isOrderOpen) {
      setShouldMount(true);
    }
  }, [isOrderOpen]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== new URL(DENTAL_CHART_URL).origin) {
        return;
      }

      const { type, payload } = event.data ?? {};

      if (type === 'DENTAL_CHART_BOOTING') {
        setIsReady(false);
      }

      if (type === 'DENTAL_CHART_READY') {
        setIsReady(true);
      }

      if (type === 'SYNC_SELECTED_TEETH') {
        onSelectedTeethChange?.(payload?.selectedTeeth ?? []);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectedTeethChange]);

  return (
    <div style={{ position: 'relative', minHeight: 640 }}>
      {shouldMount ? (
        <iframe
          ref={iframeRef}
          src={DENTAL_CHART_URL}
          title="Dental workspace"
          style={{
            width: '100%',
            height: 640,
            border: 0,
            display: isChartVisible ? 'block' : 'none',
          }}
          loading="eager"
        />
      ) : null}

      {!isReady ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(180deg, #f8fafc, #ffffff)',
            pointerEvents: 'none',
          }}
        >
          <div>Loading dental workspace...</div>
        </div>
      ) : null}
    </div>
  );
}
```

## Netlify Recommendations

- Keep this app on a paid Netlify plan or another host that does not cold-start static/edge functions used during boot.
- If the site is fully static, verify the chart does not depend on server-side runtime work during initial load.
- Keep `teeth.png` and built assets cached for one year with `immutable`. This repo now includes `netlify.toml` for that.
- If Netlify still adds unacceptable delay, move the chart to faster static hosting such as Cloudflare Pages or Vercel.
- If you must stay on Netlify and still observe wake-up delay, use an external uptime ping or a scheduled warm-up request.

## Additional Netlify Checks

- Turn on asset compression.
- Avoid redirects or middleware on the chart route.
- Keep the deployed bundle small and static.
- Confirm the final HTML returns quickly in the browser network tab before optimizing React further.
