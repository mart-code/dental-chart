import React, { useEffect, useState } from 'react';
import TeethChart from './TeethChart.jsx';
import { ToothAction } from './base44Client.js';

export default function App() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ToothAction.list('-created_date', 100)
      .then((rows) => setActions(rows || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToothClick = async (tooth) => {
    const optimistic = {
      id: `tmp-${Date.now()}`,
      tooth_number: tooth,
      action: 'clicked',
      created_date: new Date().toISOString(),
    };
    setActions((prev) => [optimistic, ...prev]);
    try {
      const saved = await ToothAction.create({
        tooth_number: tooth,
        action: 'clicked',
      });
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
        <TeethChart onToothClick={handleToothClick} />

        <div style={{ flex: 1, minWidth: 280 }}>
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
