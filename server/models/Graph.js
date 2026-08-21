const mongoose = require('mongoose')

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['sensor', 'filter', 'action'], required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false })

const EdgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  animated: { type: Boolean, default: true },
  style: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false })

const GraphSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Untitled rule' },
  nodes: { type: [NodeSchema], default: [] },
  edges: { type: [EdgeSchema], default: [] },
  status: { type: String, enum: ['draft', 'deployed'], default: 'draft' },
}, { timestamps: true })

module.exports = mongoose.model('Graph', GraphSchema)
