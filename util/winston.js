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
module.exports = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File(PER.config.winston.info),
        new winston.transports.File(PER.config.winston.error),
        new winston.transports.File(PER.config.winston.debug)
    ]
});