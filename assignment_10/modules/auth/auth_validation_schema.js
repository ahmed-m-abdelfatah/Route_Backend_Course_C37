const joi = require('joi');
const { userKeyPattern } = require('../../utils/joi_key_pattern.js');

const signup = joi.object({
  name: userKeyPattern.name.required(),
  email: userKeyPattern.email.required(),
  password: userKeyPattern.password.required(),
  cPassword: userKeyPattern.cPassword('password').required(),
});

const confirmEmail = {
  params: joi.object().required().keys({
    token: userKeyPattern.token.required(),
  }),
};

const login = joi.object({
  email: userKeyPattern.email.required(),
  password: userKeyPattern.password.required(),
});

const forgetPasswordSendCode = joi.object({
  email: userKeyPattern.email.required(),
});

const forgetPassword = joi.object({
  email: userKeyPattern.email.required(),
  newPassword: userKeyPattern.password.required(),
  cNewPassword: userKeyPattern.cPassword('newPassword').required(),
  code: userKeyPattern.code.required(),
});

module.exports = {
  signup,
  confirmEmail,
  login,
  forgetPasswordSendCode,
  forgetPassword,
};
