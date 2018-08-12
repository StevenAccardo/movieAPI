const winston = require('winston');

module.exports = function(err, req, res, next){
  //will log an errors
  winston.error(err.message, err);
  res.status(500).send('Something failed');
}
