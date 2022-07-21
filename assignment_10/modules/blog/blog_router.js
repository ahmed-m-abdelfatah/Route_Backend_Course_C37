const router = require('express').Router();
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./blog_end_point.js');
const validators = require('./blog_validation_schema.js');
const controller = require('./blog_controller.js');
const {
  multerUpload,
  uploadFilePath,
  uploadFileValidation,
  handelMulterError,
} = require('../../services/multer_upload.js');

// add pics to blog
router.patch(
  '/add-pics',
  auth(endPoint.addPics),
  multerUpload(uploadFilePath.blogPic, uploadFileValidation.image).array('image', 5),
  handelMulterError,
  validation(validators.addPics),
  controller.addPics,
);

module.exports = router;
