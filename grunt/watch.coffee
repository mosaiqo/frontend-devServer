# File changes watcher
# @see https://github.com/gruntjs/grunt-contrib-watch
module.exports =
  server:
    files: ['app/**/*.js','app/**/*.coffee']
    tasks: ['coffeelint', 'jshint', 'mochaTest:unit']
