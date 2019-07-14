const indexController = {
  home : (req, res) => {
    const flashMessage = req.flash();
    console.log(flashMessage)
    res.render('index', { title: 'Express' });
  },

  signin : (req, res) => {
    console.log(req.user)
    res.render('signin', { title: 'SIGN IN | SNS' , page : 'SIGN IN'});
  }
}

module.exports = indexController;