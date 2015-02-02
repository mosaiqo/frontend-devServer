# Coffeescript linter
# @see https://www.npmjs.org/package/grunt-coffeelint
module.exports =
  options:
    configFile: 'coffeelint.json'

  tests: ['test/**/*.coffee']
  grunt: ['Gruntfile.coffee', 'grunt/*.coffee']
