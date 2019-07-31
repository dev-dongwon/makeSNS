const isLoggedIn = (req, res, next) => {
	if (req.user) {
		return next();
  }
  
  req.flash('message', {'info' : '로그인이 필요한 서비스입니다'});
  return res.redirect('/signin');
};

 module.exports = { isLoggedIn };