import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Inspector from './components/Inspector'
import Toast from './components/Toast'
import { saveGraph } from './utils/api'
import { useTelemetry } from './hooks/useTelemetry'

const initialNodes = [
  {
    id: '1',
    type: 'sensor',
    position: { x: 60, y: 120 },
    data: { label: 'Turbine 04 — Temp', value: '71C', source: 'turbine-04.temperature' },
  },
  {
    id: '2',
    type: 'filter',
    position: { x: 360, y: 150 },
    data: { label: 'Moving average', config: 'window: 10s', output: '69.4C' },
  },
  {
    id: '3',
    type: 'action',
    position: { x: 640, y: 84 },
    data: { label: 'SMS alert', condition: 'if > 80C', target: '+91-98xxx-xxxxx' },
  },
]

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: 'rgba(34,211,238,0.6)', strokeWidth: 1.5, strokeDasharray: '5 4' },
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: { stroke: 'rgba(167,139,250,0.6)', strokeWidth: 1.5, strokeDasharray: '5 4' },
    animated: true,
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('Canvas')
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [graphId, setGraphId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [alerting, setAlerting] = useState(false)

  const { readings, filtered, lastAlert } = useTelemetry()

  // Update sensor node's live value + filter node's smoothed output
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'sensor' && readings[node.data.source] !== undefined) {
          return { ...node, data: { ...node.data, value: `${readings[node.data.source]}C` } }
        }
        if (node.type === 'filter' && filtered['turbine-04.temperature'] !== undefined) {
          return { ...node, data: { ...node.data, output: `${filtered['turbine-04.temperature']}C` } }
        }
        return node
      })
    )
  }, [readings, filtered])

  // When an alert fires, briefly flag the action node as "alerting" for a glow effect
  useEffect(() => {
    if (!lastAlert) return
    setAlerting(true)
    const timer = setTimeout(() => setAlerting(false), 4000)
    return () => clearTimeout(timer)
  }, [lastAlert])

  const handleSave = async (status) => {
    setSaveStatus('saving')
    try {
      const payload = { name: 'Turbine monitor rule', nodes, edges, status }
      const saved = await saveGraph(graphId, payload)
      setGraphId(saved._id)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Save failed:', err.message)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr',
      gridTemplateColumns: '220px 1fr 260px',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSaveDraft={() => handleSave('draft')}
        onDeploy={() => handleSave('deployed')}
        saveStatus={saveStatus}
      />
      <Sidebar />
      <div style={{ position: 'relative' }}>
        <Canvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeSelect={setSelectedNode}
          alerting={alerting}
        />
        <Toast alert={lastAlert} />
      </div>
      <Inspector selectedNode={selectedNode} />
    </div>
  )
}

export default App
