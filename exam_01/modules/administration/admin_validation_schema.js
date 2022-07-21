const { userKeyPattern, productKeyPattern } = require('../../utils/joi_key_pattern.js');
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

const softDeleteUser = {
  params: Joi.object().required().keys({
    id: userKeyPattern.id.required(),
  }),
};

const deleteProduct = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

const softDeleteProduct = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

const softDeleteComment = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

module.exports = {
  changeRole,
  blockUser,
  deleteUser,
  softDeleteUser,
  deleteProduct,
  softDeleteProduct,
  softDeleteComment,
};
