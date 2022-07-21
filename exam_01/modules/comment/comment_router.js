const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./comment_end_point.js');
const validators = require('./comment_validation_schema.js');
const controller = require('./comment_controller.js');

// add comment
router.post('/add', validation(validators.addComment), auth(endPoint.addComment), asyncHandler(controller.addComment));

// add reply
router.post(
  '/:commentId/:productId/reply',
  validation(validators.addReply),
  auth(endPoint.addReply),
  asyncHandler(controller.addReply),
);

// update comment
router.patch(
  '/:id/update',
  validation(validators.updateComment),
  auth(endPoint.updateComment),
  asyncHandler(controller.updateComment),
);

// delete comment
router.delete(
  '/:id/delete',
  validation(validators.deleteComment),
  auth(endPoint.deleteComment),
  asyncHandler(controller.deleteComment),
);

// like unlike comment
router.patch(
  '/:id/like',
  validation(validators.likeComment),
  auth(endPoint.likeComment),
  asyncHandler(controller.likeComment),
);

module.exports = router;
