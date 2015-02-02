# server side tests (for the dev server and fake API)
module.exports =
  options:
    reporter: 'spec'

  unit:
    src: ['<%= srcDir %>/server/test/unit/**/*.js']

  integration:
    src: ['<%= srcDir %>/server/test/integration/**/*.js']

  functional:
    src: ['<%= srcDir %>/server/test/functional/**/*.js']

  acceptance:
    src: ['<%= srcDir %>/server/test/acceptance/**/*.js']
