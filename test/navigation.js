const chai = require('chai');
const should = chai.should();
const request = require('supertest');
const server = require('../bin/www');
const i18n = require('./util/i18n-test');
const constant = require('./util/const-test');
const helper = require('./util/helper-test');

const list = [
    {
        title: 'login',
        uri: '/login',
        should: PER.const.CURRENT_YEAR
    },
    {
        title: 'signup',
        uri: '/signup',
        should: i18n._createAccount
    },
    {
        title: 'forgot',
        uri: '/forgot',
        should: i18n._resetYourPassword
    },
    {
        title: 'notfound',
        uri: '/notfound',
        should: i18n.errPageNotFound
    }
];

describe('navigation', () => {
    list.forEach(item => {
        it(item.title, function(done) {
            request(server)
                .get(item.uri)
                .expect(constant.STATUS.OK)
                .then(res => {
                    res.text.should.include(item.should);
                    done();
                })
                .catch(err => {
                    helper.error(this.test.fullTitle(), err, done);
                });
        });
    });
});