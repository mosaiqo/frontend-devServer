# server side tests (for the dev server and fake API)
module.exports =
  options:
    reporter: 'spec'

  unit:
    src: ['<%= srcDir %>/test/unit/**/*.js']

  integration:
    src: ['<%= srcDir %>/test/integration/**/*.js']

  functional:
    src: ['<%= srcDir %>/test/functional/**/*.js']

  acceptance:
    src: ['<%= srcDir %>/test/acceptance/**/*.js']
