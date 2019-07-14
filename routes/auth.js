const express = require('express'),
      router = express.Router(),
      autoController = require('../controller/authController');

// local-login
router.post('/local', autoController.local)

module.exports = router;