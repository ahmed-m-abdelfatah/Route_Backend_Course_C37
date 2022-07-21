const { roles } = require('../../middleware/auth.js');

const endPoint = {
  displayProfile: [roles.Admin, roles.user],
  updateProfile: [roles.user],
  updatePassword: [roles.Admin, roles.user],
  updateProfilePic: [roles.user],
  updateProfileCoverPic: [roles.user],
  qr: [roles.user],
  deActive: [roles.user],
  deleteUser: [roles.user],
  getAllUsers: [roles.user],
};

module.exports = endPoint;
