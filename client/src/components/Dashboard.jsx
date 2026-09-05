function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '14px 16px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, color: color || 'var(--data)' }}>
        {value}
      </div>
    </div>
  )
}

function Sparkline({ values, color }) {
  if (!values || values.length < 2) {
    return <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Waiting for data...</div>
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 1000
  const h = 160

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 20) - 10
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${h} ${points} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${h}px` }}>
      <polygon points={areaPoints} fill={color || 'var(--data)'} opacity="0.08" />
      <polyline points={points} fill="none" stroke={color || 'var(--data)'} strokeWidth="2" />
    </svg>
  )
}

function Dashboard({ nodes, history, readings }) {
  const sensorNodes = nodes.filter((n) => n.type === 'sensor')

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {sensorNodes.length === 0 && (
        <div style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          No sensor nodes on the canvas yet
        </div>
      )}

      {sensorNodes.map((node) => {
        const values = history[node.id] || []
        const current = readings[node.id]
        const min = values.length ? Math.min(...values) : '—'
        const max = values.length ? Math.max(...values) : '—'

        return (
          <div key={node.id} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
              <StatCard label={`${node.data.label} — current`} value={current !== undefined ? current : '—'} />
              <StatCard label="Session high" value={max} color="var(--signal)" />
              <StatCard label="Session low" value={min} color="var(--logic)" />
              <StatCard label="Points collected" value={values.length} color="var(--ok)" />
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '10px' }}>
                {node.data.label} — live history
              </div>
              <Sparkline values={values} color="var(--data)" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
