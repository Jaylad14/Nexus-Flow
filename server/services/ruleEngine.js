const windows = {}
const alertState = {}

const WINDOW_SIZE = 10
let THRESHOLD = 80   // now mutable — can be changed from the UI

function setThreshold(value) {
  THRESHOLD = Number(value)
}

function getThreshold() {
  return THRESHOLD
}

function movingAverage(sensorId, value) {
  if (!windows[sensorId]) windows[sensorId] = []
  windows[sensorId].push(value)
  if (windows[sensorId].length > WINDOW_SIZE) windows[sensorId].shift()
  const sum = windows[sensorId].reduce((a, b) => a + b, 0)
  return Math.round((sum / windows[sensorId].length) * 10) / 10
}

function processReading(sensorId, value) {
  const filteredValue = movingAverage(sensorId, value)
  const wasAboveThreshold = alertState[sensorId] || false
  const isAboveThreshold = filteredValue > THRESHOLD

  let alertFired = false
  if (isAboveThreshold && !wasAboveThreshold) alertFired = true

  alertState[sensorId] = isAboveThreshold

  return { filteredValue, alertFired, threshold: THRESHOLD }
}

module.exports = { processReading, setThreshold, getThreshold }
