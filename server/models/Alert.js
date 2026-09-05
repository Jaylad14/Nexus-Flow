const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  nodeLabel: { type: String, default: 'Unknown' },
  actionType: { type: String, default: 'sms' },
  value: { type: Number, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('Alert', AlertSchema)
