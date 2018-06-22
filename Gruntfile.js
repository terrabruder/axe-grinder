module.exports = function(grunt) {

    /***********************************************************/
    /** See ./build/tasks/config.js for package configuration **/
    /***********************************************************/
    var config = require('./tasks/config.js')(grunt)
        , HCCrawler = require('headless-chrome-crawler');


    grunt.registerTask('default', function(){

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.registerTask('default', ['build']);

};
