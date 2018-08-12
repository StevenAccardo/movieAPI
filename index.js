const Joi = require('joi');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

Joi.objectId = require('joi-objectid')(Joi);

const app = express();
//checks to see if we have an environment variable set, if not it sends an error and kills node
if(!config.get('jwtPrivateKey')) {
  console.error('Fatal Error: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to mongoDB...'))
  .catch(() => console.error('Could not connect to mongoDB...'));
//Middleware
app.use(express.json());

//Routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
