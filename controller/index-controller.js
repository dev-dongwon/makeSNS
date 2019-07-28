const Post = require('../model/post');

const indexController = {
  home: (req, res) => {
    res.render('main', {
      title: 'Daily Frame | The creators Network',
      user: req.user,
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

    const postArr = await Post.find().sort({createdDate : -1}).skip(page*limit).limit(limit);
    res.render('discover', {
      title: 'Discover | Daily Frame',
      posts : postArr,
      user : req.user
    });
  }
}

module.exports = indexController;