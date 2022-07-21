const Joi = require('joi');

const userKeyPattern = {
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.pattern.base': 'Password must be alphanumeric and at least 3 characters long',
  }),
  cPassword: ref =>
    Joi.string().valid(Joi.ref(ref)).messages({
      'any.only': `Password and Confirm Password must be same`,
    }),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Phone number must be a valid EGY number',
    }),
  gender: Joi.valid('male', 'female'),
  age: Joi.number().min(18).max(80),
  id: Joi.string().min(24).max(24),
  role: Joi.valid('user', 'admin'),
  token: Joi.string(),
  firstName: Joi.string().min(2).max(24),
  lastName: Joi.string().min(2).max(24),
};

const productKeyPattern = {
  productTitle: Joi.string().min(2).max(24),
  productDesc: Joi.string().min(2).max(140),
  productPrice: Joi.number().min(0).max(999999),
  id: Joi.string().min(24).max(24),
};

const commentKeyPattern = {
  productId: Joi.string().min(24).max(24),
  commentId: Joi.string().min(24).max(24),
  commentContent: Joi.string().max(140),
};

module.exports = {
  userKeyPattern,
  productKeyPattern,
  commentKeyPattern,
};
