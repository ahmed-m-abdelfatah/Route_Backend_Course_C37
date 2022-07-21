const { commentKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const addComment = {
  body: Joi.object().required().keys({
    commentBody: commentKeyPattern.commentContent.required(),
    productId: commentKeyPattern.productId.required(),
  }),
};

const addReply = {
  body: Joi.object().required().keys({
    replyContent: commentKeyPattern.commentContent.required(),
  }),

  params: Joi.object().required().keys({
    commentId: commentKeyPattern.commentId.required(),
    productId: commentKeyPattern.productId.required(),
  }),
};

const updateComment = {
  body: Joi.object().required().keys({
    commentBody: commentKeyPattern.commentContent.required(),
  }),

  params: Joi.object().required().keys({
    id: commentKeyPattern.commentId.required(),
  }),
};

const deleteComment = {
  params: Joi.object().required().keys({
    id: commentKeyPattern.commentId.required(),
  }),
};

const likeComment = {
  params: Joi.object().required().keys({
    id: commentKeyPattern.commentId.required(),
  }),
};

module.exports = {
  addComment,
  addReply,
  updateComment,
  deleteComment,
  likeComment,
};
