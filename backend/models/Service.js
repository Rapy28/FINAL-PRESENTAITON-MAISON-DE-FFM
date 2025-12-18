const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['MASSAGE', 'NAILS', 'WAXING', 'THREADING'],
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price must be a positive number'],
  },
  duration: {
    type: String,
    required: [true, 'Service duration is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);