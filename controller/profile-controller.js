const Post = require('../model/post');

const profileController = {
  home: async (req, res) => {

    res.render('profile', {
      title: 'Profile | The creators Network',
      user: req.user,
    });
  },
}

module.exports = profileController;