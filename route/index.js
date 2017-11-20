/**
 * Route index.
 * @module route/index
 */

/**
 * Create router object.
 */
const express = require('express');
const router = express.Router();

/**
 * Create passport object to router.
 */
const passport = require('passport');
require('../util/passport.js')(passport);
router.use(passport.initialize());
router.use(passport.session());

/**
 * Rules of validation for validate.js.
 */
const rule = require('../util/rule');

/**
 * Get index page.
 * @function index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/', (req, res) => {
    res.redirect('/login');
});

/**
 * Get login page.
 * @function get/login
 * @param {string} path - Express path
 * @param {function} noCacheRoute - Function for not cache
 * @param {function} isAuthenticated - Function for validate authenticate
 * @param {function} middleware - Function for show login page
 */
router.get('/login', PER.helper.noCacheRoute, PER.helper.isAuthenticated, (req, res) => {
    res.render('visitor/login');
});

/**
 * Send data post for login.
 * @function post/login
 * @param {string} path - Express path
 * @param {function} middleware - Function for authenticate with PassportsJS
 */
router.post('/login', passport.authenticate('local-login', {
    successReturnToOrRedirect: '/user/' + PER.config.app.uriWelcome,
    failureRedirect: '/login',
    failureFlash: true
}));

/**
 * Get signup page.
 * @function get/signup
 * @param {string} path - Express path
 * @param {function} noCacheRoute - Function for not cache
 * @param {function} isAuthenticated - Function for validate authenticate
 * @param {function} middleware - Function for show signup page
 */
router.get('/signup', PER.helper.noCacheRoute, PER.helper.isAuthenticated, (req, res) => {
    res.render('visitor/signup');
});

/**
 * Send data post for signup.
 * @function post/signup
 * @param {string} path - Express path
 * @param {function} middleware - Function for signup with PassportsJS
 */
router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user) => {
        if (err) {
            if (err.message === 'errPendingActivateAccount') {
                return res.render('visitor/send_activate_account', {email: req.flash('email')});
            }
            return next(err);
        }

        if (!user) {
            return res.redirect('/signup');
        }

        res.render('visitor/signup_message', {user: user});
    })(req, res, next);
});

/**
 * Get signup confirm page.
 * @function get/signup/confirm
 * @param {string} path - Express path
 * content {string} :token - Token for activate account
 * and {string} :email - Email user's address
 * @param {function} middleware - Function for show signup confirm page
 */
router.get('/signup/confirm/:token/:email', (req, res) => {
    const {withErrors, data} = PER.helper.validate(req, rule.tokenEmail, false);

    if (withErrors) {
        return res.redirect('/signup');
    }

    PER.model.user
        .activateAccount(data.token, data.email)
        .then(user => {
            PER.emailjs.sendWelcome(user, req, errEmail => {
                return PER.helper.callbackEmail(errEmail, true, req, res, user);
            });
        })
        .catch(err => {
            PER.helper.error(err, req, res, '/signup');
        });
});

/**
 * Get forgot password page.
 * @function get/forgot
 * @param {string} path - Express path
 * @param {function} noCacheRoute - Function for not cache
 * @param {function} isAuthenticated - Function for validate authenticate
 * @param {function} middleware - Function for show forgot password page
 */
router.get('/forgot', PER.helper.noCacheRoute, PER.helper.isAuthenticated, (req, res) => {
    res.render('visitor/forgot');
});

/**
 * Send data post to forgot password request.
 * @function post/forgot
 * @param {string} path - Express path
 * @param {function} middleware - Function for show confirm request page
 */
router.post('/forgot', (req, res) => {
    const {withErrors, data} = PER.helper.validate(req, rule.forgotPassword);

    if (withErrors) {
        return res.redirect('/forgot');
    }

    PER.model.user
        .setNewToken(data.email, PER.const.TOKEN.PASSWORD_RESET)
        .then(user => {
            PER.emailjs.sendPasswordReset(user, req, errEmail => {
                PER.helper.callbackEmail(errEmail, false);
                return res.render('visitor/forgot_message', {user: user});
            });
        })
        .catch(err => {
            PER.helper.error(err, req, res, '/forgot');
        });
});

