module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            development: {
                src: "./src/dom/domn.js",
                dest: './dist/jzmn.dom.js',
                options: {
                    browserifyOptions: { 
                        standalone: "jzmn"
                    },
                    transform: ["rollupify",["babelify",{
                        presets:["latest"],
                    }]]
                }
            }
        },
        uglify: {
            development : {
                files: {
                    'dist/jzmn.dom.min.js': ['dist/jzmn.dom.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ["./src/*.js"],
                tasks: ["browserify","uglify"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("build", ["browserify","uglify"]);


};