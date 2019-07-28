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
      let user = await User.findOneAndUpdate(req.params, req.body);
      return res.json(user)
    } catch (error) {
      next(error);
    }
  },

  getSettingsPage : (req, res) => {
    res.render('settings', {
      title: 'Settings | Daily Frame',
      user : req.user,
    });
  }
}

module.exports = userController;