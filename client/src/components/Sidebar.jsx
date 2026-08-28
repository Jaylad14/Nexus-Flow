function Sidebar() {
  const sources = [
    { icon: 'T', title: 'Temperature', sub: 'Real-time sensor', type: 'sensor' },
    { icon: 'P', title: 'Pressure', sub: 'Real-time sensor', type: 'sensor' },
    { icon: 'R', title: 'RPM', sub: 'Real-time sensor', type: 'sensor' },
  ]
  const filters = [
    { icon: '~', title: 'Moving average', sub: 'Smooths noise', type: 'filter' },
    { icon: '>', title: 'Threshold', sub: 'Triggers on value', type: 'filter' },
    { icon: 'D', title: 'Delta', sub: 'Rate of change', type: 'filter' },
  ]
  const actions = [
    { icon: 'S', title: 'SMS alert', sub: 'Send text message', type: 'action' },
    { icon: 'W', title: 'Webhook', sub: 'HTTP POST trigger', type: 'action' },
    { icon: 'V', title: 'Shutoff valve', sub: 'Hardware signal', type: 'action' },
  ]

  const colors = { sensor: 'var(--data)', filter: 'var(--logic)', action: 'var(--signal)' }
  const bgs = { sensor: 'var(--data-dim)', filter: 'var(--logic-dim)', action: 'var(--signal-dim)' }

  const Label = ({ text }) => (
    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', padding: '4px 4px 8px' }}>
      {text}
    </span>
  )

  const onDragStart = (event, item) => {
    event.dataTransfer.setData('application/nexusflow-node', JSON.stringify(item))
    event.dataTransfer.effectAllowed = 'move'
  }

  const NodeItem = ({ icon, title, sub, type, ...rest }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, { icon, title, sub, type, ...rest })}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 11px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface-up)', cursor: 'grab', marginBottom: '5px' }}
    >
      <div style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', background: bgs[type], color: colors[type], flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: '10.5px', color: 'var(--ink-faint)', marginTop: '1px' }}>{sub}</div>
      </div>
    </div>
  )

  return (
    <aside style={{ background: 'var(--surface)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 10px', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', borderBottom: '1px solid var(--line)' }}>
        Node library
      </div>
      <div style={{ padding: '12px', overflowY: 'auto', flex: 1 }}>
        <div style={{ marginBottom: '8px' }}>
          <Label text="Data sources" />
          {sources.map(n => <NodeItem key={n.title} {...n} />)}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <Label text="Math operations" />
          {filters.map(n => <NodeItem key={n.title} {...n} />)}
        </div>
        <div>
          <Label text="Action triggers" />
          {actions.map(n => <NodeItem key={n.title} {...n} />)}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
