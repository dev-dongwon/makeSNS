const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config/index');
const User = require('../model/user');

exports.setup = () => {
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {message : 'invaild username or password'});
        }
        if (!await user.isValidPassword(password)) {
          return done(null, false, {message : 'invaild username or password'});
        }
        return done(null, user, { message : 'Logged in Successfully'});
      } catch (error) {
        return done(error);
      }
    }
  )),

  passport.use('signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
  }, async (email, password, done) => {
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
          return done(null, false, {message : 'member Exist'});
        }
        const user = await User.create({ email, password });
        return done(null, user);
      } catch (error) {
        done(error);
      }
  })),

  passport.use('jwt', new JwtStrategy({
    secretOrKey : config.jwtSecret,
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
  }, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }))
}