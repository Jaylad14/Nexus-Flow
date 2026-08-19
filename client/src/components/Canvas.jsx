import { useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import 'reactflow/dist/style.css'
import SensorNode from './nodes/SensorNode'
import FilterNode from './nodes/FilterNode'
import ActionNode from './nodes/ActionNode'

const nodeTypes = {
  sensor: SensorNode,
  filter: FilterNode,
  action: ActionNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'sensor',
    position: { x: 60, y: 120 },
    data: { label: 'Turbine 04 — Temp', value: '71C' },
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

function Canvas() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(circle, rgba(99,120,155,0.18) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="transparent" />
        <Controls style={{ button: { background: 'var(--surface-up)', color: 'var(--ink)', border: 'none' } }} />
      </ReactFlow>
    </div>
  )
}

export default Canvas
