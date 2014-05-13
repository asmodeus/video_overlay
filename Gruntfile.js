module.exports = function(grunt) {	

	// Option functionality not yet added for karma file patterns
	function karmaGenerateLoadedFiles (sources) {
	 	function karmaPatternize (src, options) {
			return	{	pattern: src, 
						watched: true, 
						included: true,
						served: true, };
		}
		var files = Array.prototype.map.call(sources, function (value) { return karmaPatternize(value); });
		files.push(karmaPatternize("spec/unit/**/*.js"));
		return files;
	}				

	// Sources are loaded each time this grunt task is started
	// If deps.src is empty another pattern should be generated
	var deps = grunt.file.readJSON('package.json');

	// var depsPrefixed = deps.dirs.src.map(prefixWith('src/'));
	var karmaFiles = karmaGenerateLoadedFiles(deps.dirs.src);

	var conf = {
		// Get filepaths from package.json file. The files are set up in the setup task.
		watch: {
			files: ["src/**/*.js"],
			tasks: ["jshint:sources", "karma:unit"],
			options: {
				debounceDelay: 1000
			}
		},
		jshint: {
			options: {
				sub: false
			},
			sources: ["src/**/*.js"],
			build: ["build/**/*.js"]
		},
		clean: {
			reports: ["reports/**"],
			build: ["build/js/**"]
		},
		
		compile: {
			options: {
				compilation_level: 'ADVANCED_OPTIMIZATIONS',
				language_in: 'ECMASCRIPT5_STRICT',
				warning_level: 'VERBOSE',
		        formatting: 'PRETTY_PRINT',
		       	debug: true,
				externs: 'externs/'
			}, 
			comp : {
							// Destination : Source
				files: {'build/gcc_src.js' : 'src/**/*.js'}
			} 
		},
		 
		
		jsdoc : {
			makedoc : {
				src: ['src/**/*.js'], 
				options: {
					destination: 'reports/jsdoc'
				}
			}
		},
		
        
        shell: {
        	test: {
        		options: {
        			stdout: true
        		},
        		command: 'echo test'
        	}		
        },
		// Karma is always used for unit tests
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true,
				files: karmaFiles,
			},
			report: {
				reporters: ['progress', 'coverage'],
				configFile: 'karma.conf.js',
				singleRun: true,
				preprocessors: {
					'src/**/*.js': ['coverage']
				},
				coverageReporter: {
					type : 'html',
					dir : 'reports/'
				},
				files: karmaFiles,
			}
		},
		exec: {
			casp: {
				command: 'casperjs',
				stdout: false,
				stderr: false
			}
		},
		express: {
			build: {
				options: {
					port: 9876,
					bases: 'build/',
			        server: 'build.js'
				}
			},
			create: {
				options: {
					port: 6789,
					bases: 'create/',
			        server: 'create.js'
				}
			}
		},
		
		casperjs: {
			options: {
				async: {
					parallel: false
				}
			},
			files: ['spec/e2e/**/*.js']
		},
		
	};

	// Project configuration.
	grunt.initConfig(conf);
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-karma');
	
	grunt.loadNpmTasks('grunt-closurecompiler');
	
	
	grunt.loadNpmTasks('grunt-jsdoc');
	
	
	
	grunt.loadNpmTasks('grunt-casperjs');
	

	grunt.renameTask('closurecompiler', 'compile');
	// grunt.registerTask('e2e', []); // Runs e2e tests on deployed instance
	grunt.registerTask('build', ['express:build', 'express-keepalive']);
	grunt.registerTask('create', ['express:create', 'express-keepalive']);
	grunt.registerTask('unit', ['karma:unit']); // Runs unit tests on local code
	grunt.registerTask('coverage', ['karma:report']); // Runs unit tests and generates a coverage report, used for jenkins
	grunt.registerTask('server', ['express', 'express-keepalive']);
	grunt.registerTask('default', ['jshint:sources', 'karma:unit']);

};
