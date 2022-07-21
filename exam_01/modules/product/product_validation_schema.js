const { productKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const addProduct = {
  body: Joi.object().required().keys({
    productTitle: productKeyPattern.productTitle.required(),
    productDesc: productKeyPattern.productDesc.required(),
    productPrice: productKeyPattern.productPrice.required(),
  }),
};

const updateProduct = {
  body: Joi.object().required().keys({
    productTitle: productKeyPattern.productTitle.required(),
    productDesc: productKeyPattern.productDesc.required(),
    productPrice: productKeyPattern.productPrice.required(),
  }),

  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
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

const likeProduct = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

const addToWishlist = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

const hideProduct = {
  params: Joi.object().required().keys({
    id: productKeyPattern.id.required(),
  }),
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  likeProduct,
  addToWishlist,
  hideProduct,
};
