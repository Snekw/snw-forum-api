/**
 * Created by Ilkka on 8.4.2016.
 */
"use strict";
var express = require('express');
var debug = require('debug')('Api:app');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('../config/config');

debug('Initialize express');
var app = express();
debug('Express initialized');

//Setup db
debug('Start setup db');
require('../db/setup');
debug('db setup finished');


//Enable bodyparser
debug('Enabling bodyParser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Logger
app.use(logger('dev'));

//Default headers
debug('Access-Control-Allow-Origin: ' + config.server.CORS);
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.server.CORS);
    res.header('Access-Control-Allow-Headers', ['authentication', 'content-type']);
    // res.header('Access-Control-Allow-Methods', ['PUT', 'DELETE']);
    next();
});

//Api route vars
debug('Adding routes');
var auth = require('../api/auth/routes.js');

//Api routes
app.use('/auth', auth);
debug('Adding routes finished');

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handlers

// Development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        res.status(err.status || 500);
        res.json({message: err.message, error: {status: err.status, stack: err.stack}});
    });
}

// Production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message: err.message, error: {}});
});

module.exports = app;