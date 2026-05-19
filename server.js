const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);

// Simple Profile Schema
const profileSchema = new mongoose.Schema({
  fullName: String,
  title: String,
  bio: String,
  email: String,
  phone: String,
  location: String
});

const Profile = mongoose.model('Profile', profileSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = { fullName: 'Your Name', title: 'Web Developer', bio: 'Welcome to my portfolio!' };
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username },
      'secret123',
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
