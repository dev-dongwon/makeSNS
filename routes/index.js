const express         = require('express'),
      router          = express.Router(),
      indexController = require('../controller/indexController');

router.get('/', (req, res) => {
  indexController.home(req, res);
});

router.get('/signin', (req, res) => {
  indexController.signin(req, res);
})

module.exports = router;
