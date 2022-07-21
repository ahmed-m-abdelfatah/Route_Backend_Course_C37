const {
  userSignup,
  userSignin,
  userUpdate,
  userDelete,
  getAllUsers,
  getAllUsersWithQueryParams,
  getUserById,
  getAllUsersWithAgeBetween,
  getAllUsersWithNameStartWithAAndAgeLessThan30,
} = require('./users.controller.js');

const usersRouter = require('express').Router();

usersRouter.post('/users/signup', userSignup);
usersRouter.post('/users/signin', userSignin);
usersRouter.patch('/users/update/:id', userUpdate);
usersRouter.delete('/users/delete/:id', userDelete);
usersRouter.get('/users/all', getAllUsers);
usersRouter.get('/users', getAllUsersWithQueryParams);
usersRouter.get('/users/user', getUserById);
usersRouter.get('/users/between', getAllUsersWithAgeBetween);
usersRouter.get(
  '/users/between-v2',
  getAllUsersWithNameStartWithAAndAgeLessThan30,
);

module.exports = usersRouter;
