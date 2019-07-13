const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const flashMessage = req.flash();
  console.log(flashMessage)
  res.render('index', { title: 'Express' });
});

module.exports = router;
