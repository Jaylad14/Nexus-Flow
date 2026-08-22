require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const graphRoutes = require('./routes/graphs');
const telemetryRoutes = require('./routes/telemetry');
const { startMockSensor } = require('./services/mockSensor');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexusFlow server is running' });
});

app.use('/api/graphs', graphRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Create a raw HTTP server from the Express app, so WebSocket
// can attach to the exact same port instead of needing a second one
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Track connected browser clients
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`🔌 Client connected (${clients.size} total)`);

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`🔌 Client disconnected (${clients.size} total)`);
  });
});

// Broadcast a message to every connected browser
function broadcast(data) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);

      // Push every new mock reading straight to all connected browsers
      startMockSensor((reading) => {
        broadcast({ type: 'telemetry', ...reading });
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
