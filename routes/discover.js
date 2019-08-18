const express         = require('express'),
      router          = express.Router(),
      discoverController = require('../controller/discover-controller');

router.get('/trending', discoverController.trending);

module.exports = router;