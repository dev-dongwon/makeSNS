const express         = require('express'),
      router          = express.Router(),
      profileController = require('../controller/profile-controller');

router.get('/', (req, res) => {
  profileController.home(req, res);
});

module.exports = router;
