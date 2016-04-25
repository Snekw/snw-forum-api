/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:local');
var authConfig = require('../../../helpers/configStub')('auth');
var db = require('../../../db/models');
var uuid = require('node-uuid');
var lib = require('../lib');
var shortid = require('shortid');

var o = {};

o.loginDefault = function (req, res, next) {
  var email = req.body.email;
  var pw = req.body.pw;

  debug('Login starting. Using local.');
  login(email, pw, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      next(err);
      return;
    }

    if(user !== 'bad'){
      lib.successFullAuth(user, res);
    }else{
      lib.failedAuth({type: 'local', f:'Wrong email or password.', a: 'show'}, res);
    }

  });
};

o.registerDefault = function (req, res, next) {
  var email = req.body.email;
  var pw = req.body.pw;
  var userName = req.body.userName;

  debug('Registration starting. Using local.');
  register(email, pw, userName, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      next(err);
      return;
    }

    if(user !== 'bad'){
      debug('Registration successful');
      lib.successFullAuth(user, res);
    }else{
      debug('Registration failed');
      lib.failedAuth({type: 'local', f:'Registration failed.', a: 'register'}, res);
    }
  });
};

/*
 Login
 email: String,
 pw: String,
 cb(err, user): Callback function
 */
var login = function (email, pw, cb) {
  db.user.findOne({'authentication.emails': email}, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      cb(err, 'bad');
      return;
    }
    if(user){
      if(user.validatePassword(pw)){
        debug('Auth successful.');
        debug('User: ' + JSON.stringify(user));
        cb(null, user);
      }else{
        debug('Bad password');
        cb(null, 'bad');
      }
    }else{
      debug('User not found');
      cb(null, 'bad');
    }
  });
};

//TODO don't allow same username....
/*
 Register
 email: String,
 pw: String,
 cb(err, user): Callback function
 */
var register = function (email, pw, userName, cb) {
  db.user.findOne({'authentication.emails': email}, function (err, user) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      cb(err, 'bad');
      return;
    }

    if(user){
      debug('Bad auth. Email already in use.');
      cb(null, 'bad');
    }else{
      debug('Starting user generation.');
      var u = new db.user();
      u.profile = {};
      u.profile.email = email;
      u.profile.userName = userName;
      u.profile.profileId = uuid.v1();
      u.profile.profileShortId = shortid.generate();
      u.authentication = {};
      u.authentication.emails = [];
      u.authentication.emails.push(email.toString());
      u.authentication.activeLogins = [];
      u.authentication.providers = [];
      u.authentication.providers.push({
        pType: 'local',
        email: email.toString(),
        id: u.generateHash(pw).toString()
      });

      // We store the password hash in the provider id field.
      // We don't need to assign the user local provider id because
      // we can use the actual id or profile id

      u.save(function (err) {
        /* istanbul ignore if */
        if(err){
          debug('Error: ' + JSON.stringify(err));
          cb(err, 'bad');
          return;
        }
        db.user.findById(u._id, function (err, user) {
          /* istanbul ignore if */
          if(err){
            debug('Error: ' + JSON.stringify(err));
            cb(err, 'bad');
            return;
          }

          /* istanbul ignore else */
          if(user){
            debug('User saved. User: ' + JSON.stringify(user));
            cb(null, user);
          }else{
            debug('Created user not found!');
            cb(err, 'bad');
          }
        });
      });
    }
  });
};

module.exports = o;