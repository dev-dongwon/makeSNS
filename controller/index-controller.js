const Post = require('../model/post');
const User =require('../model/user');

const indexController = {
  home: async (req, res) => {
    const user = await User.findById(req.user._id);
    const page = req.query.page || 0;
    const limit = req.query.limit || 25;
    const postArr = await Post.find({'display' : true}).sort({createdDate : -1}).skip(page*limit).limit(limit);

    res.render('main', {
      title: 'Daily Frame | The creators Network',
      user: user,
      posts : postArr,
      message : req.flash('message')
    });
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

  discover : async (req, res) => {

    const page = req.query.page || 0;
    const limit = req.query.limit || 25;

    let user;
    let likes;

    if (req.user) {
      user = await User.findById(req.user._id);
      if (user.likePosts) {
        likes = JSON.stringify(user.likePosts);
      }
    }

    const postArr = await Post.find({'display' : true}).sort({createdDate : -1}).skip(page*limit).limit(limit);
    res.render('discover', {
      title: 'Discover | Daily Frame',
      posts : postArr,
      user : user || null,
      likes : likes || null
    });
  }
}

module.exports = indexController;