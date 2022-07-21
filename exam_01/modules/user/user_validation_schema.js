const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const updateProfile = {
  body: Joi.object().required().keys({
    email: userKeyPattern.email,
    phone: userKeyPattern.phone,
    gender: userKeyPattern.gender,
    age: userKeyPattern.age,
    firstName: userKeyPattern.firstName,
    lastName: userKeyPattern.lastName,
  }),
};

const updatePassword = {
  body: Joi.object()
    .required()
    .keys({
      oldPassword: userKeyPattern.password.required(),
      newPassword: userKeyPattern.password.required(),
      cNewPassword: userKeyPattern.cPassword('newPassword').required(),
    }),
};

module.exports = {
  updateProfile,
  updatePassword,
};
