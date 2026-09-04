const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  value: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('Alert', AlertSchema)
