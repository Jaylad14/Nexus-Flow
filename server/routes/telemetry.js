const express = require('express')
const router = express.Router()
const Telemetry = require('../models/Telemetry')
const { setTemp } = require('../services/mockSensor')

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

// POST /api/telemetry/override — manually set the mock sensor's value
router.post('/override', (req, res) => {
  const { value } = req.body
  if (typeof value !== 'number' && isNaN(Number(value))) {
    return res.status(400).json({ error: 'value must be a number' })
  }
  setTemp(value)
  res.json({ ok: true, value: Number(value) })
})

module.exports = router
