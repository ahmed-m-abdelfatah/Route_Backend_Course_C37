const { roles } = require('../../middleware/auth.js');

const endPoint = {
  displayProfile: [roles.Admin, roles.user, roles.HR],
  updateProfile: [roles.user],
  updatePassword: [roles.Admin, roles.user, roles.HR],
  updateProfilePic: [roles.user],
  updateProfileCoverPic: [roles.user],
  qr: [roles.user],
  deActive: [roles.user],
};

module.exports = endPoint;
