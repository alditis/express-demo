const chai = require('chai');
const should = chai.should();
const server = require('../bin/www');
const session = require('supertest-session');
const i18n = require('./util/i18n-test');
const constant = require('./util/const-test');
const helper = require('./util/helper-test');
const data = require('./util/data-test');

const testSession = session(server);
let userFound = null;

if (PER.config.app.env === 'development') {
    before(function(done) {
        const timeOut = helper.initTimeout(this, done);

        PER.model.user
            .sync({force: true})
            .catch(err => {
                helper.error('User table not created', err, done, timeOut);
            });
    });
}

describe('visitor', () => {
    describe('signup', () => {
        it('init', function(done) {
            const timeOut = helper.initTimeout(this, done);

            testSession
                .post('/signup')
                .send(data.userGood)
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(i18n._dear);
                    helper.succes(done, timeOut);
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done, timeOut);
                });
        });

        it('confirm', function(done) {
            PER.model.user.findOne({where: {email: data.userGood.email, deleted: null}})
                .then(user => {
                    const timeOut = helper.initTimeout(this, done);
                    const uri = `/signup/confirm/${user.activation_token}/${user.email}`;

                    testSession
                        .get(uri)
                        .expect(constant.STATUS.FOUND)
                        .then(res => {
                            res.text.should.include('Redirecting');
                            helper.succes(done, timeOut);
                        })
                        .catch(err => {
                            helper.error(this.test.fullTitle(), err, done, timeOut);
                        });
                })
                .catch(errUser => {
                    const msg = `${this.test.fullTitle()} : User not found`;
                    helper.error(msg, errUser, done);
                });
        });

        it('confirm welcome', function(done) {
            const timeOut = helper.initTimeout(this, done);

            testSession
                .get('/user/welcome')
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(data.userGood.username);
                    helper.succes(done, timeOut);
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done, timeOut);
                });
        });
    });

    describe('login', () => {
        let authenticatedSession = null;

        beforeEach(done => {
            testSession
                .post('/login')
                .send(data.userGood)
                .expect(constant.STATUS.FOUND)
                .then(() => {
                    authenticatedSession = testSession;
                    done();
                })
                .catch(err => {
                    helper.error('login init', err, done);
                });
        });

        it('welcome', function(done) {
            authenticatedSession
                .get('/user/welcome')
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(data.userGood.username);
                    done();
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done);
                });
        });

        it('logout', function(done) {
            const timeOut = helper.initTimeout(this, done);

            authenticatedSession
                .get('/user/logout')
                .expect(constant.STATUS.FOUND)
                .then(res => {
                    res.text.should.include('Redirecting');

                    testSession
                        .get('/login')
                        .expect(constant.STATUS.OK)
                        .then(resNew => {
                            resNew.text.should.include(PER.const.CURRENT_YEAR);
                            helper.succes(done, timeOut);
                        })
                        .catch(errNew => {
                            const msg = `${this.test.fullTitle()} confirm`;
                            helper.error(msg, errNew, done, timeOut);
                        });
                })
                .catch(err => {
                    const msg = `${this.test.fullTitle()} init`;
                    helper.error(msg, err, done, timeOut);
                });
        });
    });

    describe('forgot', () => {
        it('forgot init', function(done) {
            const timeOut = helper.initTimeout(this, done);

            testSession
                .post('/forgot')
                .send(data.userGood)
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(helper.limitMsg(i18n.msgConfirmResetPassword));
                    PER.log.info(res.text);
                    helper.succes(done, timeOut);
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done, timeOut);
                });
        });

        it('forgot confirm', function(done) {
            PER.model.user.findOne({where: {email: data.userGood.email, deleted: null}})
                .then(user => {
                    userFound = user;
                    const timeOut = helper.initTimeout(this, done);
                    const uri = `/reset/${user.password_reset_token}/${user.email}`;

                    testSession
                        .get(uri)
                        .expect(constant.STATUS.OK)
                        .then(res => {
                            res.text.should.include(i18n._resetYourPassword);
                            helper.succes(done, timeOut);
                        })
                        .catch(err => {
                            helper.error(this.test.fullTitle(), err, done, timeOut);
                        });
                })
                .catch(errUser => {
                    const msg = `${this.test.fullTitle()} : User not found`;
                    helper.error(msg, errUser, done);
                });
        });

        it('reset init', function(done) {
            const timeOut = helper.initTimeout(this, done);

            testSession
                .post('/reset')
                .send({
                    token: userFound.password_reset_token,
                    email: userFound.email,
                    password: data.passwordNew
                })
                .expect(constant.STATUS.FOUND)
                .then(res => {
                    res.text.should.include('Redirecting');
                    helper.succes(done, timeOut);
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done, timeOut);
                });
        });

        it('reset confirm', function(done) {
            testSession
                .get('/user/welcome')
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(i18n._welcome);
                    done();
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done);
                });
        });
    });
});