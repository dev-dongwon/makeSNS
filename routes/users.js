const express = require('express');
const userController = require('../controller/user-controller');
const router = express.Router();
const auth = require('../middlewares/auth');

require('../auth/passport').setup()

router.post('/', (req, res, next) => {
  userController.addUser(req, res, next);
})

router.patch('/:usernameOrOauthId', (req, res, next) => {
  userController.updateUser(req, res, next);
})

router.get('/settings', auth.isLoggedIn, (req, res) => {
  userController.getSettingsPage(req, res)
})

router.get('/initSettings', auth.isLoggedIn, (req, res) => {
  userController.getInitSettingsPage(req, res)
})

module.exports = router;