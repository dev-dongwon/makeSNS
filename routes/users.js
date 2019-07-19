const express = require('express');
const userController = require('../controller/user-controller');
const router = express.Router();

require('../auth/passport').setup()

router.post('/', (req, res, next) => {
  userController.addUser(req, res, next);
})

router.patch('/:username', (req, res, next) => {
  userController.updateUser(req, res, next);
})

module.exports = router;
