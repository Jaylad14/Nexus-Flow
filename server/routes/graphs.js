const express = require('express')
const router = express.Router()
const Graph = require('../models/Graph')

// GET /api/graphs — list all saved graphs (id, name, status only — not full node data)
router.get('/', async (req, res) => {
  try {
    const graphs = await Graph.find({}, 'name status updatedAt').sort({ updatedAt: -1 })
    res.json(graphs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/graphs/:id — load one full graph (nodes + edges)
router.get('/:id', async (req, res) => {
  try {
    const graph = await Graph.findById(req.params.id)
    if (!graph) return res.status(404).json({ error: 'Graph not found' })
    res.json(graph)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/graphs — create a new graph
router.post('/', async (req, res) => {
  try {
    const { name, nodes, edges, status } = req.body
    const graph = await Graph.create({ name, nodes, edges, status })
    res.status(201).json(graph)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/graphs/:id — update an existing graph (used by both Save draft and Deploy)
router.put('/:id', async (req, res) => {
  try {
    const { name, nodes, edges, status } = req.body
    const graph = await Graph.findByIdAndUpdate(
      req.params.id,
      { name, nodes, edges, status },
      { new: true, runValidators: true }
    )
    if (!graph) return res.status(404).json({ error: 'Graph not found' })
    res.json(graph)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
