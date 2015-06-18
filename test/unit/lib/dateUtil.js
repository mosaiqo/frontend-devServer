/* global require, module, process, console, describe, it, before, after, afterEach, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../../',
  appRootDir     = projectRootDir + 'src/',

  // other
  _              = require('underscore'),

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // file to test
  dateUtil       = requireHelper('lib/dateUtil');


describe('lib/dateUtil', function() {

  it('should convert a valid date to an Unix timestamp', function(done) {

    var
      date      = new Date(),
      timestamp = dateUtil.dateToTimestamp(date);

    expect(timestamp).to.be.a('number');
    expect(timestamp).to.match(/^\d{10}$/);

    done();
  });


  it('should return null when attempting to convert a non valid date to an Unix timestamp', function(done) {

    var
      date      = '',
      timestamp = dateUtil.dateToTimestamp(date);

    expect(timestamp).to.be.null;

    done();
  });


  it('should convert a valid timestamp to a date instance', function(done) {

    var
      timestamp = 1434644629,
      date      = dateUtil.timestampToDate(timestamp);

    expect(_.isDate(date)).to.be.true;
    done();
  });


  it('should return null when attempting to convert a non valid timestamp to a date', function(done) {

    var
      timestamp = null,
      date      = dateUtil.timestampToDate(timestamp);

    expect(date).to.be.null;

    timestamp = '1234567890123';
    date      = dateUtil.timestampToDate(timestamp);

    expect(date).to.be.null;

    timestamp = 'HOCTL·LA';
    date      = dateUtil.timestampToDate(timestamp);

    expect(date).to.be.null;

    done();
  });

});