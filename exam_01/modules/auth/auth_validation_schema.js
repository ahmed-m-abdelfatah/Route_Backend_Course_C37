const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const signup = {
  body: Joi.object()
    .required()
    .keys({
      email: userKeyPattern.email.required(),
      password: userKeyPattern.password.required(),
      cPassword: userKeyPattern.cPassword('password').required(),
      age: userKeyPattern.age.required(),
    }),
};

const confirmEmail = {
  params: Joi.object().required().keys({
    token: userKeyPattern.token.required(),
  }),
};

const login = {
  body: Joi.object().required().keys({
    email: userKeyPattern.email.required(),
    password: userKeyPattern.password.required(),
  }),
};

const forgetPassword = {
  body: Joi.object()
    .required()
    .keys({
      email: userKeyPattern.email.required(),
      newPassword: userKeyPattern.password.required(),
      cNewPassword: userKeyPattern.cPassword('newPassword').required(),
      code: Joi.number().required(),
    }),
};

module.exports = {
  signup,
  confirmEmail,
  login,
  forgetPassword,
};
