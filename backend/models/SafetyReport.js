const mongoose = require('mongoose');

const SafetyReportSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, enum: ['beautician', 'client'], required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SafetyReport', SafetyReportSchema);