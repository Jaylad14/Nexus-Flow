import { Handle, Position } from 'reactflow'

function FilterNode({ data }) {
  return (
    <div style={{ width: '190px', borderRadius: '12px', background: 'rgba(22,27,36,0.95)', border: '1px solid rgba(167,139,250,0.3)', boxShadow: '0 0 30px rgba(167,139,250,0.08), 0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--logic), transparent)' }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--logic)', marginBottom: '6px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--logic)' }} />
          Filter
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{data.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-faint)', marginBottom: '8px' }}>{data.config || 'window: 10s'}</div>
        <div style={{ padding: '8px', background: 'var(--surface-up)', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)', marginBottom: '3px' }}>Output value</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--logic)' }}>{data.output || '69.4C'}</div>
        </div>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-faint)' }}>Smoothing active</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', padding: '2px 7px', borderRadius: '20px', background: 'var(--logic-dim)', color: 'var(--logic)', border: '1px solid rgba(167,139,250,0.2)' }}>ACTIVE</span>
      </div>
      <Handle type="target" position={Position.Left} style={{ width: '10px', height: '10px', background: 'var(--surface-top)', border: '2px solid var(--logic)', left: '-5px' }} />
      <Handle type="source" position={Position.Right} style={{ width: '10px', height: '10px', background: 'var(--surface-top)', border: '2px solid var(--logic)', right: '-5px' }} />
    </div>
  )
}

export default FilterNode
