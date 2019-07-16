const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

require('../auth/passport').setup()

const authController = {
  localLogin: (req, res, next) => {
    passport.authenticate('local-login', {
      session : false
    }, async (err, user, info) => {
      try {
        if (err || !user) {
          req.flash('INFO',info.message)
          return res.redirect('/signin')
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)
          const body = {
            _id: user._id,
            email: user.email
          };

          const token = jwt.sign({ user: body }, config.jwtSecret);
          res.cookie('token', token, {
            httpOnly : true,
            expires : new Date(Date.now()+ 900000)
          });
          req.flash('INFO',info.message)
          return res.redirect('/');
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next)
  }
}

module.exports = authController;