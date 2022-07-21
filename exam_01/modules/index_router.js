const authRouter = require('./auth/auth_router.js');
const userRouter = require('./user/user_router.js');
const productRouter = require('./product/product_router.js');
const commentRouter = require('./comment/comment_router.js');
const administrationRouter = require('./administration/admin_router.js');

module.exports = {
  userRouter,
  authRouter,
  productRouter,
  commentRouter,
  administrationRouter,
};
