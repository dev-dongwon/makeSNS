const express = require('express');
const router = express.Router();

// get signIn page
router.get('/', (req, res, next) => {
  res.render('login', { title: 'LOGIN | SNS' , page : 'LOGIN'});
});

router.post('/', (req, res, next) => {
  
})

module.exports = router;
