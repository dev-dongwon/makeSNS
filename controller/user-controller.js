const generateJWTToken = require('../utils/jwt-token-generator');
const User = require('../model/user');
const Post = require('../model/post');
const passport = require('passport');
const userHandler = require('../utils/db/user');
const pool = require('../db/connect-mysql').pool;
require('../auth/passport').setup()

const userController = {

  addAuthUser : async (req, res, next) => {
    try {
      const [rows] =  await pool.query(
        `
        SELECT
          * 
        FROM
          USERS
        WHERE
          auth_google_id = "${req.body.authGoogleId}"`
        );

        console.log(rows);

      if (rows.length > 0) {
        req.flash('message', {'info' : '이미 google 회원가입이 되어 있습니다!'});
        return res.redirect('/signin');
      }

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

      const {username, location, bio, link, authGoogleId, photolink} = req.body;

      const [result] = await pool.query(
      
      `
        INSERT INTO USERS
        (username, location, bio, link, auth_google_id, photo_link)
        VALUES
        ("${username}", "${location}", "${bio}", "${link}", "${authGoogleId}", "${photolink}");
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
      await User.deleteOne({username : req.user.username});
      res.clearCookie('token', { path: '/' })
      res.end('success');
    } catch (error) {
      next(error);
    }
  },

  updateUser : async (req, res, next) => {

    try {
      let user = await User.findOne().or([{ username : req.params.usernameOrOauthId }, { 'auth.googleId' : req.params.usernameOrOauthId}])
                            .populate({path : 'posts'})
                            .populate({path : 'comments'})
      
      if (req.files.length > 0) {
        req.body.profilePhoto = req.files[0].location
      }
      
      Object.assign(user, req.body);

      user.posts.forEach(async (post) => {
        post.author = user;
        await post.save();
      })

      user.comments.forEach(async (comment) => {
        const existPost = await Post.findById({_id : comment.postId});
        if (existPost) {
          existPost.comments.forEach(async (postComment) => {
            postComment.userAvatar = user.profilePhoto;
            await postComment.save();
          })
        }
        await existPost.save();
      })

      await user.save();
      return res.end('success');
    } catch (error) {
      next(error);
    }
  },

  getSettingsPage : async (req, res) => {
    
    let user;
    if (req.user) {
      user = await User.findById(req.user._id);
    }

    res.render('settings', {
      title: 'Settings | Daily Frame',
      user : user,
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