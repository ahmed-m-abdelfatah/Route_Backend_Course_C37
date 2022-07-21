const { roles } = require('../../middleware/auth.js');

const endPoint = {
  profile: [roles.Admin, roles.user],
  updateProfile: [roles.user],
  updateProfilePic: [roles.user],
  updateProfileCoverPic: [roles.user],
};

module.exports = endPoint;
