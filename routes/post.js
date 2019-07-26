const express         = require('express'),
      router          = express.Router(),
      postController  = require('../controller/post-controller'),
      upload          = require('../utils/multer-upload');

router.post('/', upload.array('image', 4), (req, res, next) => {
  postController.uploadImage(req, res, next);
})

module.exports = router;