const passport = require('passport'); // For Authentications
const LocalStrategy = require('passport-local').Strategy; // For Username & Password grent flow
const BearerStrategy = require('passport-http-bearer').Strategy; // For Access Token Authentications
const Token = require('../models/token');
const userController = require('../controllers/user');
const utils = require('../utils');

/**
* Passport's LocalStrategy - This is used to authenticate using the
* Username/Password grant flow though, not yet in use
*/
passport.use(new LocalStrategy({
  usernameField: 'el_email', // The email field
  passwordField: 'el_pass'   // The password field
}, (email, password, done) => {
  doLogin(email, password, (user) => {
    if(user.error) return done(null, false);
    // Delete the password from the object
    delete user.password;
    return done(null, user);
  }, strategyError);
}));

/**
* Passport's BearerStrategy - This is used to authenticate using Access Tokens
* passed in the Authorization header in each request in the following format
* key - Authorization | value - Bearer <Access Token>
*/
passport.use(new BearerStrategy( (accessToken, done) => {
    getToken(accessToken, (token) => {
      if(!token.error){
        userController.getUser(token.userId, (user) => {
          if(!user.error) {
            user.password = undefined;
            return done(null, user, {scope: '*'}); // No scope specified
          } else { return done(null, false); }
        }, strategyError);
      }else{ return done(null, false); }
    }, strategyError);
}));

// Used to ensure that the requested resource is viewed by an authenticated User
exports.isAuthenticated = passport.authenticate(['bearer'], { session: false });

// Creates an Access Token if User is valid
exports.token = (req, res, next) => {
  if(req.query.grant_type === 'password' && req.query.client === 'el_01'){
    doLogin(req.body.el_email, req.body.el_pass, (response) => {
      if(!response.error){
        addToken(req.user._id, (token) => {
          res.send(token);
        }, next);
      } else { res.send(response.error); }
    }, next);
  } else { res.send({error: 'Invalid grant type'}); }
};

// Initiates a Login - Incase you want to use a Session
exports.login = (req, res, next) => {
  doLogin(req.body.el_email, req.body.el_pass, (response) => {
    res.send(response);
  }, next);
};

// Allows for Account Creation
exports.signup = (req, res, next) => {
  req.body.created = Date.now();
  userController.addUser(req.body, (user) => {
    res.send(user);
  }, next);
};

// Performs a Logout and Deletes the Associated Access Token
exports.logout = (req, res, next) => {
  var token = req.headers.authorization;
  token = token.replace(/^Bearer /i, ''); // Extract the Access Token
  deleteToken(token, (token) => {
    res.send({ success: true, message: 'You have been Successfully Logged Out' });
  }, next);
};

/**
* Initiates a Login action
*/
function doLogin(email, password, done, next){
  userController.getUserByEmail(email, (user) => {
    // No User found with the Email address
    if(!user) return done({error: 'Invalid Email Address'});
    // If Email exists, check for Password
    user.verifyPassword(password, (err, res) => {
      // The Password does not match,
      if(!res) return done({error: 'Invalid Password'});
      // The Email Address is not yet verified
      if(!user.active) return done({error: 'Your Email Address has not been verified'});
      // Finally, return the User object on success
      return done(user);
    });
  }, next);
}

// Saves a Token to the Database
function addToken(userid, done, next){
  var object = {
    value: utils.auth.getUid(243), // 243 + 13 numbers from the current time = 256
    userId: userid
  };
  Token.create(object).then((token) => {
    return done(token);
  }).catch(next);
}

// Gets a particular Token by its Value
function getToken(tokenVal, done, next){
  Token.findOne({ value: tokenVal }).then((token) => {
    if(!token) return done({error: 'No token found'}, false);
    return done(token);
  }).catch(next);
}

// Deletes a Token. Helps in Logout
function deleteToken(tokenVal, done, next){
  Token.findOneAndRemove({ value: tokenVal }).then((token) => {
    return done(token);
  }).catch(next);
}

// Middleware method for handling errors
function strategyError(err){
  console.log({error: err});
}
