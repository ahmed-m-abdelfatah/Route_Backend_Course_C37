const router = require('express').Router();
const validation = require('../../middleware/validation.js');
const validators = require('./auth_validation_schema.js');
const controller = require('./auth_controller.js');

// confirm Email
router.get('/confirmEmail/:token', validation(validators.confirmEmail), controller.confirmEmail);

//resend email token
router.get('/reSendToken/:id', controller.confirmEmailResendToken);

module.exports = router;
