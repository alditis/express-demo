/**
 * Route user.
 * @module route/user
 */

/**
 * Create router object.
 */
const express = require('express');
const router = express.Router();

/**
 * Call logout process.
 * @function get/logout
 * @param {string} path - Express path
 * @param {function} middleware - Function for logout process
 */
router.get('/logout', (req, res) => {
    // req.session.destroy(() => {
    req.session = null
    res.redirect('/login');
    // });
});

/**
 * Catch all request for avoid cache and check session.
 * @function get/*
 * @param {string} path - Express path
 * @param {function} noCacheRoute - Function for not cache
 * @param {function} inSession - Function for check session
 * @param {function} middleware - Function for continue request
 */
router.get('*', PER.helper.noCacheRoute, PER.helper.inSession, (req, res, next) => {
    next();
});

/**
 * Get welcome page.
 * @function get/welcome
 * @param {string} path - Express path
 * @param {function} middleware - Function for show page
 */
router.get('/' + PER.config.app.uriWelcome, (req, res) => {
    res.render('user/welcome', {user: req.user});
});

/**
 * Get chat page.
 * @function get/chat
 * @param {string} path - Express path
 * @param {function} middleware - Function for show page
 */
router.get('/chat', (req, res) => {
    res.render('user/chat', {user: req.user});
});

/**
 * Get profile page.
 * @function get/profile
 * @param {string} path - Express path
 * @param {function} middleware - Function for show page
 */
router.get('/profile', (req, res) => {
    res.render('user/profile', {user: req.user});
});

/**
 * Get settings page.
 * @function get/settings
 * @param {string} path - Express path
 * @param {function} middleware - Function for show page
 */
router.get('/settings', (req, res) => {
    res.render('user/settings', {user: req.user});
});

module.exports = router;