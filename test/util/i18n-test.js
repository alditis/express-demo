require('dotenv').config();
require('dotenv-safe').load();

const i18nModule = require('i18n-express');

const getExpressReq = (headerLang, session, query) => {
    headerLang = headerLang || {};
    session = session || {};
    query = query || {};

    return {
        session: session,
        cookies: {},
        query: query,
        headers: headerLang,
        app: {locals: {}}
    };
};

let i18n = null;
const res = {};
const mws = i18nModule(PER.config.i18n);
const req = getExpressReq();

mws(req, res, () => {
    i18n = req.app.locals.i18n;
});

module.exports = i18n;