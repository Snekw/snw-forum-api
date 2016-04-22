/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Api:db');
var mongoose = require('mongoose');
var config = require('../config/config');

/*
 DB setup
 Require needed models
 */
require('./models/user/user');
require('./models/permissions/permissionScope');
require('./models/permissions/permissionGroup');
require('./models/user/loginInstance');

//Connect to DB
if(config.db.enabled) {
    debug('Starting connection to db.');
    mongoose.connect(config.db.connectionString);
}else{
    debug('Not connecting to db.');
}

//Events

mongoose.connection.on('connecting', function () {
    debug('Connecting to db. connectionString: ' + config.db.connectionString);
});

mongoose.connection.on('error', function () {
    debug('Connecting to db failed!');
});

mongoose.connection.on('connected', function () {
    debug('Connected to db!');
});

mongoose.connection.on('reconnected', function () {
    debug('Reconnected to db!');
});