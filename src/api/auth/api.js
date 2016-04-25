/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:api');
var authConfig = require('../../helpers/configStub')('auth');
var db = require('../../db/models');
var http = require('http');
var lib = require('./lib');

//Providers
var pLocal = require('./providers/local');
var pGoogle = require('./providers/google');

var o = {};

/*
 Middleware for authentication providers
 Handle the post request for your auth provider here
 Handle the responses to the user here
 Call your authentication provider here
 */

//TODO Blacklist if user fails to login many times in row

o.loginDefault = pLocal.loginDefault;

o.registerDefault = pLocal.registerDefault;

o.google = pGoogle.auth;

o.logout = function (req, res) {
  return lib.expireJwt(req.headers.authentication, function (err, isSuccessful) {
    if(err){
      res.status(400).json({message: 'Failed to logout'});
      return;
    }

    //Should newer get to the else statement
    //Errors handled else where
    /* istanbul ignore else */
    if(isSuccessful){
      res.status(200).json({message: 'Logged out'});
    }else{
      res.status(400).json({message: 'Failed to logout'});
    }
  });
};

o.validateUsername = function (req, res, next) {
  if(!req.body.username){
    res.status(400).json({message: 'No username specified', data: { isValid: false}});
    return;
  }

  db.user.findOne({'profile.userName': req.body.username}, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      next(err);
      return;
    }

    if(user){
      debug('User found! Can\'t use that username!');
      res.status(200).json({message:'Username in use', data: {isValid: false}});
    }else{
      debug('User not found! Can use that username!');
      res.status(200).json({message:'Username not used', data: {isValid: true}});
    }
  });
};

o.validateEmail = function (req, res, next) {
  if(!req.body.email){
    res.status(400).json({message: 'No email specified', data: { isValid: false}});
    return;
  }

  db.user.findOne({'authentication.emails': req.body.email}, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      next(err);
      return;
    }

    if(user){
      debug('User found! Can\'t use that email!');
      res.status(200).json({message:'Email in use', data: {isValid: false}});
    }else{
      debug('User not found! Can use that email!');
      res.status(200).json({message:'Email not used', data: {isValid: true}});
    }
  });
};


module.exports = o;