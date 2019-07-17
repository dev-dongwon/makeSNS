const express         = require('express'),
      router          = express.Router(),
      checkController = require('../controller/checkController');

router.get('/users/:username', (req, res) => {
  checkController.checkDupleUsername(req, res);
});

router.get('/users/:email', (req, res) => {
  
});

module.exports = router;
