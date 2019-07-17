const User = require('../model/user');

const checkController = {
  checkDupleUsername : async (req, res, next) =>{
    try {
      const username = req.params.username;
      const user = await User.findOne({ username });
      if (user) {
        return res.send(true);
      }
      return res.send(false);

    } catch (error) {
      return next(error);      
    }

  }
}

module.exports = checkController;