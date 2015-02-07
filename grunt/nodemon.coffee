# Nodemon
# @see https://github.com/ChrisWren/grunt-nodemon
module.exports =

  mosaiqoFrontend_dev:
    script: './src/app.js'
    options:
      args: ['dev']
      nodeArgs: ['--debug']
      watch: ['./src']
      callback: (nodemon) ->
        nodemon.on "log", (event) ->
          console.log event.colour
          return
      env:
        PORT: '<%= proxiedServer_port %>'

  mosaiqoFrontend_production:
    script: './src/app.js'
    options:
      watch: ['./src']
      callback: (nodemon) ->
        nodemon.on "log", (event) ->
          console.log event.colour
          return
      env:
        PORT: '<%= serverPort %>'
