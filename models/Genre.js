const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);

//validates the post request body
function validateGenre(genre) {
  const schema = {
    //must be a string with at least 3 chars and is required.
    name: Joi.string().min(5).max(50).required()
  }

  //returns an object
  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
