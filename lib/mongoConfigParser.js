/* global require, module, console, __dirname */
/* jshint -W097 */
'use strict';

var
  os = require('os'),
  fs = require('fs');


var MongoConfigParser = function() {
  var
    env         = null,
    defaultHost = 'localhost',
    defaultPort = 27017,
    defaultDatabase; // undefined


  /**
   * Environment file getter
   *
   * Returns the apppropiate environment file (a json, so returned as an obj).
   * If there's a file called {yourHostName}.json it will be returned.
   * If not found, it will search for a file called default.json.
   * If that file is not found neuiither, it will return false.
   *
   * @param  {String} envDir environment directory that contains the env. config. files
   * @return {Object}        environment obj. with its properties (host, port, user, pass and dbName)
   *                         or false if not found
   */
  var getEnv = function(envDir) {
    if(!envDir || !fs.existsSync(envDir)) {
      return false;
    }

    var
      base = envDir ? envDir + '/' : '',
      ext  = '.json',
      customEnvFilePath = base + os.hostname().toLowerCase() + ext,
      defautEnvFilePath = base + 'default' + ext;

    if(fs.existsSync(customEnvFilePath)) {
      return require(customEnvFilePath);
    } else if(fs.existsSync(defautEnvFilePath)) {
      return require(defautEnvFilePath);
    } else {
      return false;
    }
  };


  return {

    /**
     * Environment setter
     * @param {Object} envObj obj. with the following keys
     *                        (all of them are optional):
     *                          "host"     : string, mongo host name
     *                          "port"     : int, mongo port
     *                          "user"     : string, mongo user name
     *                          "password" : string, mongo password
     *                          "database" : string, mongo db name

     */
    setEnv : function(envObj) {
      env = envObj;

      // make the method chainable
      return this;
    },


    /**
     * Environment setter (set the env. dir and it will load the appropiate file)
     * @param {string} dir environment directory path
     */
    setEnvDir : function(dir) {
      if (fs.existsSync(dir)) {
        env = getEnv(dir);
      }

      // make the method chainable
      return this;
    },


    /**
     * Returns the mongo conn. string using the environment if deffined or using default values
     * @return {String} mongo connection string
     */
    getConnectionString : function() {
      var ret;

      // set the proto
      ret = 'mongodb://';

      if(env) {
        // set the user/password
        if(env.user) {
          ret += env.user;
          if(env.password) {
            ret += ':' + env.password;
          }

          ret += '@';
        }
      }

      // set the host
      ret += (env && env.host) ? env.host : defaultHost;

      // set the port
      ret += (env && env.port) ? env.port : defaultPort;

      // set the database name
      ret += '/';
      ret += (env && env.database) ? env.database : defaultDatabase;

      return ret;
    }
  };
};


module.exports = MongoConfigParser;
