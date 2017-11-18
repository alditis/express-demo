/**
 * Validte module.
 * @module util/validate
 */
const validate = require("validate.js");
validate.options = PER.config.validate;
module.exports = validate;