const constTest = require('./const-test');

const initTimeout = (obj, done) => {
    obj.timeout(constTest.TIMEOUT.FIRST);
    return setTimeout(done, constTest.TIMEOUT.SECOND);
};

const error = (msg, err, done, timeOut = null) => {
    PER.log.error(msg + ': ' + err.message);
    if (timeOut) {
        clearTimeout(timeOut);
    }
    done(err);
};

const succes = (done, timeOut) => {
    clearTimeout(timeOut);
    done();
};

const limitMsg = msg => {
    return msg.slice(0, constTest.LIMIT_MSG);
};

module.exports = {
    initTimeout: initTimeout,
    error: error,
    succes: succes,
    limitMsg: limitMsg
};