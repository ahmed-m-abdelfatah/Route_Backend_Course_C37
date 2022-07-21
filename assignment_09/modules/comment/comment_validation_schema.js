const { commentKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const addComment = {
  body: Joi.object().required().keys({
    postId: commentKeyPattern.postId.required(),
    commentContent: commentKeyPattern.commentContent.required(),
  }),
};

const updateComment = {
  body: Joi.object().required().keys({
    commentContent: commentKeyPattern.commentContent.required(),
  }),
  params: Joi.object().required().keys({
    id: commentKeyPattern.postId.required(),
  }),
};

const addReply = {
  body: Joi.object().required().keys({
    replyContent: commentKeyPattern.commentContent.required(),
  }),
  params: Joi.object().required().keys({
    postId: commentKeyPattern.postId.required(),
    commentId: commentKeyPattern.commentId.required(),
  }),
};

module.exports = {
  addComment,
  updateComment,
  addReply,
};
