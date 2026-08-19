import { useState } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Inspector from './components/Inspector'

function App() {
  const [activeTab, setActiveTab] = useState('Canvas')
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr',
      gridTemplateColumns: '220px 1fr 260px',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Sidebar />
      <Canvas onNodeSelect={setSelectedNode} />
      <Inspector selectedNode={selectedNode} />
    </div>
  )
}

export default App
