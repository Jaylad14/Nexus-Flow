// Rolling window of recent readings, per sensor — used for the moving average
const windows = {}
// Whether each sensor is currently in "alert" state — used to detect crossings
const alertState = {}

const WINDOW_SIZE = 10   // number of readings to average over
const THRESHOLD = 80

function movingAverage(sensorId, value) {
  if (!windows[sensorId]) windows[sensorId] = []

  windows[sensorId].push(value)
  if (windows[sensorId].length > WINDOW_SIZE) {
    windows[sensorId].shift()
  }

  const sum = windows[sensorId].reduce((a, b) => a + b, 0)
  return Math.round((sum / windows[sensorId].length) * 10) / 10
}

// Processes one new reading. Returns the filtered value, and whether
// an alert should fire right now (only true on the exact upward crossing).
function processReading(sensorId, value) {
  const filteredValue = movingAverage(sensorId, value)
  const wasAboveThreshold = alertState[sensorId] || false
  const isAboveThreshold = filteredValue > THRESHOLD

  let alertFired = false
  if (isAboveThreshold && !wasAboveThreshold) {
    alertFired = true
  }

  alertState[sensorId] = isAboveThreshold

  return { filteredValue, alertFired, threshold: THRESHOLD }
}

module.exports = { processReading }
