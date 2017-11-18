[![Express Demo Logo](https://express-demo-alditis.herokuapp.com/img/logo.png)](https://express-demo-alditis.herokuapp.com)

[Express](http://expressjs.com/) app example.

[Live demo](https://express-demo-alditis.herokuapp.com)

#### Included modules:
* [bycript](https://github.com/kelektiv/node.bcrypt.js): Hash password.
* [ejs](https://github.com/mde/ejs): View engine.
* [emailjs](https://github.com/eleith/emailjs): Send emails.
* [express-i18n](https://github.com/koalazak/i18n-express) and [geolang-express](https://github.com/koalazak/geolang-express): For support i18n. Languages includes: ES and EN.
* [mysql2](https://github.com/sidorares/node-mysql2): Driver for MySQL.
* [passport](https://github.com/jaredhanson/passport): Login and Signup with providers internal and externals (Google, Facebook and Twitter).
* [req-flash](https://github.com/maximilianschmitt/req-flash): Flash messages.
* [sequelize](https://github.com/sequelize/sequelize): ORM.
* [socket.io](https://github.com/socketio/socket.io): Chat and realtime options.
* [validate.js](https://github.com/ansman/validate.js): Vaidate data input.
* [winston](https://github.com/winstonjs/winston): Generate log.

#### Modules dev:
* [dotenv](https://github.com/motdotla/dotenv) and [dotenv-safe](https://github.com/rolodato/dotenv-safe): Load .env file.
* [eslint](https://github.com/eslint/eslint): Verify code format and syntax.
* [grunt](https://github.com/gruntjs/grunt): Automatization of task.
* [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin): Minimize css files.
* [jsdoc](https://github.com/jsdoc3/jsdoc): Generate documentation.
* [mocha](https://github.com/mochajs/mocha): Test unit.
* [supertest](https://github.com/visionmedia/supertest) and [supertest-session](https://github.com/rjz/supertest-session): Complement for unit test.

#### And modules [Node.js](https://nodejs.org/):
* crypto: Generate tokens.


## Requeriments

### Enviroment
* [Node.js](https://nodejs.org/)
* [Express](http://expressjs.com/)
* [MySQL](https://www.mysql.com/): Create a database and set in the file config.js.

### Global modules
```bash
sudo npm i -g grunt-cli uglify-es jsdoc mocha sequelize-cli eslint
```

### Optional login
* Create an app on Google.
* Create an app on Facebook.
* Create an app on Twitter.

And set in the file .env

### Installation
```bash
$ git clone git://github.com/alditis/express-demo.git --depth 1
$ cd express-demo
$ npm install
```

### Features

  * Login on form.
  * Login with Google, Facebook and Twitter. (Optional)
  * Signup.
  * Forgot password.
  * i18n.

### Features dev
  * Unit test.
  * Generate documentation.
  * Check format and syntax code.
  * Minimize files js and css.

### Quick Start

  Start the server:

```bash
$ npm start
```

### Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

### People

Author: [alditis](https://github.com/alditis)
<noscript><a href="https://liberapay.com/alditis/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a></noscript>
&nbsp;&nbsp;&nbsp;
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/alditis)

### License

  [MIT](LICENSE)