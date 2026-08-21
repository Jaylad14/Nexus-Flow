const mongoose = require('mongoose')

const TelemetrySchema = new mongoose.Schema({
  sensorId: { type: String, required: true, index: true },
  value: { type: Number, required: true },
  unit: { type: String, default: 'C' },
  timestamp: { type: Date, default: Date.now, index: true },
})

module.exports = mongoose.model('Telemetry', TelemetrySchema)
