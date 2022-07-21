const { roles } = require('../../middleware/auth.js');

const endPoint = {
  addComment: [roles.user],
  addReply: [roles.user],
  updateComment: [roles.user],
  deleteComment: [roles.user],
  likeComment: [roles.user],
};

module.exports = endPoint;
