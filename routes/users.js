const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

require('../auth/passport').setup()

router.post('/', (req, res, next) => {
  userController.addUser(req, res, next);
})

module.exports = router;
