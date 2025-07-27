const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/User');
const SensorData = require('./model/SensorData');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to local MongoDB (Compass)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// POST /users - save user to database
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save(); // 💾 Save to MongoDB
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create user', details: err.message });
  }
});

// GET /users - fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // 🔍 Find all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /sensor-data - upload temperature and humidity data
app.post('/sensor-data', async (req, res) => {
  try {
    const { temperature, humidity, sensorId } = req.body;

    // Validate required fields
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        error: 'Temperature and humidity are required fields'
      });
    }

    // Validate temperature range (-50 to 100°C)
    if (temperature < -50 || temperature > 100) {
      return res.status(400).json({
        error: 'Temperature must be between -50°C and 100°C'
      });
    }

    // Validate humidity range (0 to 100%)
    if (humidity < 0 || humidity > 100) {
      return res.status(400).json({
        error: 'Humidity must be between 0% and 100%'
      });
    }

    const sensorData = new SensorData({
      temperature,
      humidity,
      sensorId: sensorId || 'default'
    });

    await sensorData.save();
    res.status(201).json({
      message: 'Sensor data uploaded successfully',
      data: sensorData
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: 'Could not upload sensor data',
      details: err.message
    });
  }
});

// GET /sensor-data - fetch all sensor data
app.get('/sensor-data', async (req, res) => {
  try {
    const { limit = 100, sensorId } = req.query;
    let query = {};

    if (sensorId) {
      query.sensorId = sensorId;
    }

    const sensorData = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(sensorData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

// GET /sensor-data/latest - get latest sensor reading
app.get('/sensor-data/latest', async (req, res) => {
  try {
    const { sensorId } = req.query;
    let query = {};

    if (sensorId) {
      query.sensorId = sensorId;
    }

    const latestData = await SensorData.findOne(query)
      .sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ error: 'No sensor data found' });
    }

    res.json(latestData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest sensor data' });
  }
});

// GET /test - test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
