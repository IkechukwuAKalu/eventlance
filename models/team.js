const mongoose = require('mongoose');

var MemberSchema = new mongoose.Schema({
  uId: String,
  joined: Date
});

var Schema = new mongoose.Schema({
  name: String,
  leaderId: String,
  members: [MemberSchema], // The members
  photo: String,
  description: String,
  categories: [String],
  price: String,
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('team', Schema);
