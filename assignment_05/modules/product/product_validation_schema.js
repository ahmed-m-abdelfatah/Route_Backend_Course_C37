const joi = require('joi');

const addProductValidationSchema = {
  body: joi
    .object()
    .required()
    .keys({
      title: joi.string().min(3).max(20).required(),
      description: joi.string().min(3).max(20).required(),
      price: joi.number().min(0).max(99999).required(),
    }),
};

const updateProductValidationSchema = {
  body: joi
    .object()
    .required()
    .keys({
      productId: joi.string().min(24).max(24).required(),
      title: joi.string().min(3).max(20),
      description: joi.string().min(3).max(20),
      price: joi.number().min(0).max(99999),
    }),
};

module.exports = {
  addProductValidationSchema,
  updateProductValidationSchema,
};
