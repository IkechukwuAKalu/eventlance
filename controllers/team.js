const Team = require('../models/team');
const FreelancerController = require('./freelancer');

// Returns all the teams for the Teams resource using a Filter
exports.getAll = (req, res, next) => {
  getAllTeams(req.query, (teams) => {
    res.send(teams);
  }, next);
};

// Returns a particular Team via an _id
exports.get = (req, res, next) => {
  getTeam(req.params.teamId, (team) => {
    res.send(team);
  }, next);
};

// Get all the available Teams
function getAllTeams(params, done, next){
  Team.find(params).then((teams) => {
    if(!teams) return done({error: 'No Team found'});
    return done(teams);
  }).catch(next);
}

// Get the array of Teams of the freelancer, then loop through each element
// and add the Teams that matches to the array
function getMyTeams(userId, done, next){
  FreelancerController.getFreelancer(userId, (user, freelancer) => {
    if(freelancer){
      getAllTeams({ _id: freelancer.teams}, (teams) => {
        if(!teams) return done({error: 'No Team found'});
        return done(teams);
      }, next);
    } else { return done([]); }
  }, next);
}

// Get a particular Team
function getTeam(teamId, done, next){
  Team.findOne({ _id: teamId }).then((team) => {
    if(!team) return done({error: 'Team not found'});
    return done(team);
  }).catch(next);
}

// Create a new Team
function createTeam(object, done, next){
  // Check if the User exists first
  FreelancerController.getFreelancer(object.leaderId, (user, freelancer) => {
    if(freelancer){
      // Add the leader to the Members list
      object.created = Date.now();
      object.members = [{ uId: object.leaderId, joined: Date.now() }];
      Team.create(object).then((team) => {
        // Update the Freelancer's teams List
        freelancer.teams.push(team._id);
        FreelancerController.updateFreelancer(freelancer._id, freelancer, (f) => {
          return done(team);
        }, next);
      }).catch(next);
    } else { return done({ error: 'Freelancer does not exist' }); }
  }, next);
}

// Add a freelancer to a Team
function addToTeam(teamId, leaderId, userId, done, next){
  // Check if the Team and Freelanecer exists before doing any Insertions
  getTeam(teamId, (team) => {
    if(team){
      FreelancerController.getFreelancer(userId, (user, freelancer) => {
        // Make sure the User exists and the Adder is already a team member
        if(freelancer && team.leaderId === leaderId){
          // New Member Schema for the array
          var member = {
            uId: userId,
            joined: Date.now()
          };
          team.members.push(member);
          Team.findOneAndUpdate({ _id: teamId}, team).then((newTeam) => {
            // Now add the team to the freelancer's list
            freelancer.teams.push(teamId);
            FreelancerController.updateFreelancer(freelancer._id, freelancer, (freelancer) => {
              return done(team);
            }, next);
          }).catch(next);
        } else { return done({ error: 'Freelancer does not exist'}); }
      }, next);
    } else { return done({ error: 'Team not found'}); }
  }, next);
}

// Updates a Team
function updateTeam(teamId, object, done, next){
  object.updated = Date.now();
  if(object.members) delete object.members; // Prevent updating the members List
  Team.findOneAndUpdate({ _id: teamId }, object).then((team) => {
    if(team){
      getTeam(teamId, (newTeam) => {
        return done(newTeam);
      }, next);
    } else { return done({ error: 'Team not found' }); }
  }).catch(next);
}

// Removes a Freelancer from a Team
function removeUser(teamId, leaderId, removeId, done, next){
  getTeam(teamId, (team) => {
    // Check if the Team exists
    if(team && (team.leaderId === leaderId) || (leaderId === removeId)){
      // Check if the User exists first
      FreelancerController.getFreelancer(removeId, (user, freelancer) => {
        if(freelancer){
          // Remove the Member Object of the User
          team.members = team.members.filter((member) => {
            return member.uId !== removeId;
          });
          Team.findOneAndUpdate({ _id: teamId }, team).then((newTeam) => {
            // Now remove the team from the freelancer's list
            freelancer.teams = freelancer.teams.filter((t) => {
              return t !== teamId;
            });
            FreelancerController.updateFreelancer(freelancer._id, freelancer, (f) => {
              return done(team);
            }, next);
          }).catch(next);
        } else { return done({error: 'Freelancer to remove, not found'}); }
      });
    } else { return done({ error: 'User needs to be the Team Leader' }); }
  }, next);
}

// Deletes a Team and its members
function deleteTeam(teamId, leaderId, done, next){
  getTeam(teamId, (team) => {
    if (team && team.leaderId === leaderId) {
      var member = {};
      for(var i = 0; i < (team.members.length + 1); i++){
        member = team.members[i];
        if(i == team.members.length){
          Team.findOneAndRemove({ _id: teamId}).then((team) => {
            return done(true);
          }).catch(next);
        } else {
          removeUser(teamId, leaderId, member.uId, (gone) => {}, next);
        }
      }
      //return done(true);
    } else { return done(false); }
  }, next);
}

exports.getAllTeams = getAllTeams;
exports.getMyTeams = getMyTeams;
exports.getTeam = getTeam;
exports.createTeam = createTeam;
exports.addToTeam = addToTeam;
exports.updateTeam = updateTeam;
exports.removeUser = removeUser;
exports.deleteTeam = deleteTeam;
