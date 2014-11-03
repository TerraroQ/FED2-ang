module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					outputStyle: 'compressed'
				},
				files: {
					'app/assets/css/app.css': 'app/assets/scss/app.scss'
				}        
			}
		},

		uglify: {
			dist: {
				files: {
					'app/assets/js/app.min.js': ['app/assets/js/app.js']
				}
			}
		},

		watch: {
			grunt: { files: ['Gruntfile.js'] },

			sass: {
				files: 'app/assets/scss/**/*.scss',
				tasks: ['sass']
			},

			js: { files: ['app/assets/js/app.js'] }
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['sass']);
	grunt.registerTask('default', ['uglify', 'watch']);

}