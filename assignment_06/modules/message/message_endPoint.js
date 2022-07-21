const { roles } = require('../../middleware/auth.js');

const getProfileMessages = {
  getProfileMessages: [roles.Admin, roles.user],
  deleteMessages: [roles.Admin, roles.user],
};

module.exports = getProfileMessages;
