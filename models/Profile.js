const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: 'Your Name'
  },
  title: {
    type: String,
    default: 'Web Developer'
  },
  bio: {
    type: String,
    default: 'Passionate developer creating amazing web experiences.'
  },
  email: String,
  phone: String,
  location: String,
  profileImage: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String
  },
  resumeUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);