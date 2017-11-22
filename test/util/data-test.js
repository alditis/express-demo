module.exports = {
    /**
     * User for pass test.
     */
    userGood: {
        username: 'myusername',
        email: PER.config.test.login.email,
        password: 'mypassword'
    },

    /**
     * User for not pass test.
     * The username "demo" is of size 4.
     * Look file util/rule:
     * signup: {
     *       username: {
     *          length: {
     *              minimum: 5,
     *              message: '^requiredUsername'
     *           }
     *      },
     */
    userBadUsername: {
        username: 'demo',
        email: 'not-required-change@mail.com',
        password: 'not-required-change'
    },

    /**
     * User for not pass test.
     * The email must to be different of email's userGood.
     */
    userEmailNotExist: {
        username: 'not-required-change',
        email: 'not-required-change@mail.com',
        password: 'not-required-change'
    },

    /**
     * New password for test "Forgot Password?".
     */
    passwordNew: 'not-required-change'
};