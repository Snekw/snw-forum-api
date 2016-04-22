/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var mongoose = require('mongoose');
var o = {};

o.user = mongoose.model('user');
o.permissionScope = mongoose.model('permissionScope');
o.permissionGroup = mongoose.model('permissionGroup');
o.loginInstance = mongoose.model('loginInstance');

module.exports = o;