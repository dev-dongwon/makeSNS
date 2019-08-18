const express     = require('express'),
      userController  = require('../controller/user-controller'),
      router          = express.Router(),
      auth            = require('../middlewares/auth'),
      upload          = require('../utils/multer-upload');

      require('../auth/passport').setup()

router.post('/', userController.addUser);

router.patch('/:usernameOrOauthId', upload.array('image', 4), userController.updateUser);

router.get('/settings', auth.isLoggedIn, userController.getSettingsPage);

router.get('/initSettings', auth.isLoggedIn, userController.getInitSettingsPage);

router.get('/:username/likes', userController.getLikesPage);

router.delete('/:username', auth.isLoggedIn, userController.deleteUser);

module.exports = router;