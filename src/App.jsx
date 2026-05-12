import { useEffect, useMemo, useState } from 'react';
import TeethChart from './TeethChart.jsx';
import { ToothAction } from './base44Client.js';

export default function App() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ToothAction.list('-created_date', 200)
      .then((rows) => setActions(rows || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedTeeth = useMemo(() => deriveSelected(actions), [actions]);

  const handleToggleTooth = async (tooth, nowSelected) => {
    const action = nowSelected ? 'selected' : 'deselected';
    const optimistic = {
      id: `tmp-${Date.now()}`,
      tooth_number: tooth,
      action,
      created_date: new Date().toISOString(),
    };
    setActions((prev) => [optimistic, ...prev]);
    try {
      const saved = await ToothAction.create({ tooth_number: tooth, action });
      setActions((prev) => prev.map((a) => (a.id === optimistic.id ? saved : a)));
    } catch (e) {
      setError(e.message);
      setActions((prev) => prev.filter((a) => a.id !== optimistic.id));
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Dental Chart</h1>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TeethChart selectedTeeth={selectedTeeth} onToggleTooth={handleToggleTooth} />

        <div style={{ flex: 1, minWidth: 280 }}>
          <SelectedTeeth selectedTeeth={selectedTeeth} />

          <h2 style={{ marginTop: 0 }}>Actions</h2>
          {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : actions.length === 0 ? (
            <div style={{ color: '#666' }}>No actions yet. Click a tooth.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {actions.map((a) => (
                <li
                  key={a.id}
                  style={{
                    padding: '6px 0',
                    borderBottom: '1px solid #eee',
                    fontSize: 14,
                  }}
                >
                  <strong>{a.tooth_number}</strong> was {a.action}
                  <span style={{ color: '#888', marginLeft: 8 }}>
                    {a.created_date
                      ? new Date(a.created_date).toLocaleString()
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
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
