module.exports = function(grunt) {

    /***********************************************************/
    /** See ./build/tasks/config.js for package configuration **/
    /***********************************************************/
    require('./tasks/crawl.js')(grunt);


    grunt.registerTask('default', ['crawl']);

    return

};
