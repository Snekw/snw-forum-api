/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Api:db');
var mongoose = require('mongoose');
var config = require('../config/config');


//Connect to DB
if(config.db.enabled) {
  debug('Starting connection to db.');
  mongoose.connect(config.db.connectionString, config.db.options);
}else{
  debug('Not connecting to db.');
}

/**
 * Eventhandler
 * Connecting to db
 */
var connecting = function (  ){
  debug('Connecting to db. connectionString: ' + config.db.connectionString);
};

/**
 * Eventhandler
 * Error on connecting to db
 */
var error = function (  ){
  debug('Connecting to db failed!');
};

/**
 * Eventhandler
 * Connected to db
 */
var connected = function (  ){
  debug('Connected to db!');
};

/**
 * Eventhandler
 * Reconnected to db
 */
var reconnected = function (  ){
  debug('Reconnected to db!');
};

//Events

mongoose.connection.on('connecting', connecting);

mongoose.connection.on('error', error);

mongoose.connection.on('connected', connected);

mongoose.connection.on('reconnected', reconnected);