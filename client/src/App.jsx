import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Inspector from './components/Inspector'
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

  const readings = useTelemetry()

  // Whenever a new telemetry reading comes in, update the matching sensor node's value
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'sensor' && readings[node.data.source] !== undefined) {
          return {
            ...node,
            data: { ...node.data, value: `${readings[node.data.source]}C` },
          }
        }
        return node
      })
    )
  }, [readings])

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
      <Canvas
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onNodeSelect={setSelectedNode}
      />
      <Inspector selectedNode={selectedNode} />
    </div>
  )
}

export default App
