const express = require('express');
const passwordController = require('../controllers/passwordController');

const router = express.Router();

router.post('/forgotpassword', passwordController.postForgotPassword);
router.get('/updatepassword/:resetID', passwordController.getUpdatePassword)
router.get('/resetpassword/:resetID', passwordController.getResetPassword);

module.exports = router;