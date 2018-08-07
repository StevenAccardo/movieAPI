const { Rental, validate } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const { Customer } = require('../models/Customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  //Queries all rental instances and sorts them by descending order
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check to make sure the customer is a valid customer
  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send('Invalid customer.');

  //Check to make sure the movie is a valid movie
  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  //try and complete the transaction where we save the new rental instance, then update the movie instance with the mathcing query
  //You must always call run when using Fawn
  try {
    new Fawn.Task()
      //1st arg collection name. Case sensitive.
      //2nd arg is document we want to save
      .save('rentals', rental)
      .update('movies', { _id: movie._id },  {
        $inc: { numberInStock: -1 }
      })
      .run();
    //send the rental object instance back to the client
    res.send(rental);
  }
  catch(e) {
    res.status(500).send('Something failed.');
  }
});

module.exports = router;
