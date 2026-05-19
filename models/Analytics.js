const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  page: String,
  visitorId: String,
  ip: String,
  userAgent: String,
  referrer: String
}, {
  timestamps: true
});

// Create index for faster queries
AnalyticsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);