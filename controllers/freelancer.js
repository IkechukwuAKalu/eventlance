const FreelancerModel = require('../models/freelancer');
const UserController = require('./user');
const TeamController = require('./team');
const PortfolioController = require('./portfolio');
const VerificationController = require('./verification');

// Get all freelancers in a particular caetegory
exports.getAll = (req, res, next) => {
  getFreelancers(req.query, {}, (freelancers) => {
    res.send(freelancers);
  }, next);
};

// Get all the Freelancers based on Categories
exports.getByCategories = (req, res, next) => {
  var cat = req.originalUrl.split('/')[5]; // the caetegory
  var params = { categories: cat };
  getFreelancers(req.query, params, (freelancers) => {
    res.send(freelancers);
  }, next);
};

// Get a particular Freelancer using a parsed Id from the categories resource
exports.getByParse = (req, res, next) => {
  var id = req.originalUrl.split('/')[6]; // the UserId
  getFreelancer(id, (user, freelancer) => {
    res.send([user, freelancer]);
  }, next);
};

// Get a particular freelancer
exports.get = (req, res, next) => {
  getFreelancer(req.params.userId, (user, freelancer) => {
    res.send([user, freelancer]);
  }, next);
};

// Add a new freelancer after creating a User account first
exports.add = (req, res, next) => {
  req.body.created = Date.now();
  FreelancerModel.create(req.body).then((freelancer) => {
    res.send(freelancer);
  }).catch(next);
};

// Update freelancer
exports.update = (req, res, next) => {
  req.body.updated = Date.now();
  UserController.updateUser(req.params.userId, req.body, (user) => {
    if(user){
      updateFreelancer(user._id, req.body, (freelancer) => {
        if(!freelancer.error){
          getFreelancer(user._id, (user, freelancer) => {
            res.send([user, freelancer]);
          }, next);
        } else { res.send({error: 'Freelancer not found'}); }
      }, next);
    } else { res.send({error: 'User not found'}); }
  }, next);
};

// Delete freelancer
exports.delete = (req, res, next) => {
  UserController.deleteUser(req.params.userId, (user) => {
    if(user){
      FreelancerModel.findOneAndRemove({ userId: user._id }).then((freelancer) => {
        res.send([user, freelancer]);
      }).catch(next);
    } else { res.send({error: 'User not found'}); }
  }, next);
};

/**
* This section provides anonymous functions that handle teams on
* the freelancer resource
*/
//  Create a new Team
exports.createTeam = (req, res, next) => {
  req.body.leaderId = req.params.userId;
  TeamController.createTeam(req.body, (team) => {
    res.send(team);
  }, next);
};

// Add a freelancer specified in 'req.body.memberId' to a Team
exports.addToTeam = (req, res, next) => {
  TeamController.addToTeam(req.params.teamId, req.params.userId, req.body.memberId, (team) => {
    res.send(team);
  }, next);
};

// Returns all teams the Freelancer belongs to
exports.getTeams = (req, res, next) => {
  TeamController.getMyTeams(req.params.userId, (myTeams) => {
    res.send(myTeams);
  }, next);
};

// Gets a particular Team
exports.getTeam = (req, res, next) => {
  TeamController.getTeam(req.params.teamId, (team) => {
    res.send(team);
  }, next);
};

// Updates a particular Team data
exports.updateTeam = (req, res, next) => {
  TeamController.updateTeam(req.params.teamId, req.body, (team) => {
    res.send(team);
  }, next);
};

// Removes a Freelancer from a Team
exports.leaveTeam = (req, res, next) => {
  TeamController.removeUser(req.params.teamId, req.params.userId, req.body.removeId, (freelancer) => {
    res.send(freelancer);
  }, next);
};

// Deletes a Team and all of its Freelancers
exports.deleteTeam = (req, res, next) => {
  TeamController.deleteTeam(req.params.teamId, req.params.userId, (result) => {
    res.send(((result) ? {success: true} : {success: false}));
  }, next);
};

