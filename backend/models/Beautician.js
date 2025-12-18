const mongoose = require('mongoose');

const beauticianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Beautician name is required'],
    trim: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: ['Massage Specialist', 'Massage Therapist', 'Hilot Expert', 'Nail Artist', 'Nail Technician', 'Waxing Specialist', 'Threading Specialist'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issueDate: Date,
    file: { type: String }, 
  }],
  skills: [{ type: String }],
  
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date,
  },
  
  onHomeVisit: { type: Boolean, default: false },
  lastSafetyCheck: { type: Date },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Beautician', beauticianSchema);