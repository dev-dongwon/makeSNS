const indexController = {
  home: (req, res) => {
    res.render('main', {
      title: 'Daily Frame | The creators Network',
      user: req.user
    });
  },

  signin: (req, res) => {
    res.render('signin', {
      title: 'Sign in | Daily Frame',
    });
  },

  signup: (req, res) => {
    res.render('signup', {
      title: 'Sign up | Daily Frame'
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

  discover : (req, res) => {
    res.render('discover', {
      title: 'Discover | Daily Frame'
    });
  }
}

module.exports = indexController;