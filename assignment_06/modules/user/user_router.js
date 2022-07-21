const { auth } = require('../../middleware/auth.js');
const userEndPoint = require('./user_endPoint.js');
const userController = require('./user_controller.js');
const validation = require('../../middleware/validation.js');
const userValidationSchema = require('./user_validation_schema.js');

const router = require('express').Router();

router.get('/profile', auth(userEndPoint.profile), userController.displayProfile);
router.patch(
  '/profile',
  validation(userValidationSchema.updateProfileValidationSchema),
  auth(userEndPoint.updateProfile),
  userController.updateProfile,
);

module.exports = router;
