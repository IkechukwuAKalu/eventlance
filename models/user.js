const mongoose = require('mongoose');
const utils = require('../utils');

var Schema = new mongoose.Schema({
  fullname: String,
  phone: [String], // Could be multiple
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  photoPath: { // profile photo for users or logo for businesses
    type: String,
    default: 'localhost/public/def.jpg'
  },
  type: { // 0 - client, 1 - freelancer, 2 - event_centre
    type: Number,
    required: true
  },
  city: String,
  country: String,
  active: { // The User has to activate the account by verifying email
    type: Boolean,
    required: true,
    default: false
  },
  verificationAdded: { // Set to true when the User uploads a verification
    type: Boolean,
    default: false
  },
  verified: { // Set to true when the User has been considered authentic
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  }
});

// Hash password before saving to DB
Schema.pre('save', function (done){
  //if(!user.isModified('password')) return done(); // Return if password hasn't been changed
  utils.auth.hash(this.password, (hash) => {
    this.password = hash;
    done();
  });
  this.created = Date.now(); // Current Date
});

Schema.pre('validate', function (done){
  // Make sure the user is either one of the supported categoreis
  if (this.type == null || this.type < 0 || this.type > 2) return done(new Error('Invalid type of user!'));
  console.log('Valid User');
  done();
});

/**
* Checks if the specified password is correct
*/
Schema.methods.verifyPassword = function (password, done) {
  utils.auth.compare(password, this.password, (err, res) => {
    return done(err, res);
  });
};

// Basic schema for every user
module.exports = mongoose.model('user', Schema);
