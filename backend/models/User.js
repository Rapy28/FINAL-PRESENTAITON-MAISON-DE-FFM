const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['client', 'admin', 'manager', 'beautician'],
      default: 'client',
    },
    
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    birthdate: { type: Date },
    address: { type: String },
    
    serviceHistory: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        date: { type: Date },
        beautician: { type: mongoose.Schema.Types.ObjectId, ref: 'Beautician' },
        notes: { type: String },
      }
    ],
    
    preferences: {
      favoriteServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
      preferredBeauticians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beautician' }],
      other: { type: String },
    },
    
    loyaltyPoints: { type: Number, default: 0 },
    eligiblePromos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promo' }],
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
