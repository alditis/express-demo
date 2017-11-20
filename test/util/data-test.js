module.exports = {
    /**
     * User for pass test.
     */
    userGood: {
        username: 'your_username',
        email: 'your@mail.com',
        password: 'your_password'
    },

    /**
     * User for not pass test.
     * The username "demo" is of size 4.
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
        email: 'other@mail.com',
        password: 'not-required-change'
    },

    /**
     * New password for test "Forgot Password?".
     */
    passwordNew: 'other_password'
};