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

// soft delete user
router.patch(
  '/user/:id/soft-delete',
  validation(validators.softDeleteUser),
  auth(endPoint.softDeleteUser),
  asyncHandler(controller.softDeleteUser),
);

// delete product
router.delete(
  '/product/:id/delete',
  validation(validators.deleteProduct),
  auth(endPoint.deleteProduct),
  asyncHandler(controller.deleteProduct),
);

// soft delete product
router.patch(
  '/product/:id/soft-delete',
  validation(validators.softDeleteProduct),
  auth(endPoint.softDeleteProduct),
  asyncHandler(controller.softDeleteProduct),
);

// soft delete comment
router.patch(
  '/comment/:id/soft-delete',
  validation(validators.softDeleteComment),
  auth(endPoint.softDeleteComment),
  asyncHandler(controller.softDeleteComment),
);

module.exports = router;
