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
  id: Joi.string().min(24).max(24),
  token: Joi.string(),
  name: Joi.string().min(2).max(24),
  code: Joi.string().min(4).max(4),
};

const blogKeyPattern = {
  token: Joi.string(),
  id: Joi.string().min(24).max(24),
  title: Joi.string().min(2).max(24),
  desc: Joi.string().min(2).max(140),
  price: Joi.number().min(0).max(999999),
};

module.exports = {
  userKeyPattern,
  blogKeyPattern,
};
