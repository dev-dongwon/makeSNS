const express         = require('express'),
      router          = express.Router(),
      postController  = require('../controller/post-controller'),
      upload          = require('../utils/multer-upload');

router.post('/image', upload.single('image'), (req, res) => {
  postController.uploadImage(req, res);
})

module.exports = router;