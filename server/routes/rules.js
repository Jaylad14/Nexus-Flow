const express = require('express')
const router = express.Router()
const { setThreshold, getThreshold } = require('../services/ruleEngine')

router.get('/threshold', (req, res) => {
  res.json({ threshold: getThreshold() })
})

router.post('/threshold', (req, res) => {
  const { value } = req.body
  if (isNaN(Number(value))) {
    return res.status(400).json({ error: 'value must be a number' })
  }
  setThreshold(value)
  res.json({ ok: true, threshold: Number(value) })
})

module.exports = router
