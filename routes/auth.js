const express = require('express'),
      router = express.Router(),
      authController = require('../controller/authController');

// local-login
router.post('/local-login', (req, res) => authController.localLogin(req, res))

module.exports = router;