const indexController = {
  home : (req, res) => {
    res.render('index', { title: 'Daily Frame | The creators Network' });
  },

  signin : (req, res) => {
    console.log(req.flash('INFO'))
    res.render('signin', { title: 'SIGN IN | Daily Frame' });
  },

  signup : (req, res) => {
    res.render('signin', { title: 'SIGN IN | Daily Frame' });
  }
}

module.exports = indexController;