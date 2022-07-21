const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./user_end_point.js');
const validators = require('./user_validation_schema.js');
const controller = require('./user_controller.js');
const {
  multerUpload,
  uploadFilePath,
  uploadFileValidation,
  handelMulterError,
} = require('../../services/multer_upload.js');

// display profile
router.get('/profile', auth(endPoint.displayProfile), asyncHandler(controller.displayProfile));

// update profile
router.patch(
  '/profile/update',
  validation(validators.updateProfile),
  auth(endPoint.updateProfile),
  asyncHandler(controller.updateProfile),
);

// update password
router.patch(
  '/profile/password',
  validation(validators.updatePassword),
  auth(endPoint.updatePassword),
  asyncHandler(controller.updatePassword),
);

// Delete user
router.delete('/profile/delete', auth(endPoint.deleteUser), asyncHandler(controller.deleteUser));

// update profile pic
router.patch(
  '/profile/pic',
  auth(endPoint.updateProfilePic),
  multerUpload(uploadFilePath.profilePic, uploadFileValidation.image).array('image', 2),
  handelMulterError,
  asyncHandler(controller.updateProfilePic),
);

// update profile cover pic
router.patch(
  '/profile/coverPic',
  auth(endPoint.updateProfileCoverPic),
  multerUpload(uploadFilePath.coverPic, uploadFileValidation.image).single('image'),
  handelMulterError,
  asyncHandler(controller.updateProfileCoverPic),
);

// profile to qr code
router.get('/profile/qr', auth(endPoint.qr), controller.qr);

// deactivate profile
router.post('/profile/deActive', auth(endPoint.deActive), controller.deActive);

// Get all users
router.get('/get-all-users', auth(endPoint.getAllUsers), asyncHandler(controller.getAllUsers));

module.exports = router;
