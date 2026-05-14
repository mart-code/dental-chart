import { useMemo, useState } from 'react';
import TeethChart from './TeethChart.jsx';

export default function App() {
  const [actions, setActions] = useState([]);

  const selectedTeeth = useMemo(() => deriveSelected(actions), [actions]);

  const handleToggleTooth = (tooth, nowSelected) => {
    const action = nowSelected ? 'selected' : 'deselected';
    const newAction = {
      id: `local-${Date.now()}`,
      tooth_number: tooth,
      action,
      created_date: new Date().toISOString(),
    };
    setActions((prev) => {
      const updated = [newAction, ...prev];
      const updatedSelectedTeeth = deriveSelected(updated);
      window.parent.postMessage({
        type: "SYNC_SELECTED_TEETH",
        payload: {
          selectedTeeth: Array.from(updatedSelectedTeeth),
          timestamp: Date.now()
        }
      }, "*");
      return updated;
    });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Dental Chart</h1>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TeethChart selectedTeeth={selectedTeeth} onToggleTooth={handleToggleTooth} />

        <div style={{ flex: 1, minWidth: 280 }}>
          <SelectedTeeth selectedTeeth={selectedTeeth} />
        </div>
      </div>
    </div>
  );
}

function deriveSelected(actions) {
  const latest = new Map();
  const sorted = [...actions].sort((a, b) => {
    const ta = a.created_date ? new Date(a.created_date).getTime() : 0;
    const tb = b.created_date ? new Date(b.created_date).getTime() : 0;
    return ta - tb;
  });
  for (const a of sorted) {
    if (Number.isInteger(a.tooth_number)) latest.set(a.tooth_number, a.action);
  }
  const set = new Set();
  for (const [n, action] of latest) {
    if (action === 'selected' || action === 'clicked') set.add(n);
  }
  return set;
}

function SelectedTeeth({ selectedTeeth }) {
  const teeth = Array.from(selectedTeeth).sort((a, b) => a - b);

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        background: '#fff',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>
        Selected Teeth ({teeth.length})
      </div>
      {teeth.length === 0 ? (
        <div style={{ color: '#888', fontSize: 13 }}>None yet.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {teeth.map((n) => (
            <span
              key={n}
              style={{
                background: '#fecaca',
                color: '#b91c1c',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              #{n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
