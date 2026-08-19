import { Handle, Position } from 'reactflow'

function SensorNode({ data }) {
  return (
    <div style={{ width: '190px', borderRadius: '12px', background: 'rgba(22,27,36,0.95)', border: '1px solid rgba(34,211,238,0.3)', boxShadow: '0 0 30px rgba(34,211,238,0.08), 0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--data), transparent)' }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--data)', marginBottom: '6px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--data)' }} />
          Sensor
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{data.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 500, color: 'var(--data)', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>{data.value || '71C'}</div>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>5,000 pts/sec</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', padding: '2px 7px', borderRadius: '20px', background: 'var(--data-dim)', color: 'var(--data)', border: '1px solid rgba(34,211,238,0.2)' }}>LIVE</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ width: '10px', height: '10px', background: 'var(--surface-top)', border: '2px solid var(--data)', right: '-5px' }} />
    </div>
  )
}

export default SensorNode
