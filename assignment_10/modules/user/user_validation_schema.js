const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const joi = require('joi');

const getProfile = joi.object({
  token: userKeyPattern.token.required(),
});

const updateProfile = joi.object({
  token: userKeyPattern.token.required(),
  name: userKeyPattern.name.required(),
});

const updatePassword = joi.object({
  token: userKeyPattern.token.required(),
  oldPassword: userKeyPattern.password.required(),
  newPassword: userKeyPattern.password.required(),
  cNewPassword: userKeyPattern.cPassword('newPassword').required(),
});

const deleteProfile = joi.object({
  token: userKeyPattern.token.required(),
  id: userKeyPattern.id,
});

const getAllUsers = joi.object({
  token: userKeyPattern.token.required(),
});

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
  getAllUsers,
};
