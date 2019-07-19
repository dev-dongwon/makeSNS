const jwt = require('jsonwebtoken')
const config = require('../config/index');

const checkJwtToken = () => async (req, res, next) => {
  
  if (!req.cookies.token) {
    req.user = false;
    return next();
  }
  
  const token = req.cookies.token;

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.user = decodedToken.user
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = checkJwtToken;