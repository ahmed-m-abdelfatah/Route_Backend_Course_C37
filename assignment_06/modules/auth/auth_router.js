const validation = require('../../middleware/validation.js');
const authValidationSchema = require('./auth_validation_schema.js');
const authController = require('./auth_controller.js');

const router = require('express').Router();

router.post('/signup', validation(authValidationSchema.signupValidationSchema), authController.signup);
router.post('/signin', validation(authValidationSchema.signinValidationSchema), authController.signin);

module.exports = router;
