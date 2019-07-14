const express = require('express');
const passport = require('passport');
const router = express.Router();

require('../model/passport').setup()

// local-login
router.post('/local', passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/signin',
  failureFlash : true,
  successFlash : true,
}))

module.exports = router;