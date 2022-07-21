const { roles } = require('../../middleware/auth.js');

const endPoint = {
  addPost: [roles.user],
  updatePost: [roles.user],
  deletePost: [roles.user, roles.Admin],
  likePost: [roles.user],
};

module.exports = endPoint;
