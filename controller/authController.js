const passport = require('passport');
const jwt = require('jsonwebtoken');

require('../auth/passport').setup()

const authController = {

  localLogin : (req, res) => {
    passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/signin',
      failureFlash : true,
      successFlash : true,
      session : false,
    }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
          message: 'Something is not right',
          user   : user
      });
    }
    
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user.toJSON(), 'secret');  
      console.log(token)
      return res.json({user, token});
   });
  })(req,res)
  }
}

module.exports = authController;