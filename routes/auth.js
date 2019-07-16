const express = require('express'),
      router = express.Router(),
      authController = require('../controller/authController');

// local-login
router.post('/local-login', (req, res, next) => {
  authController.localLogin(req, res, next)
})

router.post('/logout', (req, res, next) => {
  authController.logout(req, res, next);
})

module.exports = router;