const Post = require('../model/post');
const User = require('../model/user')

const profileController = {
  home: async (req, res) => {
    const user = await User.findOne({username : req.user.username})
                           .populate({path : 'posts'});

    res.render('profile', {
      title: 'Profile | The creators Network',
      user: user,
      likes : JSON.stringify(user.likePosts)
    });
  },
}

module.exports = profileController;