/**
* Handles the Portfolios resource
*/
exports.getAllPortfolios = (req, res, next) => {
  req.query.userId = req.params.userId; // Get ones belonging to the User
  PortfolioController.getAllPortfolios(req.query, (portfolios) => {
    res.send(portfolios);
  }, next);
};

exports.getPortfolio = (req, res, next) => {
  PortfolioController.getPortfolio(req.params.pId, (portfolio) => {
    res.send(portfolio);
  }, next);
};

/**
* Uploads a Portfolio File
* input file portf - Portfolio
*/
exports.addPortfolio = (req, res, next) => {
  req.body.userId = req.params.userId;
  req.body.filePath = req.file.filename;
  PortfolioController.addPortfolio(req.body, (portfolio) => {
    res.send(portfolio);
  }, next);
};

exports.updatePortfolio = (req, res, next) => {
  PortfolioController.updatePortfolio(req.params.pId, req.body, (portfolio) => {
    res.send(portfolio);
  }, next);
};

exports.deletePortfolio = (req, res, next) => {
  PortfolioController.deletePortfolio(req.params.pId, (portfolio) => {
    res.send(portfolio);
  }, next);
};

/**
* Handles the Verifications resource
*/
exports.getAllVerifications = (req, res, next) => {
  req.query.userId = req.params.userId;
  VerificationController.getAllVerifications(req.query, (verifications) => {
    res.send(verifications);
  }, next);
};

exports.getVerification = (req, res, next) => {
  VerificationController.getVerification(req.params.vId, (verification) => {
    res.send(verification);
  }, next);
};

/**
* Uploads the verification files via a multipart/form-data enctype
* input file natid - National ID card
* input file npbil - Nepa Bill
* input file dlsc - Drivers' Liscence
*/
exports.addVerification = (req, res, next) => {
  // Create the Properties for the Schema
  req.body.userId = req.params.userId;
  var files = VerificationController.checkFiles(req.files);
  // Pass the uploaded files to the req.body Object
  var body = Object.assign(req.body, files);
  VerificationController.addVerification(body, (verification) => {
    res.send(verification);
  }, next);
};

exports.updateVerification = (req, res, next) => {
  var files = VerificationController.checkFiles(req.files);
  // Pass the uploaded files to the req.body Object
  var body = Object.assign(req.body, files);
  VerificationController.updateVerification(req.params.vId, body, (verification) => {
    res.send(verification);
  }, next);
};

exports.deleteVerification = (req, res, next) => {
  VerificationController.deleteVerification(req.params.vId, (verification) => {
    res.send(verification);
  }, next);
};

// Helper function to get a particular Freelancer
function getFreelancer(uid, done, next){
  UserController.getUser(uid, (user) => {
    if(user){
      FreelancerModel.findOne({ userId : user._id }).then((freelancer) => {
        if(!freelancer) return done({error: 'Freelancer not found'});
        return done(user, freelancer);
      }).catch(next);
    }else{ return done({error: 'User not found'}); }
  }, next);
}

// Helper function - Gets Freelancers based on a filter in 'params'
function getFreelancers(userParams, freelancerParams, done, next){
  userParams.type = 1; // Select ony freelancers
  UserController.getUsers(userParams, (users) => {
    FreelancerModel.find(freelancerParams).then((freelancers) => {
      return done(freelancers);
    }).catch(next);
  }, next);
}

// Helper function to update a particular Freelancer
function updateFreelancer(fid, object, done, next){
  FreelancerModel.findOneAndUpdate({ _id: fid }, object).then((freelancer) => {
    if(freelancer){
      getFreelancer(freelancer._id, (f) => {
        return done(f);
      }, next);
    } else { return done({error: 'Freelancer not found'}); }
  }).catch(next);
}

exports.getFreelancer = getFreelancer;
exports.getFreelancers = getFreelancers;
exports.updateFreelancer = updateFreelancer;
