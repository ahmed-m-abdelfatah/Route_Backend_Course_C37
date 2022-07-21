const { signup } = require('./user_controller.js');

const router = require('express').Router();

router.post('/signup', signup);

module.exports = router;
