const Portfolio = require('../models/portfolio');

// Route handler to GET all Portfolios
exports.getAll = (req, res, next) => {
  getAllPortfolios({}, (portfolios) => {
    res.send(portfolios);
  }, next);
};

// Route handler to GET a particular Portfolio
exports.get = (req, res, next) => {
  getPortfolio(req.params.pId, (portfolio) => {
    res.send(portfolio);
  }, next);
};

/**
* Helper functions
*/
function getAllPortfolios(params, done, next){
  Portfolio.find(params).then((portfolios) => {
    if(!portfolios) return done({error: 'No Portfolio found'});
    return done(portfolios);
  }).catch(next);
}

function getPortfolio(id, done, next){
  Portfolio.findOne({ _id: id }).then((portfolio) => {
    if(!portfolio) return done({error: 'Portfolio not found'});
    return done(portfolio);
  }).catch(next);
}

function addPortfolio(object, done, next){
  Portfolio.create(object).then((portfolio) => {
    return done(portfolio);
  }).catch(next);
}

function updatePortfolio(id, object, done, next){
  Portfolio.findOneAndUpdate({ _id: id}, object).then((portfolio) => {
    getPortfolio(portfolio._id, (portf) => {
      return done(portf);
    }, next);
  }).catch(next);
}

function deletePortfolio(id, done, next){
  Portfolio.findOneAndRemove({ _id: id}).then((portfolio) => {
    return done(portfolio);
  }).catch(next);
}

exports.getAllPortfolios = getAllPortfolios;
exports.getPortfolio = getPortfolio;
exports.addPortfolio = addPortfolio;
exports.updatePortfolio = updatePortfolio;
exports.deletePortfolio = deletePortfolio;
