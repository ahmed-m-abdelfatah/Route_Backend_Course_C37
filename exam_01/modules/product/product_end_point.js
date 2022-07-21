const { roles } = require('../../middleware/auth.js');

const endPoint = {
  addProduct: [roles.user],
  updateProduct: [roles.user],
  deleteProduct: [roles.user, roles.Admin],
  softDeleteProduct: [roles.user, roles.Admin],
  likeProduct: [roles.user],
  addToWishlist: [roles.user],
  hideProduct: [roles.user],
};

module.exports = endPoint;
