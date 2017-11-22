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
                cmd: 'eslint *.js bin/www */*.js */*/*.js --quiet -o log/eslint.log'
            },
            minGeneral: {
                cmd: 'uglifyjs -cm -o public/js/general.min.js -- public/js/general.js'
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

    grunt.registerTask('default', ['cssmin', 'jsdoc', 'exec']);
};