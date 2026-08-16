import { useState } from 'react'
import TopBar from './components/TopBar'

function App() {
  const [activeTab, setActiveTab] = useState('Canvas')

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
      }}>
        Canvas coming next...
      </div>
    </div>
  )
}

export default App