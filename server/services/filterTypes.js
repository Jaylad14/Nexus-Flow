

const state = {}

function movingAverage(nodeId, value, windowSize = 10) {
  if (!state[nodeId]) state[nodeId] = { window: [] }
  const s = state[nodeId]
  s.window.push(value)
  if (s.window.length > windowSize) s.window.shift()
  const sum = s.window.reduce((a, b) => a + b, 0)
  return Math.round((sum / s.window.length) * 100) / 100
}

function delta(nodeId, value) {
  if (!state[nodeId]) state[nodeId] = { last: value }
  const s = state[nodeId]
  const change = Math.round((value - s.last) * 100) / 100
  s.last = value
  return change
}

function passthrough(nodeId, value) {
  return value
}

// Runs the correct transformation based on the filter node's label.
function applyFilter(filterLabel, nodeId, value) {
  if (filterLabel === 'Moving average') return movingAverage(nodeId, value)
  if (filterLabel === 'Delta') return delta(nodeId, value)
  if (filterLabel === 'Threshold') return passthrough(nodeId, value)
  return passthrough(nodeId, value)
}

module.exports = { applyFilter }
