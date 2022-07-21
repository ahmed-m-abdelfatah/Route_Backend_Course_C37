const { roles } = require('../../middleware/auth.js');

const endPoint = {
  logout: [roles.user],
};

module.exports = endPoint;
