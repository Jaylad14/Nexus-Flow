require('dotenv').config();
const express = require('express');
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

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);

      // Start generating mock sensor data
      startMockSensor((reading) => {
        console.log(`📊 ${reading.sensorId}: ${reading.value}°C`);
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
