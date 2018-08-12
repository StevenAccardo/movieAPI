const winston = require('winston');
require('winston-mongodb');
//monkey patches all of our routes with error handling instead of having to use the async middleware function, which will require each route handler be wrapped in a call to the middleware function.
require('express-async-errors');

module.exports = function() {
  //This allows winston to catch errors outside of the express flow.
  //This only works with synchronous code
  // process.on('uncaughtException', (err) => {
  //   winston.error(err.message, err);
  //   process.exit(1);
  // });

  //The above code is how you handle exceptions without winston, but winston has a method for handling uncaughtexceptions
  winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({filename: 'uncaughtException.log'})
  )

  //This works with async code
  process.on('unhandledRejection', (err) => {
    //winsotn doesn't have a native method for unhandledRejections yet, so we have to trick it into handling those as well.
    //This is a trick, we throw an uncaughtException, and now the winston.handleExceptions method will pick it up
    throw err;
  });

  winston.add(winston.transports.File, {filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/vidly', level: 'info'})
}
