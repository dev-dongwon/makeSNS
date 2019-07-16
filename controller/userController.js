const User = require('../model/user');
const passport = require('passport');
require('../auth/passport').setup()

const userController = {

  addUser : async (req, res, next) => {
    res.json({ 
      message : 'Signup successful',
      user : req.user 
    });
  }
}

module.exports = userController;