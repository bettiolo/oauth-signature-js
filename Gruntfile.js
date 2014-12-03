/*global module */

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : {
			dist : [ 'dist' ]
		},
		concat : {
			options : {
				separator : '\n'
			},
			specs : {
				src : [
					'src/lib/cryptojs/hmac-sha1.js',
					'src/lib/cryptojs/enc-base64-min.js',
					'src/lib/url.min.js',
					'src/app/oauth-signature.js'
				],
				dest : 'dist/oauth-signature.js',
				nonull : true
			}
		},
		uglify : {
			dist : {
				files : {
					'dist/oauth-signature.min.js' : [ 'dist/oauth-signature.js' ]
				},
				options : {
					// sourceMap : '<%= cfg.dist.dir %>/pub.min.map.js';
				}
			}
		},
		mochaTest : {
			dev : {
				src : ['src/app/*.tests.js'],
				options : {
					ui : 'qunit',
					reporter : 'spec'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('build', [ 'clean', 'concat', 'uglify', 'test-build' ]);
	grunt.registerTask('test', [ 'mochaTest:dev' ]);
	grunt.registerTask('test-build', [ 'mochaTest:dev' ]);
};
