# @see http://www.browsersync.io/docs/grunt/
module.exports =
  dev:
    bsFiles:
      src: '<%= assetsDir %>/**/*.*'
    options:
      watchTask: true
      proxy: 'localhost:<%= proxiedServer_port %>'
      port: '<%= serverPort %>'
