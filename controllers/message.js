const events = require('events');
const Message = require('../models/message');

var emitter = new events.EventEmitter();
// Refrence to the express Apllication object
var app = null;
var msgInitEvent = 'msg_init';

module.exports.init = (expressApp) => {
  app = expressApp;
  emitter.emit(msgInitEvent, true);
  console.log('Message App initialized');
};

emitter.on(msgInitEvent, (val) => {
  if (val) {

    // Start the App now
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

  }
});

function getMessages(params, done, next) {
  Message.find(params).then((messages) => {
    if(!messages) return done({error: "No Message found"});
    return done(messages);
  }).catch(next);
}

function getMessage(messageId, done, next) {
  Message.find({ _id: messageId}).then((message) => {
    if(!message) return done({error: "Message not found"});
    return done(message);
  }).catch(next);
}

function addMessage(object, done, next) {
  Message.create(object).then((message) => {
    return done(message);
  }).catch(next);
}

function updateMessage(messageId, object, done, next) {
  Message.findOneAndUpdate({ _id: messageId}, object).then((m) => {
    getMessage(m._id, (message) => {
      return done(message);
    }, next);
  }).catch(next);
}

function deleteMessage(messageId, done, next) {
  Message.findOneAndRemove({ _id: messageId}).then((message) => {
    return done(message);
  }).catch(next);
}
