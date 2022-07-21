const userRouter = require('./User/user_router.js');
const messageRouter = require('./message/message_router.js');
const authRouter = require('./auth/auth_router.js');

module.exports = {
  userRouter,
  messageRouter,
  authRouter,
};
