const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const signupValidationSchema = {
  body: Joi.object().required().keys({
    name: userKeyPattern.name.required(),
    email: userKeyPattern.email.required(),
    password: userKeyPattern.password.required(),
    cPassword: userKeyPattern.cPassword.required(),
  }),
};

const signinValidationSchema = {
  body: Joi.object().required().keys({
    email: userKeyPattern.email.required(),
    password: userKeyPattern.password.required(),
  }),
};

module.exports = {
  signupValidationSchema,
  signinValidationSchema,
};
