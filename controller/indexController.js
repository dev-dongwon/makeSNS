const indexController = {
  home: (req, res) => {
    res.render('main', {
      title: 'Daily Frame | The creators Network',
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
  }
}

module.exports = indexController;