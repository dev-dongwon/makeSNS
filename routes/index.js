const express         = require('express'),
      router          = express.Router(),
      indexController = require('../controller/indexController');

router.get('/', (req, res) => {
  console.log(req.flash(), req.session)
  indexController.home(req, res);
});

router.get('/signin', (req, res) => {
  indexController.signin(req, res);
})

router.get('/signup', (req, res) => {
  indexController.signup(req, res);
})

module.exports = router;
