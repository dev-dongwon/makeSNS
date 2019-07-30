const express         = require('express'),
      router          = express.Router(),
      contentController = require('../controller/content-controller'),
      upload          = require('../utils/multer-upload');

router.get('/:contentNumber', (req, res, next) => {
  contentController.getContentPage(req, res, next);
});

router.delete('/:contentNumber', (req, res, next) => {
  contentController.deleteContent(req, res, next);
})

router.patch('/:contentNumber', upload.array('image', 4), (req, res, next) => {
  contentController.updateContent(req, res, next);
})

module.exports = router;