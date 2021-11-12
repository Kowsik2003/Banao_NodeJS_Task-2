const express = require('express');

const userCtrl = require('../controller/userCtrl');

const router = express.Router();

router.post('/login',userCtrl.loginUser);
router.post('/register',userCtrl.registerUser);

router.post('/reset',userCtrl.resetmail);
router.post('/reset/:resetToken',userCtrl.resetPassword);

module.exports = router;