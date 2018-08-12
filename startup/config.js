const config = require('config');

module.exports = function() {
  //checks to see if we have an environment variable set, if not it sends an error and kills node
  if(!config.get('jwtPrivateKey')) {
    throw new Error('Fatal Error: jwtPrivateKey is not defined');
  }
}
