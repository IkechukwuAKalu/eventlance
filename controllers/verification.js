const UserController = require('./user');
const Verification = require('../models/verification');

function getAllVerifications(params, done, next){
  Verification.find(params).then((verifications) => {
    if(!verifications) return done({error: 'No Verification found'});
    return done(verifications);
  }).catch(next);
}

// This returns a Verification by its Id
function getVerification(id, done, next){
  Verification.findOne({ _id: id }).then((verification) => {
    if(!verification) return done({error: 'Verification not found'});
    return done(verification);
  }).catch(next);
}

// This returns a Verification by custom parameters
function getVerificationByParams(params, done, next) {
  Verification.findOne(params).then((verification) => {
    if(!verification) return done({error: 'Verification not found'});
    return done(verification);
  }).catch(next);
}

// Adds a new Verification data to a User
function addVerification(object, done, next){
  // Check if the User actually uploaded a file yet
  if(object.nationalIDCard || object.nepaBill || object.driversLiscence) {
    // Check if the User has already uploaded a Verification before,
    // If YES, then just update instead
    getVerificationByParams({ userId: object.userId }, (verification) => {
      if (verification.error) {
        // This means he has not uploaded before, then add new
        Verification.create(object).then((verification) => {
          // Let it be noted that verification has been added
          UserController.updateUser({ _id: object.userId}, {verificationAdded: true}, (user) => {
            return done(verification);
          }, next);
        }).catch(next);
      } else {
        // He already has, then just Update
        updateVerification(verification._id, object, (v) => {
          return done(v);
        }, next);
      }
    }, next);
  } else { return done({error: "No file uploaded"}); }
}

// Updates an existing Verification
function updateVerification(id, object, done, next){
  Verification.findOneAndUpdate({ _id: id}, object).then((verification) => {
    getVerification(verification._id, (verify) => {
      return done(verify);
    }, next);
  }).catch(next);
}

// Deletes a Verification
function deleteVerification(vId, done, next){
  Verification.findOneAndRemove({ _id: vId}).then((verification) => {
    // Unset the verificationAdded flag from the User object
    UserController.updateUser({ _id: verification.userId}, {verificationAdded: false}, (user) => {
      return done(verification);
    }, next);
  }).catch(next);
}

/**
* Helper function to assign the correct files which have been uploaded
*/
function checkFiles(fObject){
  var files = {};
  if (fObject.natid) {
     files.nationalIDCard = { filePath: fObject.natid[0].filename };
  }
  if (fObject.npbil) {
    files.nepaBill = { filePath: fObject.npbil[0].filename };
  }
  if (fObject.dlsc) {
    files.driversLiscence = { filePath: fObject.dlsc[0].filename };
  }
  return files;
}

exports.getAllVerifications = getAllVerifications;
exports.getVerification = getVerification;
exports.addVerification = addVerification;
exports.updateVerification = updateVerification;
exports.deleteVerification = deleteVerification;
exports.checkFiles = checkFiles;
