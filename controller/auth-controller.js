const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config()

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
            username : user.username,
            email: user.email
          };

          const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
          res.cookie('token', token, {
            httpOnly : true,
            maxAge: 1000 * 60 * 10
          });
          req.flash('INFO',info.message)
          return res.redirect('/');
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next)
  },

  logout : (req, res, next) => {
    res.clearCookie('token', { path: '/' })
    return res.redirect('/');
  },

  resetPassword : (req, res, next) => {
    const token = req.query.token;
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.address) {
      req.flash('message', '올바르지 않은 접근 경로입니다');
      return res.redirect('/');
    }

    res.render('resetpassword', {
      title: 'Reset password | Daily Frame',
      email: decodedToken.address,
      token: token
    });
  }
}

module.exports = authController;