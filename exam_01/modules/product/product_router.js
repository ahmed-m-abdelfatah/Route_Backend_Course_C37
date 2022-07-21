const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { auth } = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const endPoint = require('./product_end_point.js');
const validators = require('./product_validation_schema.js');
const controller = require('./product_controller.js');

// add product
router.post('/add', validation(validators.addProduct), auth(endPoint.addProduct), asyncHandler(controller.addProduct));

// update product
router.patch(
  '/:id/update',
  validation(validators.updateProduct),
  auth(endPoint.updateProduct),
  asyncHandler(controller.updateProduct),
);

// soft delete product
router.delete(
  '/:id/delete',
  validation(validators.deleteProduct),
  auth(endPoint.deleteProduct),
  asyncHandler(controller.deleteProduct),
);

// soft delete product
router.patch(
  '/:id/soft-delete',
  validation(validators.softDeleteProduct),
  auth(endPoint.softDeleteProduct),
  asyncHandler(controller.softDeleteProduct),
);

// like unlike product
router.patch(
  '/:id/like',
  validation(validators.likeProduct),
  auth(endPoint.likeProduct),
  asyncHandler(controller.likeProduct),
);

// add product to wishlist
router.patch(
  '/:id/wishlist',
  validation(validators.addToWishlist),
  auth(endPoint.addToWishlist),
  asyncHandler(controller.addToWishlist),
);

// hide product
router.patch(
  '/:id/hide',
  validation(validators.hideProduct),
  auth(endPoint.hideProduct),
  asyncHandler(controller.hideProduct),
);

module.exports = router;
