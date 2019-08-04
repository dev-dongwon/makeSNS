const Post = require('../model/post');
const User = require('../model/user')

const profileController = {
  home: async (req, res) => {

    const author = await User.findOne({username : req.params.username})
                           .populate({path : 'posts'});

    let user, likes;

    if (req.user) {
      user = await User.findById(req.user._id);
      likes = JSON.stringify(user.likePosts);
    }

    const posts = author.posts.filter(val => val.display === true);
    
    res.render('profile', {
      title: 'Profile | The creators Network',
      user: user || null,
      author,
      posts,
      likes : likes || null,
      requestUser : req.params.username
    });
  },
}

module.exports = profileController;