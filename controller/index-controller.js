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
      const user = req.user;

      // 날짜별 최신 상위 20개 포스트 가져오기
      const [posts] = await pool.query(
        `
        SELECT
          post.ID as post_id,
          post.content as content,
          post.photo_link as photo_link,
          post.like_count as like_count,
          post.created_date as created_date,
          post.view_count as view_count,
          post.like_count as like_count,
          post.comment_count as comment_count,
          author.username as author_username,
          author.id as author_id,
          author.photo_link as author_photolink
        FROM
          POSTS as post
        JOIN
          USERS as author
        ON
          post.user_id = author.id
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

      if (user) {
        // 로그인한 유저일 경우, 팔로우 목록 가져오기
        const [followRow] = await pool.query(
          `
          SELECT * FROM FOLLOW WHERE follower_id = ${user.id};
          `
        );

        const followObj = followRow.reduce((acc, row) => {
          const following = row.FOLLOWING_ID;
          acc[following] = following;
          return acc;
        },{})

        user.follow = followObj;

        // 좋아요 목록 가져오기
        const [likeRow] = await pool.query(
          `
          SELECT * FROM LIKES WHERE user_id = ${user.id};
          `
        )

        const likeObj = likeRow.reduce((acc, row) => {
          const post = row.POST_ID;
          acc[post] = post;
          return acc;
        },{})
        user.like = likeObj;
      }

      res.render('discover', {
        title: 'Discover | Daily Frame',
        posts,
        user
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