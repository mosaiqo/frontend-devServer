# File changes watcher
# @see https://github.com/gruntjs/grunt-contrib-watch
module.exports =
  server:
    files: ['**/*.js','**/*.coffee', '!**/node_modules/**']
    tasks: ['coffeelint', 'jshint', 'mochaTest:unit']
