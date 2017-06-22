const mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('token', Schema);
