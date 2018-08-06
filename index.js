const express = require('express');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');

const app = express();

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to mongoDB...'))
  .catch(() => console.error('Could not connect to mongoDB...'));
//Middleware
app.use(express.json());

//Routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
