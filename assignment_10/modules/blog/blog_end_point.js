const { roles } = require('../../middleware/auth_ql.js');

const endPoint = {
  // [ ] remove admins
  addBlog: [roles.user, roles.admin],
  deleteBlog: [roles.user, roles.admin],
  updateBlog: [roles.user, roles.admin],
  addPics: [roles.user, roles.admin],
};

module.exports = endPoint;
