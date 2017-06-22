const mongoose = require('mongoose');

var socialSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  twitter: String,
  snapchat: String
});

var reviewSchema = new mongoose.Schema({
  reviewerId: String,
  title: String,
  review: String
});

var Schema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  price: Number,
  name: String,
  website: String,
  socialMedia: socialSchema,
  ratings: [Number], // eg [1,3,1,4,5]
  reviews: [reviewSchema],
  clients: [],
  mobile: Boolean, // Is he able to travel to a location
  teams: [String], // the ID of teams he belongs to
  categories: [String],
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('freelancer', Schema);
