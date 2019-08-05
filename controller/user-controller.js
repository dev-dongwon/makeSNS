const User = require('../model/user');
const passport = require('passport');
require('../auth/passport').setup()

const userController = {

  addUser : (req, res, next) => {
      passport.authenticate('signup', {
        session : false
      }, (err, user, info) => {
        req.flash('INFO',info.message)
        
        if (err || !user) {
          return res.redirect('/signup')
        }

        return res.redirect('/signin');
      })(req, res, next)
    },

  updateUser : async (req, res, next) => {

    try {
      let user = await User.findOne().or([{ username : req.params.usernameOrOauthId }, { 'auth.googleId' : req.params.usernameOrOauthId}]);
      Object.assign(user, req.body);
      await user.save();
      return res.json(user);
    } catch (error) {
      next(error);
    }
  },

  getSettingsPage : async (req, res) => {
    
    let user;
    if (req.user) {
      user = await User.findById(req.user._id);
    }

    res.render('settings', {
      title: 'Settings | Daily Frame',
      user : user,
    });
  },

  getInitSettingsPage : (req, res) => {
    res.render('initSettings', {
      title: 'Settings | Daily Frame',
      user : req.user,
      message : req.flash('message')
    });
  },

  getLikesPage : async (req, res, next) => {
    try {
      const author = await User.findOne({username : req.params.username}).populate({path : 'likePosts'});
      const posts = [];
      Array.from(author.likePosts).filter(val => val[1].display === true)
                                  .forEach(post => posts.push(post[1]));
  
      let user;
      if (req.user) {
        user = await User.findById(req.user._id);
      }
  
      res.render('likes', {
        title: 'likes | Daily Frame',
        user,
        posts,
        author
      });
    } catch (error) {
      next(error);
    }
    }
}

module.exports = userController;