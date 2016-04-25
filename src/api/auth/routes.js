/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:routes');
var express = require('express');
var router = express.Router();

var authConfig = require('../../helpers/configStub')('auth');
var api = require('./api');
/*
    Base route: /auth
 */


/*
    List all the available routes here for authentication
    Implement the authentication with new provider implementation in /providers 
    Add the middleware implementation to api.js. 
    Call your provider implementation from api.js.
 */

//Verification methods
router.post('/v/u', api.validateUsername);
router.post('/v/e', api.validateEmail);

//Login / register
router.post('/default', api.loginDefault);
router.post('/default/r', api.registerDefault);
router.post('/google', api.google);

//Logout
router.post('/logout', api.logout);

module.exports = router;