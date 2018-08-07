const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

const app = express();

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


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
