const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
  },
  time: {
    type: String,
    required: [true, 'Booking time is required'],
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required'],
  },
  serviceName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
  },
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician',
    required: [true, 'Beautician is required'],
  },
  beauticianName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  homeServiceFee: {
    type: Number,
    default: 200,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});


bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ email: 1 });

module.exports = mongoose.model('Booking', bookingSchema);