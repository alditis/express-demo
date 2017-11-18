/**
 * Config application.
 * Values loaded of .env file
 * @module config
 */

const path = require('path');

module.exports = {

    /**
     * General for app
     * @member
     */
    app: {
        name: process.env.APP_NAME,
        port: parseInt(process.env.APP_PORT, 10),
        env: process.env.NODE_ENV,
        favicon: path.join(__dirname, 'public', 'img', 'favicon.ico'),
        views: path.join(__dirname, 'view'),
        engine: 'ejs',
        public: path.join(__dirname, 'public'),
        uriWelcome: 'welcome'
    },

    /**
     * Providers in PassportJS
     * @member
     */
    auth: {
        facebook: {
            clientID: process.env.FB_ID,
            clientSecret: process.env.FB_SECRET,
            callbackURL: process.env.FB_CALLBACK
        },
        google: {
            clientID: process.env.GG_ID,
            clientSecret: process.env.GG_SECRET,
            callbackURL: process.env.GG_CALLBACK
        },
        twitter: {
            consumerKey: process.env.TW_ID,
            consumerSecret: process.env.TW_SECRET,
            callbackURL: process.env.TW_CALLBACK,
            userProfileURL: process.env.TW_USER_PROFILE
        }
    },

    /**
     * Bcrypt for encrypt user's password.
     * @member
     */
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    },

    /**
     * Database for Sequelize.
     * @member
     */
    db: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: process.env.DB_POOL_MAX,
            min: process.env.DB_POOL_MIN,
            idle: process.env.DB_POOL_IDLE
        },
        logging: process.env.DB_LOGGING
    },

    /**
     * Emailjs.
     * @member
     */
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        ssl: process.env.EMAIL_SSL,
        port: process.env.EMAIL_PORT,
        signup: process.env.EMAIL_SIGNUP
    },

    /**
     * Flash message.
     * @member
     */
    flash: {
        locals: 'flash'
    },

    /**
     * Geolang i18n.
     * @member
     */
    geolang: {
        siteLangs: ['en', 'es']
    },

    /**
     * Languages i18n.
     * @member
     */
    i18n: {
        translationsPath: path.join(__dirname, 'i18n'),
        siteLangs: ['en', 'es'],
        textsVarName: 'i18n'
    },

    /**
     * Morgan.
     * @member
     */
    morgan: 'dev',

    /**
     * URL encoded.
     * @member
     */
    urlencoded: {
        extended: false
    },

    /**
     * ValidateJS for validate inputs data.
     * @member
     */
    validate: {
        format: 'flat'
    },

    /**
     * Session.
     * @member
     */
    session: {
        secret: process.env.SESSION_WORD,
        maxAge: parseInt(process.env.SESSION_AGE),
        httpOnly: PER.helper.getBoolean(process.env.SESSION_ONLY_HTTP)
    },

    /**
     * Wiston for log.
     * @member
     */
    winston: {
        info: {
            name: 'info',
            filename: path.join(__dirname, 'log', 'info.log'),
            level: 'info'
        },
        error: {
            name: 'error',
            filename: path.join(__dirname, 'log', 'error.log'),
            level: 'error'
        },
        debug: {
            name: 'debug',
            filename: path.join(__dirname, 'log', 'debug.log'),
            level: 'debug'
        }
    }
};