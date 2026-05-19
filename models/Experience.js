const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  current: {
    type: Boolean,
    default: false
  },
  description: [String],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', ExperienceSchema);