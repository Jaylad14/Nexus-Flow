import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api'

const typeIcons = { sms: '📱', webhook: '🔗', shutoff: '🛑' }
const typeColors = { sms: 'var(--signal)', webhook: 'var(--data)', shutoff: 'var(--alert)' }

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function AlertsPanel({ lastAlert }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = () => {
    fetch(`${API_URL}/alerts`)
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error('Failed to load alerts:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  // Whenever a new alert fires live, refresh the list so it appears
  // at the top without waiting for a manual refresh
  useEffect(() => {
    if (lastAlert) fetchAlerts()
  }, [lastAlert])

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
        Alert history
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-faint)', marginBottom: '18px' }}>
        Most recent 20 alerts across all action nodes
      </div>

      {loading && <div style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Loading...</div>}

      {!loading && alerts.length === 0 && (
        <div style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          No alerts have fired yet
        </div>
      )}

      {alerts.map((alert) => (
        <div
          key={alert._id}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 14px', borderRadius: '8px',
            border: '1px solid var(--line)', background: 'var(--surface)',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontSize: '18px' }}>{typeIcons[alert.actionType] || '📱'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>
              {alert.nodeLabel} fired
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--ink-faint)', marginTop: '2px' }}>
              value {alert.value} · {timeAgo(alert.createdAt)}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 9px', borderRadius: '20px',
            color: typeColors[alert.actionType] || 'var(--signal)',
            border: `1px solid ${typeColors[alert.actionType] || 'var(--signal)'}`,
            background: 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {alert.actionType}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertsPanel
