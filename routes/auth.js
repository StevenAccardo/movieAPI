const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const router = express.Router();

//Gets all genres in DB and returns them in alphabetical order by their name field
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Looks for user to ensure they are not already in the DB, which would mean a duplicate
  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Invalid email or password');

  //Uses bcrypts compare method, which takes the plain text password, salts, and hashes it and then compares it to the salted and hashed password that is in the model instance
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  //if not a match, send back status and message
  if(!validPassword) return res.status(400).send('Invalid email or password');

  //creates the signed jwt
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
