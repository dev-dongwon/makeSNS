const Post = require('../model/post');
const User =require('../model/user');
const pool = require('../db/connect-mysql').pool;

const indexController = {
  home: async (req, res, next) => {
    try {

      // 테이블 풀스캔 대신 인덱스 먼저 접근 후 join 실행
      const [posts] = await pool.query(
        `
        SELECT
        post.ID as post_id, post.content as content, post.photo_link as photo_link,
        post.like_count as like_count, user.username as username
        FROM
          POSTS as post
        JOIN
          USERS as user
        ON
          post.user_id = user.id
        JOIN
        (
          SELECT id
          FROM POSTS
          ORDER BY id desc
        ) post2
        ON
          post.id = post2.id
        limit 20
        `
      )
  
      res.render('main', {
        title: 'Daily Frame | The creators Network',
        user: req.user,
        posts,
        message : req.flash('message')
      });

    } catch (error) {
      next(error);
    }
  },

  signin: (req, res) => {
    res.render('signin', {
      title: 'Sign in | Daily Frame',
      message : req.flash('message')
    });
  },

  signup: (req, res) => {
    res.render('signup', {
      title: 'Sign up | Daily Frame',
      message : req.flash('message')
    });
  },

  forgotpassword: (req, res) => {
    const message = req.flash('INFO')[0];
    res.render('forgotpassword', {
      title: 'Forgot Password | Daily Frame',
      user: req.user,
      message: message || false
    });
  },

  discover : async (req, res, next) => {

    try {
      const [posts] = await pool.query(
        `
        SELECT
        post.ID as post_id, post.content as content, post.photo_link as photo_link,
        post.like_count as like_count, user.username as username
        FROM
          POSTS as post
        JOIN
          USERS as user
        ON
          post.user_id = user.id
        JOIN
        (
          SELECT id
          FROM POSTS
          ORDER BY id desc
        ) post2
        ON
          post.id = post2.id
        limit 20
        `
      )

      res.render('discover', {
        title: 'Discover | Daily Frame',
        posts,
        user : req.user,
      });
      
    } catch (error) {
      next(error);
    }
  },

  following : async (req, res, next) => {

    const user = await User.findById(req.user._id)
                           .populate({path : 'followings'});

    const followingArr = user.followings;
    const posts = await Array.from(followingArr).reduce( async (acc, following, index) => {
      const target = await User.findById(following[1]._id)
                                .populate({path : 'posts'})
      target.posts.forEach( async val => acc.push(val) )
      return await acc;
    },[])

    posts.sort((a, b) => {
      return a.createdDate < b.createdDate
    })

    res.render('following', {
      title: 'Following | Daily Frame',
      user,
      posts
    });
  }
}

module.exports = indexController;