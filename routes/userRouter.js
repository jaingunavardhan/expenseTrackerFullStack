const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/signup', userController.postUser);
router.post('/login', userController.postLogin);
router.get('/', userController.getUsers);

module.exports = router;