# Nodemon
# @see https://github.com/ChrisWren/grunt-nodemon
module.exports =

  mosaiqoFrontend_dev:
    script: './app.js'
    options:
      args: ['dev']
      nodeArgs: ['--debug']
      watch: ['.']
      callback: (nodemon) ->
        nodemon.on "log", (event) ->
          console.log event.colour
          return
      env:
        PORT: '<%= proxiedServer_port %>'

  mosaiqoFrontend_production:
    script: './app.js'
    options:
      watch: ['.']
      callback: (nodemon) ->
        nodemon.on "log", (event) ->
          console.log event.colour
          return
      env:
        PORT: '<%= serverPort %>'
