const { auth } = require('../../middleware/auth.js');
const userEndPoint = require('./user_end_point.js');
const userController = require('./user_controller.js');
const validation = require('../../middleware/validation.js');
const userValidationSchema = require('./user_validation_schema.js');
const { multerUpload, uploadFilePath, uploadFileValidation } = require('../../services/multer_upload.js');

const router = require('express').Router();

router.get('/profile', auth(userEndPoint.profile), userController.displayProfile);
router.patch(
  '/profile',
  validation(userValidationSchema.updateProfileValidationSchema),
  auth(userEndPoint.updateProfile),
  userController.updateProfile,
);
router.patch(
  '/profile/pic',
  auth(userEndPoint.updateProfilePic),
  multerUpload(uploadFilePath.profilePic, uploadFileValidation.image).single('image'),
  userController.updateProfilePic,
);
router.patch(
  '/profile/coverPic',
  auth(userEndPoint.updateProfileCoverPic),
  multerUpload(uploadFilePath.coverPic, uploadFileValidation.image).array('image', 5),
  userController.updateProfileCoverPic,
);

// Handel errors
router.use(function (err, req, res, next) {
  switch (true) {
    case err.code === 'LIMIT_FILE_SIZE': {
      // multer upload file size limit
      return res.status(400).json({ message: 'File size is too big' }); // 400 Bad Request
    }

    default:
      return;
  }
});

module.exports = router;
