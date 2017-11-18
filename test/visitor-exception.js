const chai = require('chai');
const should = chai.should();
const server = require('../bin/www');
const session = require('supertest-session');
const i18n = require('./util/i18n-test');
const constant = require('./util/const-test');
const helper = require('./util/helper-test');
const data = require('./util/data-test');

const testSession = session(server);

const list = [
    {
        title: 'signup user bad',
        uri: '/signup',
        data: data.userBadUsername,
        should: i18n.requiredUsername
    },
    {
        title: 'signup email exists',
        uri: '/signup',
        data: data.userGood,
        should: i18n.errUsernameExists
    },
    {
        title: 'login email not exists',
        uri: '/login',
        data: data.userEmailNotExist,
        should: i18n.errAccountNotFound
    }
];

describe('visitor-exception', () => {
    list.forEach(item => {
        describe(item.title, () => {
            it('init', function(done) {
                const timeOut = helper.initTimeout(this, done);

                testSession
                    .post(item.uri)
                    .send(item.data)
                    .expect(constant.STATUS.FOUND)
                    .then(res => {
                        res.text.should.include('Redirecting');
                        helper.succes(done, timeOut);
                    })
                    .catch(err => {
                        helper.error(this.test.fullTitle(), err, done, timeOut);
                    });
            });

            it('response', function(done) {
                const timeOut = helper.initTimeout(this, done);

                testSession
                    .get(item.uri)
                    .expect(constant.STATUS.OK)
                    .then(res => {
                        res.text.should.include(item.should);
                        helper.succes(done, timeOut);
                    })
                    .catch(err => {
                        helper.error(this.test.fullTitle(), err, done, timeOut);
                    });
            });
        });
    });
});