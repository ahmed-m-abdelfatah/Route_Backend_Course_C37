const auth = require('../../auth/auth.js');
const {
  signup,
  signin,
  update,
  displayAllUsers,
  deleteUser,
  userProfile,
  getUserById,
  softDeleteUser,
} = require('./user_controller.js');

const userRouter = require('express').Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.patch('/update', auth(), update);
userRouter.get('/allUsers', displayAllUsers);
userRouter.delete('/delete', auth(), deleteUser);
userRouter.get('/user/profile', auth(), userProfile);
userRouter.get('/user/:id', getUserById);
userRouter.patch('/softDeleteUser/:id', softDeleteUser);

module.exports = userRouter;
