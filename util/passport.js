/**
 * Passport module.
 * @module util/passport
 */

const rule = require('../util/rule');

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const getLocalLoginStrategy = () => {
    return new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        const {withErrors, data} = PER.helper.validate(req, rule.login);

        if (withErrors) {
            return done(null, false);
        }

        PER.model.user.validateCredentials(data.email, data.password)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                PER.helper.error(err, req, done, '', data);
            });
    });
};

const getLocalSignUpStrategy = () => {
    return new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        const {withErrors, data} = PER.helper.validate(req, rule.signup);

        if (withErrors) {
            return done(null, false);
        }

        PER.model.sequelize
            .transaction(trs => {
                return PER.model.user
                    .create({
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        provider_type: PER.const.PROVIDER_WEB
                    }, {transaction: trs})
                    .then(user => {
                        PER.emailjs.sendConfirmAccount(user, req, errEmail => {
                            PER.helper.callbackEmail(errEmail, false);
                            return done(null, user);
                        });
                    }, {transaction: trs});
            })
            .catch(err => {
                if (err.message === 'errPendingActivateAccount') {
                    req.flash('email', data.email);
                    return done(err, false);
                }

                PER.log.error(err.message);

                if (err.message !== 'errInternalSendMail' &&
                        err.message !== 'errUsernameExists' &&
                        err.message.indexOf('errAccountExists') === -1) {
                    err.message = 'errInternalCreateUser';
                }

                PER.helper.error(err, req, done, '', data);
            });
    });
};

const findOrCreateUser = (req, token, refreshToken, profile, done, providerType) => {
    process.nextTick(() => {
        const defaults = {provider_token: token};
        const where = {provider_type: providerType};

        if (providerType === PER.const.PROVIDER_TWITTER) {
            const names = profile.displayName.split(' ');

            defaults.firstname = names[0] ? names[0] : '';
            defaults.lastname = names[1] ? names[1] : '';
            defaults.username = profile.username;

            where.provider_id = profile.id_str;
            where.email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        } else {
            defaults.firstname = profile.name.givenName;
            defaults.lastname = profile.name.familyName;

            where.provider_id = profile.id;
            where.email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        }

        return PER.model.user
            .findOrCreate({where: where, defaults: defaults})
            .spread(user => {
                return done(null, user);
            })
            .catch(err => {
                PER.log.error(err.message);
                req.flash('emailError', PER.helper.maskEmail(where.email));
                return done(err, false, {email: where.email});
            });
    });
};

const getGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: PER.config.auth.google.clientID,
        clientSecret: PER.config.auth.google.clientSecret,
        callbackURL: PER.config.auth.google.callbackURL,
        passReqToCallback: true
    },
    (req, token, refreshToken, profile, done) => {
        findOrCreateUser(req, token, refreshToken, profile, done, PER.const.PROVIDER_GOOGLE);
    });
};

const getFacebookStrategy = () => {
    return new FacebookStrategy({
        clientID: PER.config.auth.facebook.clientID,
        clientSecret: PER.config.auth.facebook.clientSecret,
        callbackURL: PER.config.auth.facebook.callbackURL,
        profileFields: ['id', 'emails', 'name'],
        passReqToCallback: true
    },
    (req, token, refreshToken, profile, done) => {
        findOrCreateUser(req, token, refreshToken, profile, done, PER.const.PROVIDER_FACEBOOK);
    });
};

const getTwitterStrategy = () => {
    return new TwitterStrategy({
        consumerKey: PER.config.auth.twitter.consumerKey,
        consumerSecret: PER.config.auth.twitter.consumerSecret,
        callbackURL: PER.config.auth.twitter.callbackURL,
        userProfileURL: PER.config.auth.twitter.userProfileURL,
        passReqToCallback: true
    },
    (req, token, refreshToken, profile, done) => {
        findOrCreateUser(req, token, refreshToken, profile, done, PER.const.PROVIDER_TWITTER);
    });
};

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        PER.model.user
            .findByField('email', user.email, true)
            .then(userFound => {
                done(null, userFound);

                // Add for avoid
                // Warning: a promise was created in a handler see http://goo.gl/rRqMUw
                return null;
            })
            .catch(err => {
                PER.log.error(err.message);
                done(err, null);
            });
    });

    passport.use('local-login', getLocalLoginStrategy());
    passport.use('local-signup', getLocalSignUpStrategy());
    passport.use('google', getGoogleStrategy());
    passport.use('facebook', getFacebookStrategy());
    passport.use('twitter', getTwitterStrategy());
};