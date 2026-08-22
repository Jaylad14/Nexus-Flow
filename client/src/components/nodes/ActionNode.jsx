import { Handle, Position } from 'reactflow'

function ActionNode({ data }) {
  const isAlerting = data.alerting

  return (
    <div style={{
      width: '190px',
      borderRadius: '12px',
      background: 'rgba(22,27,36,0.95)',
      border: isAlerting ? '1px solid var(--alert)' : '1px solid rgba(255,122,41,0.35)',
      boxShadow: isAlerting
        ? '0 0 40px rgba(251,113,133,0.35), 0 8px 32px rgba(0,0,0,0.4)'
        : '0 0 30px rgba(255,122,41,0.1), 0 8px 32px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        height: '2px',
        background: isAlerting
          ? 'linear-gradient(90deg, transparent, var(--alert), transparent)'
          : 'linear-gradient(90deg, transparent, var(--signal), transparent)',
      }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: isAlerting ? 'var(--alert)' : 'var(--signal)', marginBottom: '6px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isAlerting ? 'var(--alert)' : 'var(--signal)' }} />
          Action
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{data.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-faint)', marginBottom: '8px' }}>{data.condition || 'if > 80C'}</div>
        <div style={{ padding: '7px 9px', borderRadius: '6px', background: 'var(--surface-up)', border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>{data.target || '+91-98xxx-xxxxx'}</div>
        </div>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>
          {isAlerting ? 'Alert firing now' : '0 alerts today'}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9.5px', padding: '2px 7px', borderRadius: '20px',
          background: isAlerting ? 'rgba(251,113,133,0.15)' : 'var(--signal-dim)',
          color: isAlerting ? 'var(--alert)' : 'var(--signal)',
          border: isAlerting ? '1px solid rgba(251,113,133,0.3)' : '1px solid rgba(255,122,41,0.2)',
        }}>
          {isAlerting ? 'FIRING' : 'ARMED'}
        </span>
      </div>
      <Handle type="target" position={Position.Left} style={{ width: '10px', height: '10px', background: 'var(--surface-top)', border: `2px solid ${isAlerting ? 'var(--alert)' : 'var(--signal)'}`, left: '-5px' }} />
    </div>
  )
}

export default ActionNode
