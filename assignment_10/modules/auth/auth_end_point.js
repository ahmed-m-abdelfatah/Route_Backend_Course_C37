const { roles } = require('../../middleware/auth_ql.js');

const endPoint = {
  getProfile: [roles.user, roles.admin],
};

module.exports = endPoint;
