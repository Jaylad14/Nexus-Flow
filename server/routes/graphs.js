const express = require('express')
const router = express.Router()
const Graph = require('../models/Graph')

router.get('/', async (req, res) => {
  try {
    const graphs = await Graph.find({}, 'name status updatedAt').sort({ updatedAt: -1 })
    res.json(graphs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const graph = await Graph.findById(req.params.id)
    if (!graph) return res.status(404).json({ error: 'Graph not found' })
    res.json(graph)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, nodes, edges, status } = req.body
    const graph = await Graph.create({ name, nodes, edges, status })

    // If this new graph was created as "deployed", restart the engine now
    if (status === 'deployed') {
      const runDeployedGraph = req.app.get('runDeployedGraph')
      if (runDeployedGraph) await runDeployedGraph()
    }

    res.status(201).json(graph)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, nodes, edges, status } = req.body
    const graph = await Graph.findByIdAndUpdate(
      req.params.id,
      { name, nodes, edges, status },
      { new: true, runValidators: true }
    )
    if (!graph) return res.status(404).json({ error: 'Graph not found' })

    // Same here — an updated graph saved as "deployed" should restart
    // the engine immediately with the fresh nodes/edges, not the old ones
    if (status === 'deployed') {
      const runDeployedGraph = req.app.get('runDeployedGraph')
      if (runDeployedGraph) await runDeployedGraph()
    }

    res.json(graph)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
