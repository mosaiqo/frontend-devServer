# @see http://www.browsersync.io/docs/grunt/
module.exports =
  options:
    ui:
      port: '<%= browserSyncUIPort %>'
      weinre:
        port: '<%= weinrePort %>'

  dev:
    bsFiles:
      src: '<%= assetsDir %>/**/*.*'
    options:
      watchTask: true
      proxy: 'localhost:<%= serverPort %>'
