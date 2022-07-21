const {
  displayAllUsers,
  displayUserProfile,
} = require('./controller/displayUsers.js');
const { userSignup, userSignin } = require('./controller/registration.js');

const userRouter = require('express').Router();

// Start add routes to our userRouter
userRouter.post('/users/signup', userSignup);
userRouter.post('/users/signin', userSignin);
userRouter.get('/users/all', displayAllUsers);
userRouter.get('/users/profile/:id', displayUserProfile);

module.exports = userRouter;
