const { userKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const changeRole = {
  body: Joi.object().required().keys({
    role: userKeyPattern.role.required(),
  }),
  params: Joi.object().required().keys({
    id: userKeyPattern.id.required(),
  }),
};

const blockUser = {
  params: Joi.object().required().keys({
    id: userKeyPattern.id.required(),
  }),
};

const deleteUser = {
  params: Joi.object().required().keys({
    id: userKeyPattern.id.required(),
  }),
};

module.exports = {
  changeRole,
  blockUser,
  deleteUser,
};
