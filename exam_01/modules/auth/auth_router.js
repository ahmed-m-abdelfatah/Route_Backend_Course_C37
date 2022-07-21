const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./auth_end_point.js');
const validators = require('./auth_validation_schema.js');
const controller = require('./auth_controller.js');

// signup
router.post('/signup', validation(validators.signup), asyncHandler(controller.signup));

// confirm Email
router.get('/confirmEmail/:token', validation(validators.confirmEmail), asyncHandler(controller.confirmEmail));

//resend email token
router.get('/reSendToken/:id', asyncHandler(controller.confirmEmailResendToken));

// login
router.post('/login', validation(validators.login), asyncHandler(controller.login));

// logout
router.post('/logout', auth(endPoint.logout), asyncHandler(controller.logout));

// forget password request
router.post('/sendCode', asyncHandler(controller.forgetPasswordSendCode));

// forget password
router.patch('/forgetPassword', validation(validators.forgetPassword), asyncHandler(controller.forgetPassword));

module.exports = router;
