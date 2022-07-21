const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const updateProfileValidationSchema = {
  body: Joi.object().required().keys({
    name: userKeyPattern.name,
    email: userKeyPattern.email,
    phone: userKeyPattern.phone,
    gender: userKeyPattern.gender,
  }),
};

module.exports = {
  updateProfileValidationSchema,
};
