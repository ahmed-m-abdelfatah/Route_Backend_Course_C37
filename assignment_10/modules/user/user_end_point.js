const { roles } = require('../../middleware/auth_ql.js');

const endPoint = {
  getProfile: [roles.user, roles.admin],
  updateProfile: [roles.user, roles.admin],
  updatePassword: [roles.user, roles.admin],
  deleteProfile: [roles.user, roles.admin],
  getAllUsers: [roles.admin],
};

module.exports = endPoint;
