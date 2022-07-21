const userRouter = require('./User/user_router.js');
const authRouter = require('./auth/auth_router.js');
const postRouter = require('./post/post_router.js');
const commentRouter = require('./comment/comment_router.js');
const administrationRouter = require('./administration/admin_router.js');

module.exports = {
  userRouter,
  authRouter,
  postRouter,
  commentRouter,
  administrationRouter,
};
