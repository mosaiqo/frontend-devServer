module.exports =
  options:
    reporter: require('jshint-stylish')
  all: ['src/**/*.js', 'util/**/*.js', 'test/**/*.js', '!test/coverage/**/*.js']
