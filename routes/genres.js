const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Genre, validate } = require('../models/Genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//Gets all genres in DB and returns them in alphabetical order by their name field
router.get('/', async (req, res) => {
  try {
    res.send(await Genre.find().sort('name'));
  }
  catch(err) {
    res.status(500).send('Somethinf failed');
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creates a new genre in the DB
router.post('/', auth, async (req, res) => {
  //pulls off the error property
  const { error } = validate(req.body);
  //If the error property is not null, then send back an error message by sending status of 400 and accessing the message property on the error object
  if(error) return res.status(400).send(error.details[0].message);

  //Create a new model instance with the passed in genre name
  const genre = new Genre({ name: req.body.name });

  //save that model instance to the DB and return the newly created model instance to the client
  res.send(await genre.save());
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/:id', async (req, res) => {

  //Use Joi to validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Find the document we want to update by its id property, then update the desired property, then tell mongoose to return the newly udpated instance
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  //check to ensure that we did in fact find and update the right property
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  //send the client the update instance
  res.send(genre);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;
