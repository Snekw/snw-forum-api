/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var mongoose = require('mongoose');

/*
 DB setup
 Require needed models
 */
require('./models/user/user');
require('./models/permissions/permissionScope');
require('./models/permissions/permissionGroup');
require('./models/user/loginInstance');

module.exports = {
  user: mongoose.model('user'),
  permissionScope: mongoose.model('permissionScope'),
  permissionGroup: mongoose.model('permissionGroup'),
  loginInstance: mongoose.model('loginInstance')
};