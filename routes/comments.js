const express         = require('express'),
      router          = express.Router(),
      commentsController = require('../controller/comments-controller'),
      authMiddlewares = require('../middlewares/auth');

router.post('/', authMiddlewares.isLoggedInforAjax, (req, res, next) => {
  commentsController.addComment(req, res, next);
});

module.exports = router;