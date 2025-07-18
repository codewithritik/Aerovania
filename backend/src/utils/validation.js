const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user', 'viewer').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Report validation schemas
const violationSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().required(),
  timestamp: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  image_url: Joi.string().uri().required()
});

const reportSchema = Joi.object({
  drone_id: Joi.string().required(),
  date: Joi.string().required(),
  location: Joi.string().required(),
  violations: Joi.array().items(violationSchema).required()
});

// Query validation schemas
const filterSchema = Joi.object({
  drone_id: Joi.string().optional(),
  date: Joi.string().optional(),
  type: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(1000).optional(),
  offset: Joi.number().integer().min(0).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  reportSchema,
  violationSchema,
  filterSchema
};
