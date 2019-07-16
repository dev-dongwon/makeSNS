const indexController = {
  home : (req, res) => {
    res.render('index', { title: 'Daily Frame | The creators Network' });
  },

  signin : (req, res) => {
    console.log(req.flash('INFO'))
    res.render('signin', { title: 'Sign in | Daily Frame' });
  },

  signup : (req, res) => {
    res.render('signup', { title: 'Sign up | Daily Frame' });
  }
}

module.exports = indexController;