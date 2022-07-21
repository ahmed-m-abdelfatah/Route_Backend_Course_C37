const { messageKeyPattern } = require('../../utils/joi_key_pattern.js');
const Joi = require('joi');

const sendMessageValidationSchema = {
  body: Joi.object().required().keys({
    messageBody: messageKeyPattern.messageBody.required(),
    senderId: messageKeyPattern.id,
  }),
  params: Joi.object().required().keys({
    id: messageKeyPattern.id.required(),
  }),
};

const deleteMessageValidationSchema = {
  params: Joi.object().required().keys({
    id: messageKeyPattern.id.required(),
  }),
};

module.exports = {
  sendMessageValidationSchema,
  deleteMessageValidationSchema,
};
