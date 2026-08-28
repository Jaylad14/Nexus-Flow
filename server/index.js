require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const graphRoutes = require('./routes/graphs');
const telemetryRoutes = require('./routes/telemetry');
const rulesRoutes = require('./routes/rules');
const { startMockSensor } = require('./services/mockSensor');
const { processReading } = require('./services/ruleEngine');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexusFlow server is running' });
});

app.use('/api/graphs', graphRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/rules', rulesRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function broadcast(data) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(payload);
  });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);

      startMockSensor((reading) => {
        broadcast({ type: 'telemetry', ...reading });

        const result = processReading(reading.sensorId, reading.value);
        broadcast({ type: 'filtered', sensorId: reading.sensorId, value: result.filteredValue });

        if (result.alertFired) {
          broadcast({
            type: 'alert',
            sensorId: reading.sensorId,
            value: result.filteredValue,
            threshold: result.threshold,
            timestamp: new Date(),
          });
        }
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
