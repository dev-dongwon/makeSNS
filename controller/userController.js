const User = require('../model/user');

const userController = {
  addUser : async (req, res) => {
    const { id, email, password } = req.body;
    
    const create = (user) => {
      if (user) {
        throw new Error('username exists');
      } else {
        return User.create({id, password, email});
      }
    }
    
    try {
      const user = await User.findOne({ id : id });
      const newUser = await create(user);
      const ss = await User.findOne({ id : id })
      res.end('/')
      console.log(req.user)
    } catch (error) {
      req.flash('message','가입할 수 없엉');
      res.redirect('/');
      console.error(error);
    }
  }
}

module.exports = userController;