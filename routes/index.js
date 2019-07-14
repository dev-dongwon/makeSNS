const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const flashMessage = req.flash();
  console.log(flashMessage)
  res.render('index', { title: 'Express' });
});

router.get('/signin', (req, res) => {
  console.log(req.user)
  res.render('signin', { title: 'SIGN IN | SNS' , page : 'SIGN IN'});
})

module.exports = router;
