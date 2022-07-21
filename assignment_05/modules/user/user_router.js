const auth = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const { signup, signin, update, displayAllUsers, deleteUser, getUserById } = require('./user_controller.js');
const {
  signinValidationSchema,
  signupValidationSchema,
  updateValidationSchema,
  getUserByIdSchema,
} = require('./user_validation_schema.js');

const userRouter = require('express').Router();

userRouter.post('/signup', validation(signupValidationSchema), signup);
userRouter.post('/signin', validation(signinValidationSchema), signin);
userRouter.patch('/update', validation(updateValidationSchema), auth(), update);
userRouter.delete('/delete', auth(), deleteUser);
userRouter.get('/allUsers', displayAllUsers);
userRouter.get('/user/:id', validation(getUserByIdSchema), getUserById);

module.exports = userRouter;
