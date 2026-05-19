const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'soft-skills'],
    default: 'frontend'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);