const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const Genre = mongoose.model('Genre', new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));

//validates the post request body
function validateGenre(genre) {
  const schema = {
    //must be a string with at least 3 chars and is required.
    name: Joi.string().min(5).max(50).required()
  }

  //returns an object
  return Joi.validate(genre, schema);
}


exports.Genre = Genre;
exports.validate = validateGenre;
