import { useState } from 'react'
import { overrideTemperature } from '../utils/api'

const typeColors = {
  sensor: { c: 'var(--data)', label: 'Sensor node' },
  filter: { c: 'var(--logic)', label: 'Filter node' },
  action: { c: 'var(--signal)', label: 'Action node' },
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
  const [overrideValue, setOverrideValue] = useState('')
  const [overrideStatus, setOverrideStatus] = useState('idle')

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

  const handleOverride = async () => {
    if (!overrideValue || isNaN(Number(overrideValue))) return
    setOverrideStatus('sending')
    try {
      await overrideTemperature(Number(overrideValue))
      setOverrideStatus('sent')
      setTimeout(() => setOverrideStatus('idle'), 1500)
    } catch {
      setOverrideStatus('error')
      setTimeout(() => setOverrideStatus('idle'), 2000)
    }
  }

  return (
    <aside style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          {data.label}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--ink-faint)', marginTop: '3px' }}>
          {meta.label} · ID: node-{selectedNode.id}
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
              </select>
            </Field>

            <div style={{ background: 'var(--surface-up)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)', marginBottom: '8px' }}>
                Manual override
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={handleOverride}
                  disabled={overrideStatus === 'sending'}
                  style={{
                    padding: '7px 14px', borderRadius: '6px', border: 'none',
                    background: 'var(--signal)', color: '#0d1117',
                    fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Set
                </button>
              </div>
              {overrideStatus === 'sent' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--ok)', marginTop: '6px' }}>
                  Applied — updates within 1s
                </div>
              )}
            </div>

            <div style={{ background: 'var(--surface-up)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)', marginBottom: '8px' }}>
                Live telemetry
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span style={{ color: 'var(--ink-dim)' }}>Current</span>
                <span style={{ color: 'var(--data)', fontWeight: 500 }}>{data.value || '—'}</span>
              </div>
            </div>
          </>
        )}

        {selectedNode.type === 'filter' && (
          <Field label="Window size">
            <input type="text" defaultValue="10s" style={inputStyle} />
          </Field>
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
      </div>
    </aside>
  )
}

export default Inspector
