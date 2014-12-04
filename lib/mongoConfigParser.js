/* global require, module, console, __dirname */
/* jshint -W097 */
'use strict';

var
  os = require('os'),
  fs = require('fs');


var MongoConfigParser = function() {
  var
    configFile  = null,
    envDir      = null,
    defaultHost = 'localhost',
    defaultPort = 27017,
    defaultDB; // undefined


  var getPortFromConfigFile = function() {

    fs.readFile(configFile, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      return data.search(/\nport\s*=\s*(\d+)\n/);
    });
  };


  var getEnvFile = function() {
    if(!envDir || !fs.existsSync(envDir)) {
      return false;
    }

    var
      customEnvFilePath = envDir + '/' + os.hostname().toLowerCase() + '.json',
      defautEnvFilePath = envDir + '/default.json';

    if(fs.existsSync(customEnvFilePath)) {
      return require(customEnvFilePath);
    } else if(fs.existsSync(defautEnvFilePath)) {
      return require(defautEnvFilePath);
    } else {
      return false;
    }
  };


  return {
    setEnvDir : function(dir) {
      if (fs.existsSync(dir)) {
        envDir = dir;
      }

      return this;
    },

    setMongoConfigFile : function(file) {
      if (fs.existsSync(file)) {
        configFile = file;
      }

      return this;
    },

    getConnectionString : function() {
      var
        ret = 'mongodb://',
        env = getEnvFile(),
        configFilePort;

      if(env) {
        if(env.user) {
          ret += env.user;
          if(env.password) {
            ret += ':' + env.password;
          }

          ret += '@';
        }

        ret += env.host ? env.host : defaultHost;
      } else {
        ret += defaultHost;
      }

      if(env && env.port) {
        ret += ':' + env.port;
      } else if(configFile) {
        configFilePort = getPortFromConfigFile();

        ret += ':';
        ret += configFilePort ? configFilePort : defaultPort;
      } else {
        ret += ':' + defaultPort;
      }

      ret += '/';
      ret += (env && env.database) ? env.database : defaultDB;

      return ret;
    }
  };
};



module.exports = MongoConfigParser;
