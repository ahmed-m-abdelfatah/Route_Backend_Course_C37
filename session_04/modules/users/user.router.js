const router = require('express').Router();

const { displayUserPage } = require('./controller/userPage.js');
const { signup } = require('./controller/signup.js');
const { signin } = require('./controller/signin.js');
const { update } = require('./controller/update.js');
const { getAllUsers } = require('./controller/getAllUsers.js');
const { deleteUser } = require('./controller/deleteUser.js');
const { searchUsers } = require('./controller/searchUsers.js');

router.get('/user', displayUserPage);
router.post('/user/signup', signup);
router.post('/user/signin', signin);
router.patch('/user/update/:id', update);
router.get('/user/all', getAllUsers);
router.delete('/user/delete/:id', deleteUser);
router.get('/user/search', searchUsers);

module.exports = router;
