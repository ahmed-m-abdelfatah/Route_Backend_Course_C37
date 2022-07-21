const auth = require('../../auth/auth.js');
const { signup, signin, update, displayAllUsers, deleteUser, userProfile } = require('./user_controller.js');

const router = require('express').Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.patch('/update/:id', update);
router.get('/allUsers', displayAllUsers);
router.delete('/delete/:id', deleteUser);
router.get('/user/profile', auth(), userProfile);

module.exports = router;
