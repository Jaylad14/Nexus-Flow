// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Allow the React frontend to make requests to this server
app.use(cors({ origin: process.env.CLIENT_URL }));

// Parse incoming JSON request bodies automatically
app.use(express.json());

// A simple test route — confirms the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexusFlow server is running' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then only start listening once that succeeds
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });