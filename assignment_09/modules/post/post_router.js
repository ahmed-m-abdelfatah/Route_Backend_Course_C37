const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./post_end_point.js');
const validators = require('./post_validation_schema.js');
const controller = require('./post_controller.js');
const {
  multerUpload,
  uploadFilePath,
  uploadFileValidation,
  handelMulterError,
} = require('../../services/multer_upload.js');

// add post
router.post(
  '/add',
  multerUpload(uploadFilePath.postPic, uploadFileValidation.image, 1024 * 1024 * 5).array('postPics', 5),
  validation(validators.addPost),
  auth(endPoint.addPost),
  handelMulterError,
  asyncHandler(controller.addPost),
);

// update post
router.patch(
  '/update/:id',
  multerUpload(uploadFilePath.postPic, uploadFileValidation.image, 1024 * 1024 * 5).array('postPics', 5),
  validation(validators.updatePost),
  auth(endPoint.updatePost),
  handelMulterError,
  asyncHandler(controller.updatePost),
);

// delete post
router.patch('/delete/:id', auth(endPoint.deletePost), asyncHandler(controller.deletePost));

// like unlike post
router.patch('/like/:id', auth(endPoint.likePost), asyncHandler(controller.likePost));

module.exports = router;
