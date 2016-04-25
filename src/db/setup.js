/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Api:db');
var mongoose = require('mongoose');
var config = require('../helpers/configStub')('main');


//Connect to DB
/* istanbul ignore else */
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
/* istanbul ignore next */
var connecting = function (  ){
  debug('Connecting to db. connectionString: ' + config.db.connectionString);
};

/**
 * Eventhandler
 * Error on connecting to db
 */
/* istanbul ignore next */
var error = function (  ){
  debug('Connecting to db failed!');
};

/**
 * Eventhandler
 * Connected to db
 */
/* istanbul ignore next */
var connected = function (  ){
  debug('Connected to db!');
};

/**
 * Eventhandler
 * Reconnected to db
 */
/* istanbul ignore next */
var reconnected = function (  ){
  debug('Reconnected to db!');
};

//Events
/* istanbul ignore next */
mongoose.connection.on('connecting', connecting);

/* istanbul ignore next */
mongoose.connection.on('error', error);

/* istanbul ignore next */
mongoose.connection.on('connected', connected);

/* istanbul ignore next */
mongoose.connection.on('reconnected', reconnected);