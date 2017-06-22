/**
* This contains the Portfolio model which basically
* comprises of pictures at the moment
*/
const mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  description: String,
  filePath: {
    type: String,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('portfolio', Schema);
