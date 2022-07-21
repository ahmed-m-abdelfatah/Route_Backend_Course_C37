const { roles } = require('../../middleware/auth.js');

const endPoint = {
  addComment: [roles.user],
  updateComment: [roles.user],
  deleteComment: [roles.user, roles.Admin],
  likeComment: [roles.user],
  addReply: [roles.user],
};

module.exports = endPoint;
