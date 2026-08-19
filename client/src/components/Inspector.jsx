const typeColors = {
  sensor: { c: 'var(--data)', icon: 'D', label: 'Sensor node' },
  filter: { c: 'var(--logic)', icon: 'D', label: 'Filter node' },
  action: { c: 'var(--signal)', icon: 'D', label: 'Action node' },
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)', marginBottom: '5px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '6px',
  background: 'var(--surface-up)',
  border: '1px solid var(--line-up)',
  color: 'var(--ink)',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  outline: 'none',
}

function Inspector({ selectedNode }) {
  if (!selectedNode) {
    return (
      <aside style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', textAlign: 'center' }}>
          Select a node on the canvas to edit its settings
        </div>
      </aside>
    )
  }

  const meta = typeColors[selectedNode.type] || typeColors.sensor
  const data = selectedNode.data

  return (
    <aside style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          {data.label}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--ink-faint)', marginTop: '3px' }}>
          {meta.label} - ID: node-{selectedNode.id}
        </div>
      </div>

      <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
        <Field label="Node label">
          <input type="text" defaultValue={data.label} style={inputStyle} />
        </Field>

        {selectedNode.type === 'sensor' && (
          <>
            <Field label="Data source">
              <select style={inputStyle} defaultValue={data.source}>
                <option value="turbine-04.temperature">turbine-04.temperature</option>
                <option value="turbine-04.pressure">turbine-04.pressure</option>
                <option value="turbine-04.rpm">turbine-04.rpm</option>
              </select>
            </Field>
            <Field label="Poll interval">
              <select style={inputStyle}>
                <option>200ms (5,000/sec)</option>
                <option>500ms (2,000/sec)</option>
                <option>1s (1,000/sec)</option>
              </select>
            </Field>
          </>
        )}

        {selectedNode.type === 'filter' && (
          <>
            <Field label="Filter type">
              <select style={inputStyle}>
                <option>Moving average</option>
                <option>Threshold</option>
                <option>Delta</option>
              </select>
            </Field>
            <Field label="Window size">
              <input type="text" defaultValue="10s" style={inputStyle} />
            </Field>
          </>
        )}

        {selectedNode.type === 'action' && (
          <>
            <Field label="Trigger condition">
              <input type="text" defaultValue={data.condition} style={inputStyle} />
            </Field>
            <Field label="Target">
              <input type="text" defaultValue={data.target} style={inputStyle} />
            </Field>
          </>
        )}

        <div style={{ height: '1px', background: 'var(--line)', margin: '16px 0' }} />

        {selectedNode.type === 'sensor' && (
          <div style={{ background: 'var(--surface-up)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)', marginBottom: '8px' }}>
              Live telemetry
            </div>
            {[['Current', data.value || '71.0C'], ['Min (10s)', '68.2C'], ['Max (10s)', '72.4C'], ['Writes/sec', '5,000']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span style={{ color: 'var(--ink-dim)' }}>{k}</span>
                <span style={{ color: 'var(--data)', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Inspector
