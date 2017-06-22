const express = require('express');
const multer = require('multer');
const files = require('../files');
const controllers = require('../controllers');

var upload = multer(files.upload.params);

/**
* To handle the Users resource
*/
var users = express.Router();
users.route('/')
  .get(controllers.Auth.isAuthenticated, controllers.User.getAll);
users.route('/:userId')
  .get(controllers.Auth.isAuthenticated, controllers.User.get)
  .put(controllers.Auth.isAuthenticated, controllers.User.update)
  .delete(controllers.Auth.isAuthenticated, controllers.User.delete);

/**
* To handle the Message Resource on the Users
*/
var mUploads = upload.array('elm_photo', 10);
users.route('/:userId/messages')
  .get(controllers.Auth.isAuthenticated, controllers.User.getMessages)
  .post(controllers.Auth.isAuthenticated, mUploads, controllers.User.addMessage);
users.route('/:userId/messages/:messageId')
  .get(controllers.Auth.isAuthenticated, controllers.User.getMessage)
  .put(controllers.Auth.isAuthenticated, mUploads, controllers.User.updateMessage)
  .delete(controllers.Auth.isAuthenticated, controllers.User.deleteMessage);


/**
* This handles the '.../freelancers/' and
* '.../freelancers/:id/' routes
*/
var freelancers = express.Router();
freelancers.route('/')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getAll)
  .post(controllers.Auth.isAuthenticated, controllers.Freelancer.add);
freelancers.route('/:userId')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.get)
  .put(controllers.Auth.isAuthenticated, controllers.Freelancer.update)
  .delete(controllers.Auth.isAuthenticated, controllers.Freelancer.delete);

/**
* This handles the '.../freelancers/:userId/teams/'
* and '.../freelancers/:id/' routes
*/
freelancers.route('/:userId/teams')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getTeams)
  .post(controllers.Auth.isAuthenticated, controllers.Freelancer.createTeam);
freelancers.route('/:userId/teams/:teamId')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getTeam)
  .post(controllers.Auth.isAuthenticated, controllers.Freelancer.addToTeam)
  .put(controllers.Auth.isAuthenticated, controllers.Freelancer.updateTeam)
  .delete(controllers.Auth.isAuthenticated, controllers.Freelancer.deleteTeam);
freelancers.route('/:userId/teams/:teamId/leave-team')
  .delete(controllers.Auth.isAuthenticated, controllers.Freelancer.leaveTeam);

/**
* This handles the '.../freelancers/:userId/portfolios/'
* and '.../freelancers/:id/' routes
*/
freelancers.route('/:userId/portfolios')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getAllPortfolios)
  .post(controllers.Auth.isAuthenticated, upload.single('portf'), controllers.Freelancer.addPortfolio);
freelancers.route('/:userId/portfolios/:pId')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getPortfolio)
  .put(controllers.Auth.isAuthenticated, upload.single('portf'), controllers.Freelancer.updatePortfolio)
  .delete(controllers.Auth.isAuthenticated, controllers.Freelancer.deletePortfolio);

/**
* This handles the '.../freelancers/:userId/verifications/'
* and '.../freelancers/:id/' routes
*/
// Prep the Upload fields
var vUploads = upload.fields([
  { name: 'natid', maxCount: 1},
  { name: 'dlsc', maxCount: 1 },
  { name: 'npbil', maxCount: 1 }
]);
freelancers.route('/:userId/verifications')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getAllVerifications)
  .post(controllers.Auth.isAuthenticated, vUploads, controllers.Freelancer.addVerification);
freelancers.route('/:userId/verifications/:vId')
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getVerification)
  .put(controllers.Auth.isAuthenticated, vUploads, controllers.Freelancer.updateVerification)
  .delete(controllers.Auth.isAuthenticated, controllers.Freelancer.deleteVerification);

/**
* To handle the categories resource of Freelancers
* ex. .../freelancers/designers and .../freelancers/designers/:id
*
* NOTE: This is separate from the Freelancer Router because of path clashes
*/
var categories = express.Router();
categories.route(/(designers|event-planners|makeup-artists|photographers|videographers)(\/|)$/)
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getByCategories);
categories.route(/(designers|event-planners|makeup-artists|photographers|videographers)\/(.)+(\/|)$/)
  .get(controllers.Auth.isAuthenticated, controllers.Freelancer.getByParse);


/**
* To handle the Teams resource
*/
var teams = express.Router();
teams.route('/')
  .get(controllers.Auth.isAuthenticated, controllers.Team.getAll);
teams.route('/:teamId')
  .get(controllers.Auth.isAuthenticated, controllers.Team.get);


/**
* To handle the Portfolios Controller
*/
var portfolios = express.Router();
// For Portfolios
portfolios.route('/')
  .get(controllers.Auth.isAuthenticated, controllers.Portfolio.getAll);
portfolios.route('/:pId')
  .get(controllers.Auth.isAuthenticated, controllers.Portfolio.get);


/**
* To handle the EventCentres resource
*/
var eventCentres = express.Router();
eventCentres.route('/')
  .get(controllers.Auth.isAuthenticated, controllers.EventCentre.getAll)
  .post(controllers.Auth.isAuthenticated, controllers.EventCentre.add);
eventCentres.route('/:id')
  .get(controllers.Auth.isAuthenticated, controllers.EventCentre.get)
  .put(controllers.Auth.isAuthenticated, controllers.EventCentre.update)
  .delete(controllers.Auth.isAuthenticated, controllers.EventCentre.delete);


module.exports.freelancers = freelancers;
module.exports.categories = categories;
module.exports.teams = teams;
module.exports.portfolios = portfolios;
module.exports.users = users;
module.exports.eventCentres = eventCentres;
