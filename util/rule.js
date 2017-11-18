/**
 * Rule module.
 * @module util/rule
 */
module.exports = {
    login: {
        email: {
            email: {message: '^requiredEmail'},
            presence: {message: '^requiredEmail'}
        },
        password: {
            length: {
                minimum: 6,
                message: '^requiredPassword'
            }
        }
    },
    signup: {
        username: {
            length: {
                minimum: 5,
                message: '^requiredUsername'
            }
        },
        email: {
            email: {
                message: '^requiredEmail'
            }
        },
        password: {
            length: {
                minimum: 6,
                message: '^requiredPassword'
            }
        }
    },
    forgotPassword: {
        email: {
            email: {message: '^requiredEmail'},
            presence: {message: '^requiredEmail'}
        }
    },
    resetPassword: {
        password: {
            length: {
                minimum: 6,
                message: '^requiredPassword'
            }
        },
        token: {
            length: {
                minimum: 90,
                message: '^requiredToken'
            }
        },
        email: {
            email: {
                message: '^requiredEmail'
            }
        }
    },
    tokenEmail: {
        token: {
            length: {
                minimum: 90,
                message: '^requiredToken'
            }
        },
        email: {
            email: {
                message: '^requiredEmail'
            }
        }
    },
    activateAccount: {
        email: {
            email: {message: '^requiredEmail'},
            presence: {message: '^requiredEmail'}
        }
    }
};