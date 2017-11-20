module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/css/main.min.css': ['public/css/main.css']
                }
            }
        },
        exec: {
            eslint: {

                /**
                 * For alternative use global: sudo npm install -g eslint
                 * Remove of cmd: 'node_modules/.bin/'
                 */
                cmd: 'node_modules/.bin/eslint *.js bin/www */*.js */*/*.js --quiet -o log/eslint.log'
            },
            minGeneral: {

                /**
                 * For alternative use global: sudo npm install -g uglify-es
                 * Remove of cmd: 'node_modules/.bin/'
                 */
                cmd: 'node_modules/.bin/uglifyjs -cm -o public/js/general.min.js -- public/js/general.js'
            },
            test: {
                cmd: 'npm test'
            }
        },
        jsdoc: {
            dist: {
                src: [
                    'app.js', 'config.js', 'bin/www', 'test/*.js',
                    './db/model/*.js', './route/*.js', './util/*.js'
                ],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['cssmin', 'exec', 'jsdoc']);
};