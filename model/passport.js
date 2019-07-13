const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user');

exports.setup = () => {
  passport.use('local-login', new LocalStrategy({
      usernameField: 'id',
      passwordField: 'password',
      passReqToCallback : true
    }, (req, id, password, done) => {
      User.findOne({
        id: id
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message : 'invaild username or password'});
        }
        if (!user.validPassword(password)) {
          return done(null, false, {message : 'invaild username or password'});
        }
        return done(null, user, {message : `${user.id}님, 환영합니다!`});
      })
    }
  )),

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}