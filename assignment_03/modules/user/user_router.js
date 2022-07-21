const {
  userSignup,
  userSignin,
  updateUser,
  deleteUser,
  displayAllUsers,
  displayAllUsersStartWithAAndAgeGreaterThan30,
  displayAllWithFirstNameOrLastNameContainA,
} = require('./user_controller.js');

const userRouter = require('express').Router();

// Start add routes to our userRouter
userRouter.post('/users/signup', userSignup);
userRouter.post('/users/signin', userSignin);
userRouter.put('/users/update/:id', updateUser);
userRouter.delete('/users/delete/:id', deleteUser);
userRouter.get('/users/all', displayAllUsers);
userRouter.get('/users/special-1', displayAllUsersStartWithAAndAgeGreaterThan30);
userRouter.get('/users/special-2', displayAllWithFirstNameOrLastNameContainA);

module.exports = userRouter;
