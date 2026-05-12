const TEETH = [
  { n: 11, x: 42.0, y: 23.3 },
  { n: 21, x: 50, y: 23.3 },
  { n: 12, x: 37, y: 25 },
  { n: 22, x: 55.5, y: 24.5 },
  { n: 13, x: 33, y: 27 },
  { n: 23, x: 61.5, y: 26.7 },
  { n: 14, x: 29.0, y: 30.7 },
  { n: 24, x: 64.5, y: 29.5 },
  { n: 15, x: 26.5, y: 33 },
  { n: 25, x: 66.0, y: 32.9 },
  { n: 16, x: 26.3, y: 37.6 },
  { n: 26, x: 68.0, y: 36.6 },
  { n: 17, x: 24.3, y: 41.6 },
  { n: 27, x: 70.0, y: 41.6 },
  { n: 18, x: 23.0, y: 45.6 },
  { n: 28, x: 71.0, y: 45.6 },

  { n: 48, x: 22.0, y: 57.5 },
  { n: 38, x: 71.0, y: 57.0 },
  { n: 47, x: 24.0, y: 62.2 },
  { n: 37, x: 68.5, y: 61.2 },
  { n: 46, x: 27.0, y: 67.0 },
  { n: 36, x: 66.5, y: 66.0 },
  { n: 45, x: 30.0, y: 70.0 },
  { n: 35, x: 64.0, y: 70.0 },
  { n: 44, x: 33.5, y: 72.9 },
  { n: 34, x: 61.0, y: 72.9 },
  { n: 43, x: 37.0, y: 75.5 },
  { n: 33, x: 58.5, y: 75.5 },
  { n: 42, x: 45.5, y: 78.3 },
  { n: 32, x: 55.0, y: 77.3 },
  { n: 41, x: 41.0, y: 77.4 },
  { n: 31, x: 50.4, y: 78.0 },
];

export default function TeethChart({ onToothClick }) {
  return (
    <div
      style={{
        position: "relative",
        width: 400,
        aspectRatio: "760 / 1370",
        userSelect: "none",
      }}
    >
      <img
        src="/teeth.png"
        alt="Dental chart"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {TEETH.map(({ n, x, y }) => (
        <button
          key={n}
          onClick={() => onToothClick(n)}
          title={`Tooth ${n}`}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
            width: 25,
            height: 25,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,150,255,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          aria-label={`Tooth ${n}`}
        />
      ))}
    </div>
  );
}
