const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

//often times you want to get information about the current user, but you don't want to expose the user's ID as a parameter, so instead, you have an endpoint '/me', so this way the user id has to be pulled from the jwt
router.get('/me', auth, async(req, res) => {
  //finds user model instance, but excludes the password from the response
  const user = await User.findById(req.user._id).select('-password');
  //sends the user the information
  res.send(user);
});

//Gets all genres in DB and returns them in alphabetical order by their name field
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Looks for user to ensure they are not already in the DB, which would mean a duplicate
  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send('User already registered');

  //create new model instance
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  //Creates a salt, the larger the int passed in the longer the salt takes, but the more complex it will be
  const salt = await bcrypt.genSalt(10);
  //overwrites the user.password with the salt and hashed password
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
