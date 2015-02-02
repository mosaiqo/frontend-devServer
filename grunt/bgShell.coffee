# https://www.npmjs.org/package/grunt-bg-shell
module.exports =
  _defaults:
    bg: true


  nodemonDev:
    cmd: 'grunt nodemon:mosaiqoFrontend_dev'

  nodemonDev_stop:
    cmd: 'ps aux | grep "nodemon:mosaiqoFrontend_dev" | grep -v grep | awk \'{print $2}\' | xargs kill'
    bg: false



  nodemonProd:
    cmd: 'grunt nodemon:mosaiqoFrontend_production'

  nodemonProd_stop:
    cmd: 'ps aux | grep "nodemon:mosaiqoFrontend_production" | grep -v grep | awk \'{print $2}\' | xargs kill'
    bg: false



  mongod_start:
    cmd: 'mongod --config ./db/mongo/conf/mongodb.conf'

  mongod_stop:
    cmd: 'cat db/mongo/pid | xargs kill'
    bg: false

  mongod_setup:
    cmd: 'mkdir data && mkdir log && touch log/mongodb.log'
    execOpts:
      cwd: './db/mongo'
    bg: false

  mongod_populate:
    cmd: 'node ./util/populateDB.js'
    bg: false
