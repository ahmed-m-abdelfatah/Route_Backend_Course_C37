const validation = require('../../middleware/validation.js');
const messageValidationSchema = require('./message_validation_schema.js');
const messageController = require('./message_controller.js');
const messageEndPoint = require('./message_end_point.js');
const { auth } = require('../../middleware/auth.js');

const router = require('express').Router();

router.post(
  '/message/:id',
  validation(messageValidationSchema.sendMessageValidationSchema),
  messageController.sendMessage,
);
router.get('/messages', auth(messageEndPoint.getProfileMessages), messageController.getProfileMessages);
router.delete(
  '/message/:id',
  validation(messageValidationSchema.deleteMessageValidationSchema),
  auth(messageEndPoint.deleteMessages),
  messageController.deleteMessage,
);

module.exports = router;
