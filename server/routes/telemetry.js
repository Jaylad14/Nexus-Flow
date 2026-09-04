const express = require('express')
const router = express.Router()
const Telemetry = require('../models/Telemetry')
const { setOverride } = require('../services/sensorTypes')

router.get('/:sensorId', async (req, res) => {
  try {
    const readings = await Telemetry.find({ sensorId: req.params.sensorId })
      .sort({ timestamp: -1 })
      .limit(20)
    res.json(readings.reverse())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/telemetry/override — manually set a specific node's next reading
router.post('/override', (req, res) => {
  const { nodeId, value } = req.body
  if (!nodeId) {
    return res.status(400).json({ error: 'nodeId is required' })
  }
  if (isNaN(Number(value))) {
    return res.status(400).json({ error: 'value must be a number' })
  }
  setOverride(nodeId, value)
  res.json({ ok: true, nodeId, value: Number(value) })
})

module.exports = router
