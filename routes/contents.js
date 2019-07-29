const express         = require('express'),
      router          = express.Router(),
      contentController = require('../controller/content-controller');

router.get('/:contentNumber', (req, res, next) => {
  contentController.getContentPage(req, res, next);
});

router.delete('/:contentNumber', (req, res, next) => {
  contentController.deleteContent(req, res, next);
})

module.exports = router;