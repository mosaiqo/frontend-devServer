module.exports = (grunt) ->

  # Autoloading for the grunt tasks, jitGrunt enables loading them on demand
  require('load-grunt-config') grunt,
    jitGrunt: true

    # Data available to the tasks:
    data:
      # Directories:
      srcDir:    '../src'
      buildDir:  '../dist'
      assetsDir: '<%= buildDir %>/assets'
      docsDir:   '../docs'

      # Dev. server settings:
      serverPort: 9000
      proxiedServer_port: 9001

      # Banner, appended to the built scripts/css:
      banner: '/*! <%= package.name %> <%= package.version %> |
 © <%= package.author %> - All rights reserved |
 <%= package.homepage %> */\n'

  # Display the elapsed execution time of grunt tasks
  require('time-grunt') grunt

  # Load explicitly the notify tasks,
  # otherwise, no notifications will be fired or errors
  grunt.loadNpmTasks('grunt-notify')
