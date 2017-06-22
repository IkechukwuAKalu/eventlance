const mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  from: { //Sender Id
    type: String,
    required: true
  },
  to: { // Receiver Id
    type: String,
    required: true
  },
  textOnly: {
    type: Boolean,
    required: true
  },
  attachments: [String], // The path to the Attachments
  status: {
    type: Number, //enum ['pending', 'sent', 'delivered', 'seen'];
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('message', Schema);
