const { blogKeyPattern } = require('../../utils/joi_key_pattern.js');
const joi = require('joi');

const addBlog = joi.object({
  token: blogKeyPattern.token.required(),
  title: blogKeyPattern.title.required(),
  desc: blogKeyPattern.desc.required(),
  price: blogKeyPattern.price.required(),
});

const deleteBlog = joi.object({
  token: blogKeyPattern.token.required(),
  id: blogKeyPattern.id.required(),
});

const updateBlog = joi.object({
  token: blogKeyPattern.token.required(),
  id: blogKeyPattern.id.required(),
  title: blogKeyPattern.title.required(),
  desc: blogKeyPattern.desc.required(),
  price: blogKeyPattern.price.required(),
});

const addPics = {
  body: joi.object().required().keys({
    id: blogKeyPattern.id.required(),
  }),
};

module.exports = {
  addBlog,
  deleteBlog,
  updateBlog,
  addPics,
};
