const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../model/user');
const User = require('../model/User');
const pool = require('../db/connect-mysql').pool;
require('dotenv').config()

exports.setup = () => {
  // local 로그인
  passport.use('local-login', new LocalStrategy({
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    }, async (usernameOrEmail, password, done) => {
      try {
        const [rows] =  await pool.query(`SELECT * FROM USERS WHERE username = "${usernameOrEmail}" or email = "${usernameOrEmail}"`);
        const userInfo = rows[0];

        if (!userInfo) {
          return done(null, false, {message : {'warning' : 'invaild username or password'}});
        }

        const user = new User(userInfo.id, userInfo.username, userInfo.password);
        
        if (!await user.isValidPassword(password)) {
          return done(null, false, {message : {'warning' : 'invaild username or password'}});
        }

        return done(null, user, { message : {'success' : 'Logged in Successfully'}});
      } catch (error) {
        return done(error);
      }
    }
  )),

  // local 회원가입
  passport.use('signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
        // username, email 중복 검사 쿼리
        const checkDupleUserInfo = pool.Promise.query(
          `
          SELECT
            COUNT(*) duple_user
          FROM
            USERS
          WHERE
            username = "${req.body.username}"
            OR
            email = "${email}"
        `)
        // const existEmail = await User.findOne({ email });
        // const existUsername = await User.findOne({ 'username' : req.body.username });
        
        // if (existEmail) {
        //   return done(null, false, {'warning' : '같은 이메일 주소가 존재합니다'});
        // }

        // if (existUsername) {
        //   return done(null, false, {'warning' : '같은 유저 이름이 존재합니다'});
        // }

        const user = await User.create({ "username" : req.body.username, email, password });
        return done(null, user, { 'success' :  `${user.username} is Joined Successfully`});
      } catch (error) {
        done(error);
      }
  }))

}