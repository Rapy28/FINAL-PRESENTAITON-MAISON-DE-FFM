const Joi = require('joi');


const bookingSchema = Joi.object({
  customerName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required',
  }),
  phone: Joi.string().pattern(/^[0-9+]+$/).min(10).max(15).required().messages({
    'string.pattern.base': 'Phone number must contain only numbers and +',
    'string.min': 'Phone number must be at least 10 digits',
    'string.max': 'Phone number must not exceed 15 digits',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  date: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Date must be a valid date',
    'date.greater': 'Date must be in the future',
    'any.required': 'Date is required',
  }),
  time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9] [ap]m$/).required().messages({
    'string.pattern.base': 'Time must be in format HH:MM am/pm',
    'any.required': 'Time is required',
  }),
  service: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Service ID must be a valid MongoDB ObjectId',
    'string.length': 'Service ID must be 24 characters long',
    'any.required': 'Service is required',
  }),
  beautician: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Beautician ID must be a valid MongoDB ObjectId',
    'string.length': 'Beautician ID must be 24 characters long',
    'any.required': 'Beautician is required',
  }),
  address: Joi.string().min(10).max(200).required().messages({
    'string.min': 'Address must be at least 10 characters long',
    'string.max': 'Address must not exceed 200 characters',
    'any.required': 'Address is required',
  }),
  specialRequests: Joi.string().max(500).optional().messages({
    'string.max': 'Special requests must not exceed 500 characters',
  }),
});


const serviceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Service name must be at least 2 characters long',
    'string.max': 'Service name must not exceed 100 characters',
    'any.required': 'Service name is required',
  }),
  category: Joi.string().valid('MASSAGE', 'NAILS', 'WAXING', 'THREADING').required().messages({
    'any.only': 'Category must be one of: MASSAGE, NAILS, WAXING, THREADING',
    'any.required': 'Category is required',
  }),
  description: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description must not exceed 500 characters',
    'any.required': 'Description is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be positive',
    'any.required': 'Price is required',
  }),
  duration: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Duration must be at least 2 characters long',
    'string.max': 'Duration must not exceed 50 characters',
    'any.required': 'Duration is required',
  }),
});

exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message),
    });
  }
  next();
};

exports.validateService = (req, res, next) => {
  const { error } = serviceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message),
    });
  }
  next();
};