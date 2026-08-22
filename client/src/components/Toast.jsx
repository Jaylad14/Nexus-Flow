import { useEffect, useState } from 'react'

function Toast({ alert }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!alert) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  if (!alert) return null

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '260px',
      padding: '14px 16px',
      borderRadius: '10px',
      background: 'rgba(22,27,36,0.95)',
      border: '1px solid rgba(255,122,41,0.4)',
      boxShadow: '0 0 30px rgba(255,122,41,0.15), 0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      zIndex: 20,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'opacity 0.25s, transform 0.25s',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        fontFamily: 'var(--font-display)', fontSize: '13px',
        fontWeight: 600, color: 'var(--signal)', marginBottom: '4px',
      }}>
        ⚠ Rule triggered
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--ink-dim)' }}>
        {alert.sensorId} reached {alert.value}°C (threshold {alert.threshold}°C)
      </div>
    </div>
  )
}

export default Toast
