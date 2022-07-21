const { roles } = require('../../middleware/auth.js');

const endPoint = {
  getAllUsers: [roles.Admin],
  changeRoles: [roles.Admin],
  blockUser: [roles.Admin],
  deleteUser: [roles.Admin],
  softDeleteUser: [roles.Admin],
  deleteProduct: [roles.Admin],
  softDeleteProduct: [roles.Admin],
  softDeleteComment: [roles.Admin],
};

module.exports = endPoint;
