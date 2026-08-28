import { useCallback, useMemo, useRef } from 'react'
import { ReactFlow, Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges, useReactFlow, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import SensorNode from './nodes/SensorNode'
import FilterNode from './nodes/FilterNode'
import ActionNode from './nodes/ActionNode'

const nodeTypes = {
  sensor: SensorNode,
  filter: FilterNode,
  action: ActionNode,
}

let idCounter = 100

function CanvasInner({ nodes, edges, setNodes, setEdges, onNodeSelect, alerting }) {
  const wrapperRef = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  // Fires when the user drags from one node's handle to another's,
  // completing a new wire. This is the piece that was missing.
  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({
      ...connection,
      animated: true,
      style: { stroke: 'rgba(34,211,238,0.6)', strokeWidth: 1.5, strokeDasharray: '5 4' },
    }, eds))
  }, [setEdges])

  const handleNodeClick = useCallback(
    (event, node) => { if (onNodeSelect) onNodeSelect(node) },
    [onNodeSelect]
  )

  const handlePaneClick = useCallback(() => {
    if (onNodeSelect) onNodeSelect(null)
  }, [onNodeSelect])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event) => {
    event.preventDefault()
    const raw = event.dataTransfer.getData('application/nexusflow-node')
    if (!raw) return

    const item = JSON.parse(raw)
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })

    idCounter += 1
    const newNode = {
      id: `n${idCounter}`,
      type: item.type,
      position,
      data:
        item.type === 'sensor'
          ? { label: item.title, value: '—', source: `custom-${idCounter}` }
          : item.type === 'filter'
          ? { label: item.title, config: 'window: 10s', output: '—' }
          : { label: item.title, condition: 'if > 80C', target: '—' },
    }

    setNodes((nds) => [...nds, newNode])
  }, [screenToFlowPosition, setNodes])

  const displayNodes = useMemo(() => {
    return nodes.map((node) =>
      node.type === 'action' ? { ...node, data: { ...node.data, alerting } } : node
    )
  }, [nodes, alerting])

  return (
    <div
      ref={wrapperRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        position: 'relative',
        height: '100%',
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(circle, rgba(99,120,155,0.18) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="transparent" />
        <Controls style={{ button: { background: 'var(--surface-up)', color: 'var(--ink)', border: 'none' } }} />
      </ReactFlow>
    </div>
  )
}

function Canvas(props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}

export default Canvas
