function TopBar({ activeTab, onTabChange, onSaveDraft, onDeploy, saveStatus }) {
  const tabs = ['Canvas', 'Dashboard', 'Alerts']

  const statusLabel = {
    idle: null,
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Save failed',
  }[saveStatus]

  return (
    <header style={{
      gridColumn: '1 / -1',
      gridRow: '1',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 18px',
      gap: '20px',
      zIndex: 10,
      height: '52px',
      flexShrink: 0,
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: 'linear-gradient(135deg, #7c3aed, var(--signal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
        }}>⎇</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
          Nexus<span style={{ color: 'var(--signal)' }}>Flow</span>
        </span>
      </div>

      <nav style={{ display: 'flex', gap: '1px', background: 'var(--surface-up)', borderRadius: '7px', padding: '3px', border: '1px solid var(--line)' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '4px 14px', borderRadius: '5px', border: 'none',
              background: activeTab === tab ? 'var(--surface-top)' : 'transparent',
              color: activeTab === tab ? 'var(--ink)' : 'var(--ink-dim)',
              fontFamily: 'var(--font-body)', fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>
        turbine-monitor.rule.json
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {statusLabel && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: saveStatus === 'error' ? 'var(--alert)' : 'var(--ok)',
          }}>
            {statusLabel}
          </span>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ok)',
          padding: '5px 12px', borderRadius: '20px',
          border: '1px solid rgba(74, 222, 128, 0.25)', background: 'var(--ok-dim)',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ok)' }} />
          STREAMING
        </div>

        <button
          onClick={onSaveDraft}
          disabled={saveStatus === 'saving'}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--line-up)', background: 'transparent',
            color: 'var(--ink-dim)', fontFamily: 'var(--font-body)',
            fontSize: '12.5px', fontWeight: 500, cursor: 'pointer',
          }}
        >
          Save draft
        </button>

        <button
          onClick={onDeploy}
          disabled={saveStatus === 'saving'}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--signal)', color: '#0d1117',
            fontFamily: 'var(--font-body)', fontSize: '12.5px',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          ▶ Deploy rule
        </button>

      </div>
    </header>
  )
}

export default TopBar
