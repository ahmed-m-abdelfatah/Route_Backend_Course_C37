const { postKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const addPost = {
  body: Joi.object().required().keys({
    postContent: postKeyPattern.postContent.required(),
  }),
};

const updatePost = {
  body: Joi.object().required().keys({
    postContent: postKeyPattern.postContent.required(),
  }),
};

module.exports = {
  addPost,
  updatePost,
};
