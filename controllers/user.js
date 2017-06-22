const mongoose = require('mongoose');
const User = require('../models/user');
const MessageController = require('./message');

// Under consideration yet
exports.getAll = (req, res, next) => {
  req.query.type = 0; // Select only clients
  // Set the Email and Password to 'undefined' to prevent passing
  // them as filters to the User Collection
  getUsers(req.query, (users) => {
    res.send(users);
  }, next);
};

// Get a particular User
exports.get = (req, res, next) => {
  getUser(req.params.userId, (user) => {
    res.send(user);
  }, next);
};

// Update User
exports.update = (req, res, next) => {
  req.body.updated = Date.now();
  updateUser(req.params.userId, req.body, (user) => {
    res.send(['Updated User', user]);
  }, next);
};

// Delete User
exports.delete = (req, res, next) => {
  deleteUser(req.params.userId, (user) => {
    res.send(user);
  }, next);
};


/**
* Route Handlers for the Message Resource
*/
exports.getMessages = (req, res, next) => {
  // req.query could include flags like read/unread
  MessageController.getMessages(req.query, (messages) => {
    res.send(messages);
  }, next);
};

exports.getMessage = (req, res, next) => {
  MessageController.getMessage(req.params.messageId, (message) => {
    res.send(message);
  }, next);
};

exports.addMessage = (req, res, next) => {
  req.body.from = req.params.userId; // User Id is in the URL
  MessageController.addMessage(req.body, (message) => {
    res.send(message);
  }, next);
};

exports.updateMessage = (req, res, next) => {
  // req.query could include flags like read/unread
  MessageController.updateMessage(req.params.messageId, req.body, (message) => {
    res.send(message);
  }, next);
};

exports.deleteMessage = (req, res, next) => {
  // req.query could include flags like read/unread
  MessageController.deleteMessage(req.params.messageId, (message) => {
    res.send(message);
  }, next);
};


// Get Users using a param
function getUsers(objectParams, done, next){
  User.find(objectParams).then((users) => {
    return done(users);
  }).catch(next);
}

// Get a particular User by ID
function getUser(id, done, next){
  User.findById(id).then((user) => {
    if(!user) return done({error: 'User not found'});
    return done(user);
  }).catch(next);
}

/**
* Returns a particular User by Email
*/
function getUserByEmail(email, done, next){
  User.findOne({ email: email }).then((user) => {
    if(!user) return done({error: 'User not found'});
    return done(user);
  }).catch(next);
}

// Add a new User
function addUser(object, done, next){
  User.create(object).then((user) => {
    return done(user);
  }).catch(next);
}

// Updates a particular User
function updateUser(id, object, done, next){
  User.findOneAndUpdate({ _id : id }, object).then((user) => {
    return done(user);
  }).catch(next);
}

// Deletes a User
function deleteUser(id, done, next){
  User.findOneAndRemove({ _id : id }).then((user) => {
    return done(user);
  }).catch(next);
}

// This function verifies a User to show he is Authentic
function verifyUser(id, done, next){
  User.findOneAndUpdate({ _id: id}, {verified: true}).then((user) => {
    return done(user);
  }).catch(next);
}

// Exports the interfaces to the User Collection
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.getUserByEmail = getUserByEmail;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.verifyUser = verifyUser;
