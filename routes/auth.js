const express = require('express'),
      router = express.Router(),
      authController = require('../controller/auth-controller');

// local-login
router.post('/local-login', authController.localLogin);

router.get('/google-login', authController.googleLogin);

router.get('/google-login/callback', authController.googleLoginCallback);

router.get('/google-register', authController.googleRegister);

router.get('/google-register/callback', authController.googleRegisterCallback);

router.post('/logout', authController.logout);

router.get('/resetpassword', authController.resetPassword);

module.exports = router;