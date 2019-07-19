const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkJwtToken = () => async (req, res, next) => {
  
  if (!req.cookies.token) {
    req.user = false;
    return next();
  }
  
  const token = req.cookies.token;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = checkJwtToken;