/**
 * Emailjs module.
 * @module util/emailjs
 */

const fs = require('fs');
const path = require('path');
const emailjs = require("emailjs");
const htmlToText = require('html-to-text');

const server = emailjs.server.connect(PER.config.email);
const dirTemplate = path.join(PER.config.app.views, 'email');
const emailSignUp = PER.config.app.name + ' <' + PER.config.email.signup + '>';

const _getTemplate = template => {
    return fs.readFileSync(path.join(dirTemplate, template), 'utf8');
};

const header = PER.helper.ejsRender(_getTemplate('header.ejs'));

const _render = (template, data) => {
    const footer = PER.helper.ejsRender(_getTemplate('footer.ejs'), {i18n: data.i18n});
    return header + PER.helper.ejsRender(_getTemplate(template + '.ejs'), data) + footer;
};

const _send = (template, subject, from, user, req, callback) => {
    const i18n = req.app.locals.i18n;
    const html = _render(template, {user: user, i18n: i18n, url: PER.helper.getBaseUrl(req)});

    return server.send({
        text: htmlToText.fromString(html),
        from: from,
        to: user.email,
        subject: i18n[subject],
        attachment: [{data: html, alternative: true}]
    }, callback);
};

const sendWelcome = (user, req, callback) => {
    return _send('welcome', '_accountCreated', emailSignUp, user, req, callback);
};

const sendConfirmAccount = (user, req, callback) => {
    return _send('confirm_account', '_confirmYourAccount', emailSignUp, user, req, callback);
};

const sendPasswordReset = (user, req, callback) => {
    return _send('reset_password', '_resetYourPassword', emailSignUp, user, req, callback);
};

const sendPasswordResetSuccess = (user, req, callback) => {
    return _send(
        'reset_password_success', '_resetPasswordSuccess',
        emailSignUp, user, req, callback
    );
};

module.exports = {
    sendWelcome: sendWelcome,
    sendPasswordReset: sendPasswordReset,
    sendPasswordResetSuccess: sendPasswordResetSuccess,
    sendConfirmAccount: sendConfirmAccount
};