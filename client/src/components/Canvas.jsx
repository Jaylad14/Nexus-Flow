import { useCallback, useMemo } from 'react'
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

function Canvas({ nodes, edges, setNodes, setEdges, onNodeSelect, alerting }) {
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  const handleNodeClick = useCallback(
    (event, node) => { if (onNodeSelect) onNodeSelect(node) },
    [onNodeSelect]
  )

  const handlePaneClick = useCallback(() => {
    if (onNodeSelect) onNodeSelect(null)
  }, [onNodeSelect])

  // Inject the alerting flag into the action node's data so it can render its glow
  const displayNodes = useMemo(() => {
    return nodes.map((node) =>
      node.type === 'action' ? { ...node, data: { ...node.data, alerting } } : node
    )
  }, [nodes, alerting])

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(circle, rgba(99,120,155,0.18) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    }}>
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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

export default Canvas
