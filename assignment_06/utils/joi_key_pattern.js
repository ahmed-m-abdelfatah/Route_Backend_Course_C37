const Joi = require('joi');

const userKeyPattern = {
  name: Joi.string().min(3).max(20),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.pattern.base': 'Password must be alphanumeric and at least 3 characters long',
  }),
  cPassword: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': 'Password and Confirm Password must be same',
  }),
  phone: Joi.string()
    .pattern(/^01[0|1|2][0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Phone number must be a valid EGY number',
    }),
  gender: Joi.valid('male', 'female'),
};

const messageKeyPattern = {
  messageBody: Joi.string().min(1).max(5000),
  id: Joi.string().min(24).max(24), // Sender or Receiver or Message
};

module.exports = {
  userKeyPattern,
  messageKeyPattern,
};
