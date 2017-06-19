module.exports = function (grunt) {
		const browserifyOptions = {
				browserifyOptions: {
						standalone: "jzmn"
				},
				transform: ["rollupify",["babelify",{
						presets:["latest"],
				}]]
		}
    grunt.initConfig({
        browserify: {
						jzmn: {
							src: "./src/core/jzmn.js",
							dest: "./dist/jzmn.es6.js",
							options: browserifyOptions
						},
            domn: {
                src: "./src/dom/domn.js",
                dest: './dist/jzmn.dom.js',
                options: browserifyOptions
            }
        },
        uglify: {
            development : {
                files: {
                    'dist/jzmn.dom.min.js': ['dist/jzmn.dom.js'],
										'dist/jzmn.es6.min.js': ['dist/jzmn.es6.js']
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
