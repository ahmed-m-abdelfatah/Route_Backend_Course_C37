const userRouter = require('./User/user_router.js');
const authRouter = require('./auth/auth_router.js');
const administrationRouter = require('./administration/admin_router.js');

module.exports = {
  userRouter,
  authRouter,
  administrationRouter,
};
