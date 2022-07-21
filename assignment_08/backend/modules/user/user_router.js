const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const endPoint = require('./user_end_point.js');
const validators = require('./user_validation_schema.js');
const controller = require('./user_controller.js');
const validation = require('../../middleware/validation.js');
const {
  multerUpload,
  uploadFilePath,
  uploadFileValidation,
  handelMulterError,
} = require('../../services/multer_upload.js');

// display profile
router.get('/profile', auth(endPoint.displayProfile), asyncHandler(controller.displayProfile));
// FIXME update profile
router.patch(
  '/profile/update',
  validation(validators.updateProfile),
  auth(endPoint.updateProfile),
  asyncHandler(controller.updateProfile),
);
// upload password
router.patch(
  '/profile/password',
  validation(validators.updatePassword),
  auth(endPoint.updatePassword),
  asyncHandler(controller.updatePassword),
);
// update profile pic
router.patch(
  '/profile/pic',
  auth(endPoint.updateProfilePic),
  multerUpload(uploadFilePath.profilePic, uploadFileValidation.image).single('image'),
  handelMulterError,
  asyncHandler(controller.updateProfilePic),
);
// update profile cover pic
router.patch(
  '/profile/coverPic',
  auth(endPoint.updateProfileCoverPic),
  multerUpload(uploadFilePath.coverPic, uploadFileValidation.image).array('image', 5),
  handelMulterError,
  asyncHandler(controller.updateProfileCoverPic),
);
// profile to qr code
router.get('/profile/qr', auth(endPoint.qr), controller.qr);
// profile to qr code
router.post('/profile/deActive', auth(endPoint.deActive), controller.deActive);

module.exports = router;
