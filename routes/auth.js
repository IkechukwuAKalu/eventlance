var passport = require('passport');
var router = require('express').Router();
var Auth = require('../controllers/auth');

// Use both LocalStrategy and BearerStrategy for Token access to enable the
// User object to be saved in req.user object to enable correct Token storage.
router.route('/token').post(passport.authenticate(['local', 'bearer'], {session: false}), Auth.token);
router.route('/login').post(Auth.isAuthenticated, Auth.login);
router.route('/signup').post(Auth.isAuthenticated, Auth.signup);
router.route('/logout').post(Auth.isAuthenticated, Auth.logout);

module.exports = router;
