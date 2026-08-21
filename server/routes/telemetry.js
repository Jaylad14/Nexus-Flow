const express = require('express')
const router = express.Router()
const Telemetry = require('../models/Telemetry')

// GET /api/telemetry/:sensorId — last 20 readings for a sensor
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

module.exports = router
