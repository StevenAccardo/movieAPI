const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const Customer = mongoose.model('Customer', new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  }
}));

function validateCustomer(customer) {
  const schema = {
    //must be a string with at least 3 chars and is required.
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(10).max(50).required(),
    isGold: Joi.boolean()
  }

  //returns an object
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
