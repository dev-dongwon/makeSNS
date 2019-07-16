const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config/index');
const User = require('../model/user');

exports.setup = () => {
  passport.use('local-login', new LocalStrategy({
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    }, async (usernameOrEmail, password, done) => {
      try {
        const user = await User.findOne().or([{ username : usernameOrEmail }, { email : usernameOrEmail}]);
        
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
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
        const existEmail = await User.findOne({ email });
        const existUsername = await User.findOne({ 'username' : req.body.username });
        
        if (existEmail) {
          return done(null, false, {message : '같은 이메일 주소가 존재합니다'});
        }

        if (existUsername) {
          return done(null, false, {message : '같은 유저 이름이 존재합니다'});
        }

        const user = await User.create({ "username" : req.body.username, email, password });
        return done(null, user, { message :  `${user.username} is Joined Successfully`});
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