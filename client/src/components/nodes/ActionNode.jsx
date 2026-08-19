import { Handle, Position } from 'reactflow'

function ActionNode({ data }) {
  return (
    <div style={{ width: '190px', borderRadius: '12px', background: 'rgba(22,27,36,0.95)', border: '1px solid rgba(255,122,41,0.35)', boxShadow: '0 0 30px rgba(255,122,41,0.1), 0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--signal), transparent)' }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--signal)', marginBottom: '6px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--signal)' }} />
          Action
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{data.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-faint)', marginBottom: '8px' }}>{data.condition || 'if > 80C'}</div>
        <div style={{ padding: '7px 9px', borderRadius: '6px', background: 'var(--surface-up)', border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>{data.target || '+91-98xxx-xxxxx'}</div>
        </div>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>0 alerts today</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', padding: '2px 7px', borderRadius: '20px', background: 'var(--signal-dim)', color: 'var(--signal)', border: '1px solid rgba(255,122,41,0.2)' }}>ARMED</span>
      </div>
      <Handle type="target" position={Position.Left} style={{ width: '10px', height: '10px', background: 'var(--surface-top)', border: '2px solid var(--signal)', left: '-5px' }} />
    </div>
  )
}

export default ActionNode
