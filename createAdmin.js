const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to local MongoDB
    await mongoose.connect('mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists!');
      console.log('━━━━━━━━━━━━━━━━━━━━');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    }

    // Create admin
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      email: 'admin@portfolio.com',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin created!');
    console.log('━━━━━━━━━━━━━━━━━━━━');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
