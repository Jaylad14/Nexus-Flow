const Telemetry = require('../models/Telemetry')

let currentTemp = 71
let direction = 1

function nextReading() {
  const spike = Math.random() < 0.15
  const magnitude = spike ? Math.random() * 4 : Math.random() * 1.2
  const delta = magnitude * direction

  currentTemp += delta
  currentTemp = Math.round(currentTemp * 10) / 10

  if (currentTemp > 84) direction = -1
  if (currentTemp < 68) direction = 1

  return currentTemp
}

// Lets a manual UI input jump the temperature directly.
// The automatic drift continues naturally from this new value.
function setTemp(value) {
  currentTemp = Number(value)
  direction = 1
}

function startMockSensor(onReading, intervalMs = 1000) {
  const sensorId = 'turbine-04.temperature'

  const interval = setInterval(async () => {
    const value = nextReading()
    try {
      await Telemetry.create({ sensorId, value })
    } catch (err) {
      console.error('Telemetry save failed:', err.message)
    }
    if (onReading) onReading({ sensorId, value, timestamp: new Date() })
  }, intervalMs)

  return () => clearInterval(interval)
}

module.exports = { startMockSensor, setTemp }
