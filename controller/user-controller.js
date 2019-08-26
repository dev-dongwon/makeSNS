const generateJWTToken = require('../utils/jwt-token-generator');
const userUtil = require('../utils/db/user');
const User = require('../model/user');
const passport = require('passport');
const userHandler = require('../utils/db/user');
const pool = require('../db/connect-mysql').pool;
require('../auth/passport').setup()

const userController = {

  addAuthUser : async (req, res, next) => {
    try {
      // 클라이언트에서 중복 체크 후 서버에서도 중복 유저 네임 체크
      const checkDupleUsernameInfo = await pool.query(
        `
        SELECT
        COUNT(*) dupleUsernameCount
        FROM
        USERS
        WHERE
        username = "${req.body.username}"
        `)
        
      const [dupleUsername] = checkDupleUsernameInfo;
      const {dupleUsernameCount} = dupleUsername[0];
  
      if (dupleUsernameCount > 0) {
        return res.end('dupleUsername');
      }

      if (req.files.length > 0) {
        req.body.photolink = req.files[0].location
      }

      const {username, location, introduction, authGoogleId, photolink} = req.body;

      const [result] = await pool.query(
      `
        INSERT INTO USERS
        (username, location, introduction, auth_google_id, photo_link)
        VALUES
        ("${username}", "${location}", "${introduction}", "${authGoogleId}", "${photolink}");
      `
      )
      
      if (result.affectedRows === 1 && result.serverStatus === 2) {
        // db insert 후 회원가입 완료, jwt 토큰 발급
        const user = userHandler.makeUserObj(result.insertId, username, photolink);
        await generateJWTToken(res, user);
        return res.end('success');
      }
      
    } catch (error) {
      next(error);
    }
  },

  addUser : (req, res, next) => {
    try {
      passport.authenticate('signup', {
        session : false
      }, async (err, user, info) => {
  
        req.flash('message', info.message)
        
        if (!user) {
          return res.redirect('/signup')
        }
  
        // 회원가입 후 자동 로그인 : jwt 토큰 생성 후 메인 페이지로 리다이렉트 
        await generateJWTToken(res, user);
        return res.redirect('/');
      
      })(req, res, next)

    } catch (error) {
      next(error)
    }
  },

  deleteUser : async (req, res, next) => {
    try {
      await pool.query(`
        UPDATE USERS
        SET validation = 'N'
        WHERE ID = ${req.user.id};
      `);

      req.flash('message', {'info' : '회원 탈퇴가 완료되었습니다'});
      res.clearCookie('token', { path: '/' })

      res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateUser : async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const [userRow] = await pool.query(`
        SELECT * FROM USERS WHERE ID = ${userId};
      `)
      const user = userRow[0];

      let {location, introduction, password} = req.body;

      let updatedPhotolink, updatedPassword;

      if (req.files.length > 0) {
        updatedPhotolink = req.files[0].location;
      }
      if (password && password !== '') {
        updatedPassword = await userUtil.getCryptoPassword(password);
      }

      await pool.query(`
        UPDATE USERS
        SET
          LOCATION = "${location}",
          INTRODUCTION = "${introduction}",
          PASSWORD = "${updatedPassword || user.PASSWORD}",
          PHOTO_LINK = "${updatedPhotolink || user.PHOTO_LINK}"
        WHERE ID = ${user.ID};
      `);

      return res.end('success');

    } catch (error) {
      console.error(error)
      next(error);
    }
  },

  getSettingsPage : async (req, res) => {

    const [userRow] = await pool.query(`
      SELECT * FROM USERS WHERE ID = ${req.user.id};
    `)

    if (userRow.length === 0) {
      req.flash('message', {'info' : '해당하는 회원 정보가 없습니다'});
      res.redirect('/');
    }

    const userInfo = userRow[0];

    const user = {
      id : userInfo.ID,
      photolink: userInfo.PHOTO_LINK,
      username: userInfo.USERNAME,
      location: userInfo.LOCATION,
      introduction: userInfo.INTRODUCTION,
      authId: userInfo.AUTH_GOOGLE_ID,
    }

    res.render('settings', {
      title: 'Settings | Daily Frame',
      user
    });
  },

  getInitSettingsPage : (req, res) => {
    res.render('initSettings', {
      title: 'Settings | Daily Frame',
      user : req.user,
      message : req.flash('message')
    });
  },

  getLikesPage : async (req, res, next) => {
    try {
      const author = await User.findOne({username : req.params.username}).populate({path : 'likePosts'});
      const posts = [];
      Array.from(author.likePosts).filter(val => val[1].display === true)
                                  .forEach(post => posts.push(post[1]));
  
      let user;
      if (req.user) {
        user = await User.findById(req.user._id);
      }
  
      res.render('likes', {
        title: 'likes | Daily Frame',
        user,
        posts,
        author
      });
    } catch (error) {
      next(error);
    }
    }
}

module.exports = userController;