// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendBookingConfirmation = require('../config/email');
const errorHandler = require('../middleware/errorHandler.js');
const Review = require('../models/Review');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

// =====================
// REGISTER USER
// =====================
exports.register = async (req, res) => {
  try {
    // Accept demographic and preference fields
    const {
      name,
      email,
      password,
      phone,
      gender,
      birthdate,
      address,
      preferences,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return errorHandler(res, 400, 'User already exists with this email');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      birthdate,
      address,
      preferences,
      loyaltyPoints: 0,
      eligiblePromos: [],
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        birthdate: user.birthdate,
        address: user.address,
        preferences: user.preferences,
        loyaltyPoints: user.loyaltyPoints,
        eligiblePromos: user.eligiblePromos,
      },
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error registering user', error);
  }
};

// =====================
// LOGIN USER (FIXED ROLE CHECK)
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) return errorHandler(res, 401, 'Invalid email or password');

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorHandler(res, 401, 'Invalid email or password');

    // Check that selected role matches actual user role
    if (role && user.role !== role) {
      return errorHandler(res, 403, 'Role not allowed for this account');
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        birthdate: user.birthdate,
        address: user.address,
        preferences: user.preferences,
        loyaltyPoints: user.loyaltyPoints,
        eligiblePromos: user.eligiblePromos,
      },
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error logging in', error);
  }
};

// =====================
// GET CURRENT USER
// =====================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error fetching user', error);
  }
};

// =====================
// UPDATE PROFILE
// =====================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, birthdate, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, gender, birthdate, address },
      { new: true, runValidators: true }
    );

    if (!user) return errorHandler(res, 404, 'User not found');

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error updating profile', error);
  }
};

// =====================
// UPDATE PREFERENCES
// =====================
exports.updatePreferences = async (req, res) => {
  try {
    const preferences = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
    );

    if (!user) return errorHandler(res, 404, 'User not found');

    res.json({ success: true, preferences: user.preferences });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error updating preferences', error);
  }
};

// =====================
// ADD FEEDBACK / REVIEW
// =====================
exports.addFeedback = async (req, res) => {
  try {
    const { beautician, rating, comment } = req.body;

    const review = new Review({
      reviewer: req.user.id,
      beautician,
      rating,
      comment,
      date: new Date(),
    });

    await review.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, 'Error adding feedback', error);
  }
};
