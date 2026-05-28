import { useEffect, useMemo, useState } from "react";
import TeethChart from "./TeethChart.jsx";

const CHART_IMAGE_SRC = "/teeth.webp";

const shellStyle = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  width: "100%",
  minHeight: "100vh",
  boxSizing: "border-box",
  padding: 20,
  margin: 0,
  color: "#0f172a",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const panelStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
};

const spinnerStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "3px solid rgba(14, 116, 144, 0.16)",
  borderTopColor: "#0f766e",
  animation: "dental-chart-spin 0.8s linear infinite",
};

let chartImagePromise;

function warmChartImage() {
  if (chartImagePromise) {
    return chartImagePromise;
  }

  chartImagePromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = () => resolve(CHART_IMAGE_SRC);
    image.onerror = () => reject(new Error("Failed to load the dental chart image."));
    image.src = CHART_IMAGE_SRC;
  });

  return chartImagePromise;
}

function postToParent(type, payload = {}) {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }

  window.parent.postMessage(
    {
      type,
      payload: {
        ...payload,
        timestamp: Date.now(),
      },
    },
    "*",
  );
}

export default function App() {
  const [selectedTeeth, setSelectedTeeth] = useState(() => new Set());
  const [bootState, setBootState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    postToParent("DENTAL_CHART_BOOTING");

    warmChartImage()
      .then(() => {
        if (!isActive) {
          return;
        }

        setBootState("ready");

        requestAnimationFrame(() => {
          postToParent("DENTAL_CHART_READY");
        });
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        const message = loadError instanceof Error ? loadError.message : "Unable to load the dental workspace.";

        setError(message);
        setBootState("error");
        postToParent("DENTAL_CHART_ERROR", { message });
      });

    return () => {
      isActive = false;
    };
  }, []);

  const sortedSelectedTeeth = useMemo(() => Array.from(selectedTeeth).sort((a, b) => a - b), [selectedTeeth]);

  const handleToggleTooth = (tooth, nowSelected) => {
    setSelectedTeeth((prev) => {
      const next = new Set(prev);

      if (nowSelected) {
        next.add(tooth);
      } else {
        next.delete(tooth);
      }

      postToParent("SYNC_SELECTED_TEETH", {
        selectedTeeth: Array.from(next).sort((a, b) => a - b),
      });

      return next;
    });
  };

  return (
    <div style={shellStyle}>
      <style>{`
        @keyframes dental-chart-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {bootState !== "ready" ? (
        <div
          style={{
            width: "100%",
            minHeight: "100%",
            display: "grid",
            placeItems: "center",
            padding: 24,
            boxSizing: "border-box",
            textAlign: "center",
            background: "radial-gradient(circle at top, rgba(204, 251, 241, 0.7), rgba(255, 255, 255, 0.98) 52%)",
          }}
        >
          <div>
            {bootState === "loading" ? (
              <>
                <div style={{ ...spinnerStyle, margin: "0 auto 16px" }} />
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Loading dental workspace...</div>
                <div style={{ color: "#475569", fontSize: 14 }}>Preparing the chart so it opens without a blank panel.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Dental workspace unavailable</div>
                <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ padding: 20, overflow: "hidden" }}>
            <TeethChart chartImageSrc={CHART_IMAGE_SRC} selectedTeeth={selectedTeeth} onToggleTooth={handleToggleTooth} />
          </div>
        </div>
      )}
    </div>
  );
}

function SelectedTeeth({ teeth }) {
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Selected Teeth ({teeth.length})</div>
      {teeth.length === 0 ? (
        <div style={{ color: "#64748b", fontSize: 13 }}>None selected yet.</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {teeth.map((toothNumber) => (
            <span
              key={toothNumber}
              style={{
                background: "#fecaca",
                color: "#c63e3e",
                border: "1px solid #fecaca",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              #{toothNumber}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
