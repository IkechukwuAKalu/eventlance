const bcrypt = require('bcrypt');

/**
* Hashes a String
*/
module.exports.hash = (string, done) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(string, salt, (err, hash) => {
        return done(hash);
    });
  });
};

/**
* Compares a String to a Hash to check if they are same
* Return true in param 'res' if they are same
*/
module.exports.compare = (string, hash, done) => {
  bcrypt.compare(string, hash, (err, res) => {
    return done(err, res);
  });
};

/**
* Generates a unique Identifier
*/
module.exports.getUid = (length) => {
  var uid = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charsLength = chars.length;
  for (let i = 0; i < length; ++i) {
    uid += chars[getRandomInt(0, charsLength - 1)];
  }

  return uid + Date.now();
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
