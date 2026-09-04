require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const graphRoutes = require('./routes/graphs');
const telemetryRoutes = require('./routes/telemetry');
const alertsRoutes = require('./routes/alerts');
const Graph = require('./models/Graph');
const { startEngine, stopEngine } = require('./services/graphEngine');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexusFlow server is running' });
});

app.use('/api/graphs', graphRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertsRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`🔌 Client connected (${clients.size} total)`);
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`🔌 Client disconnected (${clients.size} total)`);
  });
});

function broadcast(data) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(payload);
  });
}


async function runDeployedGraph() {
  const deployed = await Graph.findOne({ status: 'deployed' }).sort({ updatedAt: -1 });
  if (deployed) {
    console.log(`▶️  Running deployed graph: "${deployed.name}" (${deployed.nodes.length} nodes)`);
    startEngine(deployed, broadcast);
  } else {
    console.log('⏸️  No deployed graph found — engine idle');
    stopEngine();
  }
}

app.set('runDeployedGraph', runDeployedGraph);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
      runDeployedGraph();
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
