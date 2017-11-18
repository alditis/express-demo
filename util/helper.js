/**
 * Helper module.
 * @module util/helper
 */

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const window = (new JSDOM('')).window;
const dompurify = createDOMPurify(window);
const randomstring = require("randomstring");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const http = require('http');
const ejs = require('ejs');

const ejsRender = (str, data = null) => {
    return ejs.render(str, data);
}

const dump = (arr, print = true, level = 0) => {
    try {
        let dumped_text = '[';
        if (!level) { level = 0; }

        let level_padding = '';

        for (let num = 0; num < level + 1; num += 1) {
            level_padding += '    ';
        }

        if (typeof arr === 'object') {
            for (const item in arr) {
                if (Object.prototype.hasOwnProperty.call(arr, item)) {
                    const value = arr[item];

                    if (typeof value === 'object') {
                        dumped_text += level_padding + "'" + item + "' ...\n";
                        dumped_text += dump(value, print, level + 1);
                    } else {
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }
            }
        } else {
            dumped_text = '==>' + arr + '<==(' + typeof arr + ')';
        }

        dumped_text += ']';

        if (print) {
            console.log(dumped_text);
        } else {
            return dumped_text;
        }
    } catch (err) {
        console.log(err.message);
        return false;
    }
};

const sanitize = data => {
    const result = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            result[key] = dompurify.sanitize(data[key]);
        }
    }
    return result;
};

const getUserFromEmail = email => {
    return email.split('@')[0];
};

const getProviderName = providerType => {
    return PER.const.PROVIDERS[providerType];
};

const generateUsername = user => {
    let username = '';

    switch (user.provider_type) {
        case PER.const.PROVIDER_GOOGLE:
            username = getUserFromEmail(user.email);
            break;
        case PER.const.PROVIDER_TWITTER:
            username = user.username;
            break;
        case PER.const.PROVIDER_FACEBOOK:
            username = user.firstname +
                    user.lastname.slice(0, 1) +
                    user.provider_id.slice(PER.const.LIMIT_ID_FACEBOOK);
            break;
        default:
            PER.log.debug('Unknow provider');
            break;
    }

    username += PER.const.USERNAME_SEPARATOR + getProviderName(user.provider_type);

    return username.trim().toLowerCase();
};

const generateUsernameProviderId = user => {
    return user.provider_id + getProviderName(user.provider_type);
};

const inSession = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
};

const noCacheRoute = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/user/' + PER.config.app.uriWelcome);
    }
    next();
};

const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const maskEmail = str => {
    const pos = str.indexOf('@');
    return str[0] + '...' + str[pos - 1] + str.slice(pos);
};

const randomString = () => {
    return randomstring.generate();
};

const getToken = () => {
    return crypto.randomBytes(PER.const.TOKEN_SIZE).toString('hex');
};

const getTokenExpires = () => {
    return Date.now() + PER.const.TOKEN_EXPIRES_TIME;
};

const getBaseUrl = req => {
    return req.protocol + '://' + req.headers.host + '/';
};

const login = (req, res, user) => {
    req.login(user, err => {
        if (err) {
            PER.log.error(err.message);
            throw new Error('errInitSession');
        }
        return res.redirect('/user/' + PER.config.app.uriWelcome);
    });
};

const callbackEmail = (err, initSession, req, res, user) => {
    if (err) {
        PER.log.error(err.message);
        throw new Error('errInternalSendMail');
    } else if (initSession) {
        return login(req, res, user);
    }
};

const getDBLogging = val => {
    let result = false;
    if (val.toLowerCase() !== "false") {
        result = console.log;
    }
    return result;
};

const isHiddenPath = path => {
    return (/(^|\/)\./g).test(path);
};

const compareHash = (hash, value) => {
    return bcrypt
        .compare(hash, value)
        .then(equals => {
            if (equals) {
                return true;
            }
            throw new Error('errHashCompare');
        })
        .catch(err => {
            if (err.message === 'errHashCompare') {
                throw err;
            } else {
                throw new Error('errInternalHashCompare');
            }
        });
};

const getHash = value => {
    return bcrypt
        .genSalt(PER.config.saltRounds)
        .catch(err => {
            PER.log.error(err.message);
            throw new Error('errInternalSalt');
        })
        .then(salt => {
            return bcrypt.hash(value, salt)
                .then(hash => {
                    return hash;
                })
                .catch(err => {
                    PER.log.error(err.message);
                    throw new Error('errInternalHash');
                });
        });
};

const error = (err, req, obj, uri = '', data = null) => {
    PER.log.error(err.message);
    req.flash('msgErr', err.message);

    if (data) {
        if (data.email) {
            req.flash('email', data.email);
        }

        if (data.username) {
            req.flash('username', data.username);
        }
    }

    if (obj instanceof http.ServerResponse) {
        return obj.redirect(uri);
    }
    return obj(null, false);
};

const validate = (req, rule, ofBody = true) => {
    let data = '';
    let withErrors = true;

    if (ofBody) {
        data = req.body;
    } else {
        data = req.params;
    }

    data = sanitize(data);
    const errors = PER.validate(data, rule);

    if (errors) {
        if (data.email) {
            req.flash('email', data.email);
        }

        if (data.username) {
            req.flash('username', data.username);
        }

        req.flash('msgValidate', errors);
    } else {
        withErrors = false;
    }
    return {withErrors, data};
};

const getBoolean = function(val){
    var falsy = /^(?:f(?:alse)?|no?|0+)$/i;

    return !falsy.test(val) && !!val;
};

module.exports = {
    callbackEmail: callbackEmail,
    capitalize: capitalize,
    compareHash: compareHash,
    dump: dump,
    ejsRender: ejsRender,
    error: error,
    generateUsername: generateUsername,
    generateUsernameProviderId: generateUsernameProviderId,
    getBaseUrl: getBaseUrl,
    getBoolean: getBoolean,
    getDBLogging: getDBLogging,
    getHash: getHash,
    getProviderName: getProviderName,
    getToken: getToken,
    getTokenExpires: getTokenExpires,
    inSession: inSession,
    isAuthenticated: isAuthenticated,
    isHiddenPath: isHiddenPath,
    login: login,
    maskEmail: maskEmail,
    noCacheRoute: noCacheRoute,
    randomString: randomString,
    sanitize: sanitize,
    validate: validate
};