const express = require('express');
const passport = require('passport');
const router = express.Router();

require('../model/passport').setup()

// get signIn page
router.get('/', (req, res, next) => {
  console.log(req.user)
  res.render('login', { title: 'LOGIN | SNS' , page : 'LOGIN'});
});

// local-login Strategy
router.post('/', passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true,
  successFlash : true,
}))

module.exports = router;