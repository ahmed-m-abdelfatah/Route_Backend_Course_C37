const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./comment_end_point.js');
const validators = require('./comment_validation_schema.js');
const controller = require('./comment_controller.js');

// add comment
router.post('/add', validation(validators.addComment), auth(endPoint.addComment), asyncHandler(controller.addComment));

// update comment
router.patch(
  '/update/:id',
  validation(validators.updateComment),
  auth(endPoint.updateComment),
  asyncHandler(controller.updateComment),
);

// delete comment
router.patch('/delete/:id', auth(endPoint.deleteComment), asyncHandler(controller.deleteComment));

// like unlike comment
router.patch('/like/:id', auth(endPoint.likeComment), asyncHandler(controller.likeComment));

// add reply
router.post(
  '/reply/:postId/:commentId',
  validation(validators.addReply),
  auth(endPoint.addReply),
  asyncHandler(controller.addReply),
);

module.exports = router;
