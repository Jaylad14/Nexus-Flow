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

// Threshold filter: gates the signal. Below a fixed cutoff (50),
// it flattens to 0 — nothing downstream should react. At or above
// the cutoff, the real value passes through unmodified. This is
// genuinely different from Moving Average (smooths) and Delta
// (rate of change) — this one filters out "noise floor" readings.
const GATE_CUTOFF = 50

function thresholdGate(nodeId, value) {
  return value >= GATE_CUTOFF ? value : 0
}

function applyFilter(filterLabel, nodeId, value) {
  if (filterLabel === 'Moving average') return movingAverage(nodeId, value)
  if (filterLabel === 'Delta') return delta(nodeId, value)
  if (filterLabel === 'Threshold') return thresholdGate(nodeId, value)
  return value
}

module.exports = { applyFilter }
