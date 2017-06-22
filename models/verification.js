/**
* This contains neccessary data to be able to identify
* a freelancer as valid.
*/
const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  filePath: String,
  created: {
    type: Date,
    default: Date.now()
  }
});

// This model is for Freelancer verification
var Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  nationalIDCard: itemSchema,
  nepaBill: itemSchema,
  driversLiscence: itemSchema,
  updated: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('verification', Schema);
