const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beautician: { type: mongoose.Schema.Types.ObjectId, ref: 'Beautician', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);