/**
 * Get reset password page for user do change password.
 * @function post/reset/confirm
 * @param {string} path - Express path
 * content {string} :token - Token for reset password
 * and {string} :email - Email user's address
 * @param {function} middleware - Function for show reset password page
 */
router.get('/reset/:token/:email', (req, res) => {
    const {withErrors, data} = PER.helper.validate(req, rule.tokenEmail, false);

    if (withErrors) {
        return res.redirect('/forgot');
    }

    PER.model.user
        .findTokenOwner(data.token, data.email, PER.const.TOKEN.PASSWORD_RESET)
        .then(user => {
            res.render('visitor/reset', {data: data, user: user});
        })
        .catch(err => {
            PER.helper.error(err, req, res, '/forgot');
        });
});

/**
 * Send data post to reset password.
 * @function post/reset
 * @param {string} path - Express path
 * @param {function} middleware - Function for init session with new password
 */
router.post('/reset', (req, res) => {
    const {withErrors, data} = PER.helper.validate(req, rule.resetPassword);

    if (withErrors) {
        return res.redirect('/forgot');
    }

    PER.model.user.resetPassword(data.token, data.email, data.password)
        .then(user => {
            PER.emailjs.sendPasswordResetSuccess(user, req, errEmail => {
                return PER.helper.callbackEmail(errEmail, true, req, res, user);
            });
        })
        .catch(err => {
            PER.helper.error(err, req, res, '/forgot');
        });
});

/**
 * Send again email for Activate Account for case when
 * the user already have an pending activation account.
 * @function post/activate/account
 * @param {string} path - Express path
 * @param {function} middleware - Function for show confirm page
 */
router.post('/activate/account', (req, res) => {
    const {withErrors, data} = PER.helper.validate(req, rule.activateAccount);

    if (withErrors) {
        return res.redirect('/signup');
    }

    PER.model.user.setNewToken(data.email, PER.const.TOKEN.ACTIVATION)
        .then(userUpd => {
            PER.emailjs.sendConfirmAccount(userUpd, req, errEmail => {
                PER.helper.callbackEmail(errEmail, false);
                return res.render('visitor/signup_message', {user: userUpd});
            });
        })
        .catch(err => {
            PER.helper.error(err, req, res, '/signup');
        });
});

/**
 * Begin authenticate with providers: Google, Facebook and Twitter.
 * @example
 * URI's in icons on login page:
 *     http://localhost:3000/auth/google
 *     http://localhost:3000/auth/facebook
 *     http://localhost:3000/auth/twitter
 * @function get/auth/:provider
 * @param {string} path - Express path
 * content {string} :provider - Provider identifier
 * @param {function} middleware - Function for init authenticate with PassportJS
 */
router.get('/auth/:provider', (req, res, next) => {
    passport.authenticate(req.params.provider, {scope: ['email']})(req, res, next);
});

/**
 * Complete authenticate with providers: Google, Facebook and Twitter.
 * @example
 * URL main in providers on localhost:
 *     http://localhost:3000
 * And validate OAuth redirects:
 *     http://localhost:3000/auth/google/callback
 *     http://localhost:3000/auth/facebook/callback
 *     http://localhost:3000/auth/twitter/callback
 * @function get/auth/:provider/callback
 * @param {string} path - Express path
 * content {string} :provider - Provider identifier
 * @param {function} middleware - Function for complete authenticate with PassportJS
 */
router.get('/auth/:provider/callback', (req, res, next) => {
    passport.authenticate(req.params.provider, (err, user) => {
        if (err) {
            return PER.helper.error(err, req, res, '/login');
        }

        if (user) {
            return PER.helper.login(req, res, user);
        }

        const errUser = new Error('errUserNotFound');
        return PER.helper.error(errUser, req, res, '/login');
    })(req, res, next);
});

/**
 * Handle language change.
 * @example
 *     http://localhost:3000/i18n/es
 *     http://localhost:3000/i18n/en
 * @function get/i18n/:lang
 * @param {string} path - Express path
 * content {string} :lang - Language identifier
 * @param {function} middleware - Function to set language
 */
router.get('/i18n/:lang', (req, res) => {
    req.session.ulang = req.params.lang;
    res.redirect('back');
});

module.exports = router;