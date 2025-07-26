const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/User');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

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

// GET /test - test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
