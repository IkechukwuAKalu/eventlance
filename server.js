const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const controllers = require('./controllers');

mongoose.connect('mongodb://127.0.0.1/eventlance');
mongoose.Promise = global.Promise; // mongoose.Promise is deprecated
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB..');
}).on('error', (err) => {
  console.log(err.message);
});

const app = express();

app.use(passport.initialize()); // Initialize Passport for use within Express.js
app.use(express.static(__dirname + "/public")); // Ex. CSS, JS, etc
app.use(bodyParser.json()); // For POST and PUT requests

// Initialize the App object on the Message Controller
controllers.Message.init(app);

// Models-Route middlewares
app.use('/api/v1/event-centres', routes.apiV1.eventCentres);
app.use('/api/v1/freelancers', routes.apiV1.freelancers);
app.use('/api/v1/freelancers/categories', routes.apiV1.categories);
app.use('/api/v1/portfolios', routes.apiV1.portfolios);
app.use('/api/v1/teams', routes.apiV1.teams);
app.use('/api/v1/users', routes.apiV1.users);
// For token access and login/signup
app.use('/auth', routes.auth);
// This should go under the routes middlewares
app.use((err, req, res, next) => {
  res.send({error: err.message});
});
// Serve the robots.txt file for bots
app.get('/robots.txt', (req, res) => {
  res.sendFile(__dirname + '/robots.txt');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Now listening for connections...");
});
