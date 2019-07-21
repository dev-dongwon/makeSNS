const express = require('express'),
      router = express.Router(),
      apiController = require('../controller/api-controller');

router.post('/forgotpassword', (req, res, next) => {
  apiController.sendPasswordCheckEmail(req, res, next);
})

router.patch('/resetpassword', (req, res, next) => {
  apiController.resetPassword(req, res, next);
})

module.exports = router;