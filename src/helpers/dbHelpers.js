/**
 * Created by Ilkka on 25.4.2016.
 */
"use strict";
var async = require('async');
var mongoose = require('mongoose');
var mockDb = require('../helpers/mockDbData');

module.exports = {
  clearDb: function(_cb){
    async.parallel([
      function(cb){
        mongoose.connection.collections['users'].drop(cb);
      },
      function(cb){
        mongoose.connection.collections['permissionscopes'].drop(cb);
      },
      function(cb){
        mongoose.connection.collections['permissiongroups'].drop(cb);
      },
      function(cb){
        mongoose.connection.collections['logininstances'].drop(cb);
      }
    ], _cb);
  },

  mockDb: mockDb,

  clearAndMock: function(cb){
    this.clearDb(function(){
      mockDb(cb);
    });
  }
};