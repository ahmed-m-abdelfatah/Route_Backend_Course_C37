const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const endPoint = require('./admin_end_point.js');
const validators = require('./admin_validation_schema.js');
const controller = require('./admin_controller.js');
const validation = require('../../middleware/validation.js');

// get all users
router.get('/users', auth(endPoint.getAllUsers), asyncHandler(controller.getAllUsers));
// change roles
router.patch(
  '/user/:id/role',
  validation(validators.changeRole),
  auth(endPoint.changeRoles),
  asyncHandler(controller.changeRole),
);
// block user
router.patch(
  '/user/:id/block',
  validation(validators.blockUser),
  auth(endPoint.blockUser),
  asyncHandler(controller.blockUser),
);
// delete user
router.delete(
  '/user/:id/delete',
  validation(validators.deleteUser),
  auth(endPoint.deleteUser),
  asyncHandler(controller.deleteUser),
);

module.exports = router;
