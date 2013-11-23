#
# * grunt-i18n-finder
# * https://github.com/lucasschmidt/grunt-i18n-finder
# *
# * Copyright (c) 2013 Lucas Schmidt
# * Licensed under the MIT license.
#

module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		clean:
			lib: ["lib"]


		coffee:
			server:
				expand: true
				cwd:'src'
				src: ['**/*.coffee']
				dest: 'lib'
				ext: '.js'

	grunt.loadNpmTasks "grunt-contrib-jshint"
	grunt.loadNpmTasks "grunt-contrib-clean"
	grunt.loadNpmTasks "grunt-contrib-nodeunit"
	grunt.loadNpmTasks "grunt-contrib-coffee"

	grunt.registerTask "dev", ["clean", "coffee"]

	# By default, lint and run all tests.
	grunt.registerTask "default", ["dev"]
