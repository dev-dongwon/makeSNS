const express         = require('express'),
      router          = express.Router(),
      contentController = require('../controller/content-controller');

router.get('/:contentNumber', (req, res) => {
  contentController.getContentPage(req, res);
});

module.exports = router;