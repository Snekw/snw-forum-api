/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:api');
var authConfig = require('../../helpers/configStub')('auth');
var db = require('../../db/models');
var http = require('http');
var lib = require('./lib');
var common = require('../../lib/common');

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

o.validate = function(req, res, next){
  if(!req.body.type || !req.body.data){
    debug('Invalid validate request');
    o.invalidValidateRequest(res, '#api-1');
    return;
  }
  debug('Validate request with: type: ' + req.body.type.toString() + ' data: ' + req.body.data.toString() );
  var type = req.body.type.toString();
  var data = req.body.data.toString();

  var find = {};

  switch(type){
    case 'email':
      if(!common.CheckIfValidEmail(data)){
        o.invalidValidateRequest(res, '#api-2');
        return;
      }else{
        find = {'authentication.emails': data};
      }
      break;
    case 'userName':
      find = {'profile.userName': data};
      break;
    default:
      o.invalidValidateRequest(res, '#api-3');
      return;
  }


  db.user.findOne(find, function (err, item) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      o.DataBaseError(res, err, '#api-4');
      return;
    }

    if(item){
      debug('Validate: Extisting document');
      res.status(200).json({success: true, message:'In use', data: {isValid: false, type: type}});
    }else{
      debug('Validate: No extisting document');
      res.status(200).json({success: true, message:'Not used', data: {isValid: true, type: type}});
    }
  });
  
};

o.invalidValidateRequest = function(res, errId){
  res.status(400).json({success: false, message: 'Invalid data', error:{status: 400, id: errId }, data: { isValid: false, type: null}});
};

module.exports = o;