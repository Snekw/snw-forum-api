/**
 * Created by Ilkka on 15.4.2016.
 */
"use strict";
var request = require('request');
var debug = require('debug')('Auth:google');
var db = require('../../../db/models');
var uuid = require('node-uuid');
var shortid = require('shortid');
var lib = require('../lib');
var o = {};

/**
 * Validate Google ID Token
 * @param {String} idToken - Id token got from the client
 * @param {Function} cb - Callback function
 */
o.validateGoogleIdToken = function (idToken, cb) {
  request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + idToken, function (err, resp, body) {
    if(err){
      debug('Failed to validate the id token!');
      throw err;
    }

    if(resp.statusCode === 200){
      debug('Id token validated');
      cb(JSON.parse(body));
    }else{
      debug('Failed to validate the id token!');
      cb(null);
    }
  });
};

/**
 * Google authentication
 * Create a new user or match existing one
 * @param req
 * @param res
 * @param next
 */
o.auth = function (req, res, next) {

  //Validate the id token
  o.validateGoogleIdToken(req.body.idToken, vgitcb);
//TODO Splice this func
  function vgitcb(validated) {
    db.user.findOne({'authentication.emails': validated.email},
      function (err, user) {
        if(err){
          debug('Error finding user. Provider: google');
          next(err);
          return;
        }

        if(user){
          var prov = null;
          for(var i = 0; i < user.authentication.providers.length; i++){
            if(user.authentication.providers[i].pType === 'google'){
              prov = user.authentication.providers[i];
              break;
            }
          }
          if(prov){
            if(prov.email === validated.email && prov.id === validated.sub){
              lib.successFullAuth(user, res);
            }else{
              lib.failedAuth( {type: 'google', f: 'There is already an account using that email', a:'show', i:'g1' }, res);
            }
          }else{
            lib.failedAuth({type: 'google', f: 'There is already an account using that email', a:'show', i:'g2' }, res);
          }
        }else{
          if(!validated.email_verified){
            lib.failedAuth({type: 'google', f: 'Email needs to be verified!', a:'show', i:'g3' },res);
            return;
          }

          var newUser = new db.user();
          newUser.profile.email = validated.email;
          newUser.profile.userName = validated.name;
          newUser.profile.profileId = uuid.v1();
          newUser.profile.profileShortId = shortid.generate();
          newUser.authentication = {};
          newUser.authentication.emails = [];
          newUser.authentication.emails.push(validated.email.toString());
          newUser.authentication.activeLogins = [];
          newUser.authentication.providers = [];
          newUser.authentication.providers.push({
            pType: 'google',
            email: validated.email.toString(),
            id: validated.sub.toString()
          });

          newUser.save(function (err) {
            if(err){
              debug('Error saving user. Provider: google ' + JSON.stringify(err));
              next(err);
            }else{
              lib.successFullAuth(newUser, res);
            }
          });
        }
      });
  }
};

module.exports = o;