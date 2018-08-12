const winston = require('winston');
const express = require('express');
const app = express();
//starts logging
require('./startup/logging')();
//starts mongo
require('./startup/mongoDB')();
//Routes & Middleware
//This returns the exported function, and then invokes that function while passing in the express() instance
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
