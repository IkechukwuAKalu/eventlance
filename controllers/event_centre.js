const mongoose = require('mongoose');

// Get all Centres
exports.getAll = (req, res) => {
  res.end('Get all Centres');
};

// Get a particular Centre
exports.get = (req, res) => {
  res.end('Get '+req.params.id);
};

// Add a new Centre
exports.add = (req, res) => {
  console.log(req.body);
  res.end('Adding freelancer');
};

// Update Centre
exports.update = (req, res) => {
  res.end('Updating '+req.params.id);
};

// Delete Centre
exports.delete = (req, res) => {
  res.end('Deleting '+req.params.id);
};
