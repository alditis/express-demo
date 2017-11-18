/**
 * Application module.
 * @module app
 */

/**
 * Avoid load .env file on production enviroment.
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    require('dotenv-safe').load();
}

/**
 * Define global variables on namespace PER
 * for avoid colitions with others global variables.
 */
global.PER = {};

PER.helper = require('./util/helper');
PER.config = require('./config');
PER.const = require('./util/const');
PER.emailjs = require('./util/emailjs');
PER.model = require('./db/model');
PER.validate = require('./util/validate');
PER.log = require('./util/winston');

/**
 * Require modules.
 */
const express = require('express');
const logger = require('morgan');
const i18nModule = require("i18n-express");
const geolang = require("geolang-express");
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('req-flash');
const index = require('./route/index');
const user = require('./route/user');

/**
 * Create an express application.
 */
const app = express();

/**
 * Set view config.
 */
app.set('views', PER.config.app.views);
app.set('view engine', PER.config.app.engine);

/**
 * Add main middlewares.
 */
app.use(logger(PER.config.morgan));
app.use(favicon(PER.config.app.favicon));
app.use(express.static(PER.config.app.public));
app.use(cookieParser());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(PER.config.urlencoded));
app.use(session(PER.config.session));

/**
 * Add middlewares for flash messages.
 */
app.use(flash(PER.config.flash));

/**
 * Add middlewares for i18n.
 */
app.use(geolang(PER.config.geolang));
app.use(i18nModule(PER.config.i18n));

/**
 * Add middlewares for handle route.
 */
app.use('/', index);
app.use('/user', user);

/**
 * Add middleware to handle the error of page not found.
 * @function handleErrPageNotFound
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
    const err = new Error();
    err.status = PER.const.ERR_NOT_FOUND;
    res.render('general/error', {error: err});
});

/**
 * Add middleware to handle error on ejecution.
 * @function handleErrOnEjecution
 * @param {Object} err - Express error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((err, req, res) => {
    PER.log.error(err.stack);
    res.status(err.status || PER.const.ERR_INTERNAL_SERVER);
    res.render('general/error', {error: err});
});

module.exports = app;