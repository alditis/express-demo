/**
 * Model user.
 * @module model/user
 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
    const op = Sequelize.Op;

    /**
     * @function User
     * @param {int} id - Identifier.
     * @param {string} email - Email address.
     * @param {string} username - Username.
     * @param {string} password - Password encrypted.
     * @param {string} password_reset_token - Token for change password.
     * @param {datetime} password_reset_expires - Expires token for change password.
     * @param {boolean} is_username_tmp - if username is temporal. [0: False, 1: True].
     * @param {string} firstname - Firstname of user.
     * @param {string} lastname - Lastname of user.
     * @param {integer} gender - Gender of user. [0: None, 1: Female, 2: Male].
     * @param {date} date_birth - Date birth.
     * @param {string} phone_home - Number of phone home.
     * @param {string} phone_mobile - Number of phone mobile.
     * @param {string} address - Main address.
     * @param {string} state - State of address.
     * @param {string} city - City of address.
     * @param {string} post_code - Post code of address.
     * @param {char} country - Country of address.
     * @param {string} activation_token - Token for activate account.
     * @param {date} activation_expires - Expires of token for activate account.
     * @param {integer} type - User type. [0: Admin, 1: User, 2: Operator].
     * @param {integer} status - User status. [0: Deleted, 1: Active, 2: Disactive].
     * @param {integer} provider_type - Provider type. [1: Web, 2: Facebook, 3: Google, 4: Twitter].
     * @param {string} provider_id - ID send by the provider.
     * @param {string} provider_token - Token send by the provider.
     * @param {boolean} newsletter - Specify if the user enabled or not newsletter. [0: Off, 1: On].
     * @param {string} remember_token - Token for remember account.
     * @param {date} last_date_login - Last date of login.
     * @param {string} last_ip_login - Last ip of login.
     */
    const User = sequelize.define('user', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        email: {type: Sequelize.STRING},
        username: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_LARGE)},
        password: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_LARGE)},
        password_reset_token: {type: Sequelize.STRING},
        password_reset_expires: {type: Sequelize.DATE},
        is_username_tmp: {type: Sequelize.BOOLEAN, defaultValue: false},
        firstname: {type: Sequelize.STRING},
        lastname: {type: Sequelize.STRING},
        gender: {type: Sequelize.INTEGER, defaultValue: PER.const.DB.GENDER_NONE},
        date_birth: {type: Sequelize.DATEONLY},
        phone_home: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_MEDIUM)},
        phone_mobile: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_MEDIUM)},
        address: {type: Sequelize.STRING},
        state: {type: Sequelize.STRING},
        city: {type: Sequelize.STRING},
        post_code: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_SMALL)},
        country: {type: Sequelize.CHAR(PER.const.DB.SIZE_CHAR_TWO)},
        activation_token: {type: Sequelize.STRING},
        activation_expires: {type: Sequelize.DATE},
        type: {type: Sequelize.INTEGER, defaultValue: PER.const.DB.USER_TYPE_USER},
        status: {type: Sequelize.INTEGER, defaultValue: PER.const.DB.STATUS_INACTIVE},
        provider_type: {type: Sequelize.INTEGER, defaultValue: PER.const.PROVIDER_WEB},
        provider_id: {type: Sequelize.STRING},
        provider_token: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_BIG)},
        newsletter: {type: Sequelize.BOOLEAN, defaultValue: false},
        remember_token: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_LARGE)},
        last_date_login: {type: Sequelize.DATE},
        last_ip_login: {type: Sequelize.STRING(PER.const.DB.SIZE_TEXT_MEDIUM)}
    }, {
        comment:
            'is_username_tmp: [0: False, 1: True], ' +
            'gender: [0: None, 1: Female, 2: Male], ' +
            'status: [0: Deleted, 1: Active, 2: Disactive], ' +
            'type: [0: Admin, 1: User, 2: Operator], ' +
            'provider_type: [1: Web, 2: Facebook, 3: Google, 4: Twitter], ' +
            'newsletter: [0: Off, 1: On]'
    });

    /**
     * Execute before user create
     * @function beforeCreate
     * @return {User} The user for create.
     */
    User.beforeCreate(user => {
        if (user.provider_type === PER.const.PROVIDER_WEB) {
            // For sign ups user in the website's form
            return user.validateInternalUser();
        }
        // For Google, Facebook and Twitter
        return user.validateExternalUser();
    });

    /**
     * Execute before user update
     * @function beforeUpdate
     * @return {User} The user for update.
     */
    User.beforeUpdate(instance => {
        if (instance.changed('password')) {
            return instance.setPassword();
        }
    });

    /**
     * Validate data for user signup in form.
     * @function validateInternalUser
     * @return {User} The user validated and inicializated.
     */
    User.prototype.validateInternalUser = function() {
        // Checking if exists and is active the username
        return User
            .findByField('username', this.username, true)
            .then(user => {
                if (user) {
                    throw new Error('errUsernameExists');
                }

                // Checking if exists the email (active or inactive)
                return User.findByField('email', this.email)
                    .then(userFound => {
                        if (userFound) {
                            if (userFound.status === PER.const.DB.STATUS_INACTIVE) {
                                // Exists an pending account for activate
                                throw new Error('errPendingActivateAccount');
                            } else {
                                // Return 'errAccountExistsWW'
                                // 'errAccountExistsWW' defined on i18n files.
                                const sufix = PER.helper.getProviderName(userFound.provider_type);
                                const msg = `errAccountExists${sufix}`;
                                throw new Error(msg);
                            }
                        } else {
                            // Return user for be created for Sequelize
                            return this.setInitUserInternal();
                        }
                    });
            });
    };

    /**
     * Validate data for user of external provider:
     * Google, Facebook and Twitter.
     * @function validateExternalUser
     * @return {User} The user validated and inicializated.
     */
    User.prototype.validateExternalUser = function() {
        return User.findByField('email', this.email, true)
            .then(userFound => {
                if (userFound) {
                    if (this.provider_type === userFound.provider_type) {
                        return userFound;
                    }
                    const sufix = PER.helper.getProviderName(userFound.provider_type);
                    const msg = `errAccountExists${sufix}`;
                    throw new Error(msg);
                } else {
                    // Return user for be created for Sequelize
                    this.setInitUserExternal();
                }
            });
    };

    /**
     * Find an user not deleted by field and value specifys.
     * @function findByField
     * @param {string} field - Field in where condition.
     * @param {string} value - Value in where condition.
     * @param {boolean} [onlyActive=false] - If search only active users.
     * @return {User} The user found.
     */
    User.findByField = function(field, value, onlyActive = false) {
        const where = {
            [field]: value,
            deleted: null
        };

        if (onlyActive) {
            where.status = PER.const.DB.STATUS_ACTIVE;
        }

        return User
            .findOne({where: where})
            .then(user => { return user; });
    };

    /**
     * Set init values for fields:
     * status, activation_token and activation_expires.
     * Then call the method setPassword
     * @function setInitUserInternal
     * @return {User} The user modified.
     */
    User.prototype.setInitUserInternal = function() {
        this.status = PER.const.DB.STATUS_INACTIVE;
        this.activation_token = PER.helper.getToken();
        this.activation_expires = PER.helper.getTokenExpires();
        return this.setPassword();
    };

    /**
     * It set init value for status field.
     * Then call the method setUsername.
     * @function setInitUserExternal
     * @return {User} The user modified.
     */
    User.prototype.setInitUserExternal = function() {
        this.status = PER.const.DB.STATUS_ACTIVE;
        return this.setUsername();
    };

    /**
     * It set hash value to password field and
     * null to password_reset_token and password_reset_expires fields.
     * @function setPassword
     * @return {User} The user modified.
     */
    User.prototype.setPassword = function() {
        return PER.helper
            .getHash(this.password)
            .then(hash => {
                this.password = hash;
                this.password_reset_token = null;
                this.password_reset_expires = null;
                return this;
            });
    };

    /**
     * It set username for user external depending of type provider.
     * @function setUsername
     * @return {User} The user modified.
     */
    User.prototype.setUsername = function() {
        const username = PER.helper.generateUsername(this);

        return User.findByField('username', username)
            .then(user => {
                if (user) { throw new Error(); }
                this.username = username;
            })
            .catch(err => {
                PER.log.error(err.message);
                this.username = PER.helper.generateUsernameProviderId(this);
            })
            .then(() => {
                this.is_username_tmp = true;
            });
    };

    /**
     * It validate email and password.
     * @function validateCredentials
     * @param {string} email - Email address.
     * @param {string} password - Password not encripted.
     * @return {User} The user authenticated.
     */
    User.validateCredentials = function(email, password) {
        return User
            .findOne({where: {
                email: email,
                type: PER.const.DB.USER_TYPE_USER,
                status: PER.const.DB.STATUS_ACTIVE,
                provider_type: PER.const.PROVIDER_WEB,
                deleted: null
            }})
            .then(user => {
                if (user) {
                    return PER.helper
                        .compareHash(password, user.password)
                        .then(() => { return user; });
                }
                throw new Error('errAccountNotFound');
            })
            .catch(err => {
                PER.log.error(err.message);
                if (err.message.slice(0, PER.const.LIMIT_MSG_ERROR) === 'err') {
                    throw err;
                } else {
                    throw new Error('errInternalOperation');
                }
            });
    };

    /**
     * It set new token.
     * @function setNewToken
     * @param {string} email - Email address.
     * @param {integer} tokenType - Token type: [PASSWORD_RESET: 1, ACTIVATION: 2].
     * @return {User} The user updated.
     */
    User.setNewToken = function(email, tokenType) {
        return User.findByField('email', email)
            .then(user => {
                if (user) {
                    const {tokenField, expiresField} = User.getFieldNamesToken(tokenType);

                    return user
                        .update({
                            [tokenField]: PER.helper.getToken(),
                            [expiresField]: PER.helper.getTokenExpires()
                        })
                        .then(userUpd => { return userUpd; })
                        .catch(errUpd => {
                            PER.log.error(errUpd.message);
                            throw new Error('errInternalUpdateUser');
                        });
                }
                throw new Error('errAccountNotFound');
            });
    };

    /**
     * Get field names for token data.
     * @function getFieldNamesToken
     * @param {integer} tokenType - Token type: [PER.const.PASSWORD_RESET, PER.const.ACTIVATION].
     * @return {string | string} Field names for token data.
     * @example
     * getFieldNamesToken(PER.const.TOKEN.PASSWORD_RESET);
     * // returns {'password_reset_token', 'password_reset_expires'}
     */
    User.getFieldNamesToken = function(tokenType) {
        let tokenField = '';
        let expiresField = '';

        switch (tokenType) {
            case PER.const.TOKEN.PASSWORD_RESET:
                tokenField = 'password_reset_token';
                expiresField = 'password_reset_expires';
                break;
            // For case PER.const.TOKEN.ACTIVATION:
            default:
                tokenField = 'activation_token';
                expiresField = 'activation_expires';
                break;
        }

        return {tokenField, expiresField};
    };

    /**
     * Reset password.
     * @function resetPassword
     * @param {string} token - Token.
     * @param {string} email - Email address.
     * @param {string} password - Password not encripted.
     * @return {User} The user updated.
     * @throws errInternalUpdateUser: Error on update.
     * @throws errTokenExpires: Token expires or invalid.
     */
    User.resetPassword = function(token, email, password) {
        return User.findTokenOwner(token, email, PER.const.TOKEN.PASSWORD_RESET)
            .then(user => {
                if (user) {
                    return user
                        .update({
                            password: password
                        })
                        .then(userUpd => { return userUpd; })
                        .catch(errUpd => {
                            PER.log.error(errUpd.message);
                            throw new Error('errInternalUpdateUser');
                        });
                }
                throw new Error('errTokenExpires');
            });
    };

    /**
     * It activate the user account.
     * @function activateAccount
     * @param {string} token - Token.
     * @param {string} email - Email address.
     * @return {User} The user updated.
     * @throws errInternalUpdateUser: Error on update.
     * @throws errTokenExpires: Token expires or invalid.
     */
    User.activateAccount = function(token, email) {
        return User.findTokenOwner(token, email, PER.const.TOKEN.ACTIVATION, false)
            .then(user => {
                if (user) {
                    return user
                        .update({
                            status: PER.const.DB.STATUS_ACTIVE,
                            activation_token: null,
                            activation_expires: null
                        })
                        .then(userUpd => { return userUpd; })
                        .catch(errUpd => {
                            PER.log.error(errUpd.message);
                            throw new Error('errInternalUpdateUser');
                        });
                }
                throw new Error('errTokenExpires');
            });
    };

    /**
     * Find token's owner user.
     * @function findTokenOwner
     * @param {string} token - Token.
     * @param {string} email - Email address.
     * @param {integer} tokenType - Token type: [PER.const.PASSWORD_RESET, PER.const.ACTIVATION].
     * @param {boolean} [onlyActive=true] - If search only active users.
     * @return {User} The token's owner user.
     */
    User.findTokenOwner = function(token, email, tokenType, onlyActive = true) {
        const {tokenField, expiresField} = User.getFieldNamesToken(tokenType);

        return User
            .findOne({where: {
                email: email,
                [tokenField]: token,
                [expiresField]: {[op.gt]: Date.now()},
                status: onlyActive ? PER.const.DB.STATUS_ACTIVE : PER.const.DB.STATUS_INACTIVE
            }})
            .then(user => {
                if (user) {
                    return user;
                }
                throw new Error('errTokenExpires');
            });
    };

    /**
     * Get user's display name.
     * @function getDisplayName
     * @return {string} The user's display name.
     */
    User.prototype.getDisplayName = function() {
        if (this.firstname && this.lastname) { return this.firstname + ' ' + this.lastname; }
        if (this.firstname) { return this.firstname; }
        if (this.username) { return this.username; }
        return this.email;
    };

    if (PER.config.env.name === PER.const.ENV.DEVELOPMENT) {
        User.sync({force: true});
    }

    return User;
};