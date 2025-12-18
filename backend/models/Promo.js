const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Promo title is required'],
  },
  description: {
    type: String,
    required: [true, 'Promo description is required'],
  },
  discount: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Discount must be a positive number'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Promo', promoSchema);