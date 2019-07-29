const express = require('express');
const userController = require('../controller/user-controller');
const router = express.Router();

require('../auth/passport').setup()

router.post('/', (req, res, next) => {
  userController.addUser(req, res, next);
})

router.patch('/:usernameOrOauthId', (req, res, next) => {
  userController.updateUser(req, res, next);
})

router.get('/settings', (req, res) => {
  userController.getSettingsPage(req, res)
})

router.get('/initSettings', (req, res) => {
  userController.getInitSettingsPage(req, res)
})

module.exports = router;