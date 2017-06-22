const mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
  bookerId: String,
  dateOfUse: Date,
  purpose: String,
  approved: Boolean
});

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
    required: true,
    unique: true
  },
  price: Number,
  name: String,
  website: String,
  socialMedia: socialSchema,
  ratings: [Number], // eg [1,3,1,4,5]
  reviews: [reviewSchema],
  clients: [],
  size: String,
  features: String,
  address: String,
  gallery: [String],
  bookingAllowed: Boolean,
  bookings: [bookingSchema]
});

module.exports = mongoose.model('event_centre', Schema);
