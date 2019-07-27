const passport = require('passport');
const jwt = require('jsonwebtoken');
const googleAuthApi = require('../auth/googleapis');
const User = require('../model/user');

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
            username : user.username || user.email,
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

  googleLogin : (req, res, next) => {
    return res.redirect(googleAuthApi.url)
  },

  googleLoginCallback : async (req, res, next) => {
    const code = req.query.code;
    const {tokens} = await googleAuthApi.oauth2Client.getToken(code);
    googleAuthApi.oauth2Client.setCredentials(tokens);

    const plus = googleAuthApi.getGooglePlusApi(googleAuthApi.oauth2Client);
    const me = await plus.people.get({ userId: 'me' });

    const email = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    const user = await User.findOne({ 'auth.googleId' : email });

    if(!user) {
      return res.redirect('/signup')
    }

      req.user = user;
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
      res.cookie('token', token, {
        httpOnly : true,
        maxAge: 1000 * 60 * 10
      });
      res.redirect('/')
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