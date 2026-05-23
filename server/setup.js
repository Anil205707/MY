const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB\n');

    // Delete existing admin if exists
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️  Removed existing admin (if any)\n');

    // Create new admin with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@portfolio.com',
      role: 'admin'
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Verify the user was created
    const verifyUser = await User.findOne({ username: 'admin' });
    if (verifyUser) {
      console.log('\n✅ Verification: Admin user exists in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();