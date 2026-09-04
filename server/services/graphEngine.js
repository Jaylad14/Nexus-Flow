const Telemetry = require('../models/Telemetry')
const { createGenerator } = require('./sensorTypes')
const { applyFilter } = require('./filterTypes')
const { fireAction } = require('./actionTypes')

let activeIntervals = []
const alertState = {}   

function stopEngine() {
  activeIntervals.forEach(clearInterval)
  activeIntervals = []
}


function findDownstream(nodeId, edges) {
  return edges.filter((e) => e.source === nodeId).map((e) => e.target)
}


function startEngine(graph, broadcast) {
  Object.keys(alertState).forEach((key) => delete alertState[key])
  stopEngine()

  const nodes = graph.nodes
  const edges = graph.edges
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))

  const sensorNodes = nodes.filter((n) => n.type === 'sensor')

  sensorNodes.forEach((sensorNode) => {
    const generate = createGenerator(sensorNode.data.label, sensorNode.id)

    const interval = setInterval(async () => {
      const rawValue = generate()
      const sensorId = sensorNode.data.source || sensorNode.id

      try {
        await Telemetry.create({ sensorId, value: rawValue })
      } catch (err) {
        console.error('Telemetry save failed:', err.message)
      }
      broadcast({ type: 'telemetry', sensorId, value: rawValue, nodeId: sensorNode.id })

      const filterIds = findDownstream(sensorNode.id, edges)

      filterIds.forEach((filterId) => {
        const filterNode = nodeById[filterId]
        if (!filterNode || filterNode.type !== 'filter') return

        const filteredValue = applyFilter(filterNode.data.label, filterNode.id, rawValue)
        broadcast({ type: 'filtered', sensorId, value: filteredValue, nodeId: filterNode.id })

        // Walk further to whatever this filter is connected to
        const actionIds = findDownstream(filterNode.id, edges)

        actionIds.forEach(async (actionId) => {
          const actionNode = nodeById[actionId]
          if (!actionNode || actionNode.type !== 'action') return

          const conditionText = actionNode.data.condition || 'if > 80'
          const threshold = parseFloat(conditionText.replace(/[^0-9.]/g, '')) || 80

          const wasAbove = alertState[actionNode.id] || false
          const isAbove = filteredValue > threshold

          if (isAbove && !wasAbove) {
            await fireAction(actionNode.data.label, actionNode, filteredValue, broadcast)
          }
          alertState[actionNode.id] = isAbove
        })
      })
    }, 1000)

    activeIntervals.push(interval)
  })
}

module.exports = { startEngine, stopEngine }












































































// tracks above/below threshold per action node, to fire only once per crossing