[![Express Demo Logo](https://express-demo-alditis.herokuapp.com/img/logo.png)](https://express-demo-alditis.herokuapp.com)

[Express](http://expressjs.com/) app example.

## [Live demo](https://express-demo-alditis.herokuapp.com)

## Introduction

### Motivation
When I began an project personal, I had very problems for integrate diferents modules
for login, i18n, send email, ORM, validate input data, test unit, enviroment variables, generate documentation,
minified files, check code format and syntax, etc.

Finally I could it solutions reviewing documentation officials, [GitHub](https://github.com),
[StackOverflow](https://stackoverflow.com) and differents web site.

I hope that this example or part of it to be util for the community.

Sure that this example could improve and to be complete with more functionality.
Are welcome suggestions, ideas, bugs identified, and colaborations. Greetings!

### Included modules
* [bycript](https://github.com/kelektiv/node.bcrypt.js): Hash password.
* [ejs](https://github.com/mde/ejs): View engine.
* [emailjs](https://github.com/eleith/emailjs): Send emails.
* [express-i18n](https://github.com/koalazak/i18n-express) and [geolang-express](https://github.com/koalazak/geolang-express): For support i18n. Languages includes: ES and EN.
* [mysql2](https://github.com/sidorares/node-mysql2): Driver for MySQL.
* [passport](https://github.com/jaredhanson/passport): Login and Signup with providers internal and externals (Google, Facebook and Twitter).
* [req-flash](https://github.com/maximilianschmitt/req-flash): Flash messages.
* [sequelize](https://github.com/sequelize/sequelize): ORM.
* [socket.io](https://github.com/socketio/socket.io): Chat and realtime options.
* [validate.js](https://github.com/ansman/validate.js): Validate input data.
* [winston](https://github.com/winstonjs/winston): Generate log.
* crypto: Module Node.js for generate tokens.

### Modules dev
* [dotenv](https://github.com/motdotla/dotenv) and [dotenv-safe](https://github.com/rolodato/dotenv-safe): Load .env file.
* [eslint](https://github.com/eslint/eslint): Verify code format and syntax.
* [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin): Minimize css files.
* [grunt](https://github.com/gruntjs/grunt): Automatization of task.
* [jsdoc](https://github.com/jsdoc3/jsdoc): Generate documentation.
* [mocha](https://github.com/mochajs/mocha): Test unit.
* [supertest](https://github.com/visionmedia/supertest) and [supertest-session](https://github.com/rjz/supertest-session): Complement for unit test.
* [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony): Minimize js files.

## Setup

### Requeriments
* [Node.js](https://nodejs.org/)
* A database [MySQL](https://www.mysql.com/)

### Installation
```bash
$ npm install express-demo
```
### Configuration
Create a file `.env` based on `.env.example` and add settings:
* Port.
* Name app.
* Database.
* Session.
* Bcrypt salt.
* Email.
* Login social (Optional).

### Quick Start
The scripts is configured in the file `package.json`

```bash
"scripts": {
    "start": "node ./bin/www",
    "start-dev": "NODE_ENV=development node ./bin/www",
    "test": "NODE_ENV=development mocha ./test/*.js",
    "test-navigation": "NODE_ENV=development mocha test/navigation.js",
    "grunt": "grunt",
    "sequelize": "sequelize
},
```

For to start the server for development enviroment:

```bash
$ npm run start-dev
```

And to run the test suite on development enviroment:

```bash
$ npm test
```

## Notes Additionals
### Features
  * Login on form.
  * Login with Google, Facebook and Twitter. (Optional)
  * Signup.
  * Forgot password.
  * i18n.

### Features dev
  * Unit test. `npm test`
  * Generate documentation: `npm run grunt jsdoc`. Documentation generated in `doc` folder.
  * Check format and syntax code: `npm run grunt exec:eslint`. If exists erros, look `log/eslint.log` file.
  * Minimize `public/js/general.js` file: `npm run grunt exec:minGeneral`. File generated: `public/js/general.min.js`.
  * Minimize `public/css/main.css` file: `npm run grunt cssmin`. File generated: `public/css/main.min.js`.
  * ORM Sequelize, example to create seeder: `npm run sequelize seed:generate -- --name "user-insert-test"`. File generated: `db/seeder/20171122140352-user-insert-test.js`.

Or only `npm run grunt` for run all tasks. Look `Gruntfile.js` for more tasks details.

### Social login (Optional)
Create an app on Google, Facebook or Twitter and set in the file `.env`

For example for Facebook:
```bash
FB_ID=YourFacebookAppID
FB_SECRET=YourFacebookAppSecret
FB_SCOPE=email
FB_CALLBACK=http://localhost:3000/auth/facebook/callback
```

For reduce code, others callbacks follow same patter. For example:
```bash
FB_CALLBACK=http://localhost:3000/auth/facebook/callback
GG_CALLBACK=http://localhost:3000/auth/google/callback
TW_CALLBACK=http://localhost:3000/auth/twitter/callback
```

## Finally
### People
Author: [alditis](https://github.com/alditis)

If this project help you some and you want support me, you can give me a donate. Thanks!

[![Liberapay Donate](https://img.shields.io/badge/Donate-Liberpay-yellow.svg)](https://liberapay.com/alditis/donate)
&nbsp;&nbsp;&nbsp;
[![Paypal Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/alditis)
&nbsp;&nbsp;&nbsp;
[![Bitcoin Donate](https://img.shields.io/badge/Donate-Bitcoin-orange.svg)](https://blockchain.info/address/1C1tt4zXSRtjGs8p4hcmAoqY6BFDRYeuBG)

### License

[MIT](LICENSE)