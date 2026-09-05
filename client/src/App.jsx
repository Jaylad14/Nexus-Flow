import { useState, useEffect, useCallback } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import Inspector from './components/Inspector'
import Toast from './components/Toast'
import { saveGraph, loadLatestGraph } from './utils/api'
import { useTelemetry } from './hooks/useTelemetry'

const defaultNodes = [
  { id: '1', type: 'sensor', position: { x: 60, y: 120 }, data: { label: 'Turbine 04 — Temp', value: '71C', source: 'turbine-04.temperature' } },
  { id: '2', type: 'filter', position: { x: 360, y: 150 }, data: { label: 'Moving average', config: 'window: 10s', output: '69.4C' } },
  { id: '3', type: 'action', position: { x: 640, y: 84 }, data: { label: 'SMS alert', condition: 'if > 80C', target: '+91-98xxx-xxxxx' } },
]

const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2', style: { stroke: 'rgba(34,211,238,0.6)', strokeWidth: 1.5, strokeDasharray: '5 4' }, animated: true },
  { id: 'e2-3', source: '2', target: '3', style: { stroke: 'rgba(167,139,250,0.6)', strokeWidth: 1.5, strokeDasharray: '5 4' }, animated: true },
]

function App() {
  const [activeTab, setActiveTab] = useState('Canvas')
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodes, setNodes] = useState(defaultNodes)
  const [edges, setEdges] = useState(defaultEdges)
  const [graphId, setGraphId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [alerting, setAlerting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const { readings, filtered, lastAlert } = useTelemetry()

  useEffect(() => {
    loadLatestGraph()
      .then((graph) => {
        if (graph) {
          setNodes(graph.nodes)
          setEdges(graph.edges)
          setGraphId(graph._id)
        }
      })
      .catch((err) => console.error('Load failed:', err.message))
      .finally(() => setLoaded(true))
  }, [])

  // Matches live data to nodes by nodeId — works for ANY sensor or
  // filter on the canvas, not just one hardcoded example. A sensor
  // node shows its own raw reading; a filter node shows its own
  // computed output (average, delta, or passthrough).
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'sensor' && readings[node.id] !== undefined) {
          return { ...node, data: { ...node.data, value: `${readings[node.id]}` } }
        }
        if (node.type === 'filter' && filtered[node.id] !== undefined) {
          return { ...node, data: { ...node.data, output: `${filtered[node.id]}` } }
        }
        return node
      })
    )
  }, [readings, filtered])

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

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    setSelectedNode(null)
  }, [])

  const handleUpdateNode = useCallback((nodeId, dataPatch) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...dataPatch } } : n))
    )
    setSelectedNode((prev) =>
      prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...dataPatch } } : prev
    )
  }, [])

  if (!loaded) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        Loading NexusFlow...
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '52px 1fr', gridTemplateColumns: '220px 1fr 260px', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
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
      <Inspector selectedNode={selectedNode} onDeleteNode={handleDeleteNode} onUpdateNode={handleUpdateNode} />
    </div>
  )
}

export default App
