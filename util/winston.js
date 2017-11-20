/**
 * Winston module.
 * @module util/winston
 */

/**
 * Require module.
 */
const winston = require('winston');

/**
 * Create logger.
 * @function createLogger
 * @param {JSON} options - Options of config
 */
const log = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File(PER.config.winston.info),
        new winston.transports.File(PER.config.winston.error),
        new winston.transports.File(PER.config.winston.debug)
    ]
});

if (PER.config.env.name !== PER.const.ENV.PRODUCTION) {
    log.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = log;