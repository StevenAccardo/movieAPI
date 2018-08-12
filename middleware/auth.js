const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if(!token) return res.status(401).send('Access denied. No token provided.');

  //returns the decoded payload of the jwt
  //if the token is not valid, it will throw an exception, so need to wrap in try catch blocks
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    //Our payload only contains the user id, so that is what will be returned to the decoded constant, we then make that availble to the route handler or next middlware on the req.user property
    req.user = decoded;
    next();
  }
  catch(e) {
    res.status(400).send('Invalid token.');
  }
}
