const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

const passport = require('passport');

require('../auth/passport').setup()


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', passport.authenticate('signup', { session : false }), async (req, res, next) => {
  userController.addUser(res, res, next);
})

module.exports = router;
