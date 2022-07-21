const { roles } = require('../../middleware/auth.js');

const endPoint = {
  getAllUsers: [roles.Admin],
  changeRoles: [roles.Admin],
  blockUser: [roles.Admin, roles.HR],
  deleteUser: [roles.Admin],
};

module.exports = endPoint;
