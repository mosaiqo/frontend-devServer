# File changes watcher
# @see https://github.com/gruntjs/grunt-contrib-watch
module.exports =
  server:
    files: ['src/**/*.js','src/**/*.coffee']
    tasks: ['coffeelint', 'jshint', 'mochaTest:unit']
