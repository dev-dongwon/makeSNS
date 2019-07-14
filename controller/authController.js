const passport = require('passport');
require('../model/passport').setup()

const authController = {
  local : passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/signin',
      failureFlash : true,
      successFlash : true,
    })
}

module.exports = authController;