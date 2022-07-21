const { roles } = require('../../middleware/auth.js');

const getProfileMessages = {
  getProfileMessages: [roles.Admin, roles.user],
  deleteMessages: [roles.user],
};

module.exports = getProfileMessages;
