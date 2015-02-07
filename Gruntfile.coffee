module.exports = (grunt) ->

  # Default path to the frontend public dir (called 'dist')
  frontendAppPublicDir = '../frontend'

  # The path can be overrided so you can place the frontendApp wherever you want
  # Just create a file called 'env.json' at the project root with this contents:
  #
  # {
  #   "appPublicDir" : "path_to_the_frontEndApp_public_dir"
  # }
  #
  if grunt.file.exists('env.json')
    frontendAppPublicDir = grunt.file.readJSON('env.json').appPublicDir
  process.env.appPublicDir = frontendAppPublicDir


  # Autoloading for the grunt tasks, jitGrunt enables loading them on demand
  require('load-grunt-config') grunt,
    jitGrunt: true

    # Data available to the tasks:
    data:
      # Directories:
      srcDir:    './src'
      buildDir : frontendAppPublicDir
      assetsDir: '<%= buildDir %>/assets'
      docsDir:   'docs'


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
