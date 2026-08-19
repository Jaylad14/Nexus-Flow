import { useState } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'

function App() {
  const [activeTab, setActiveTab] = useState('Canvas')

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr',
      gridTemplateColumns: '220px 1fr',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Sidebar />
      <Canvas />
    </div>
  )
}

export default App
