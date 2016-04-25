/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:lib');
var authConfig = require('../../helpers/configStub')('auth');
var shortid = require('shortid');
var jwt = require('jsonwebtoken');
var db = require('../../db/models');
var async = require('async');
var common = require('../../lib/common');

var o = {};

/*
 Generate JWT
 user: User db object
 return: signed jwt

 Generate the jwt and store the id of the jwt in DB.
 Storing the id triggers the db to add exp for the stored jwtid.
 Exp is Date.now() + authExpire time defined in auth config.
 */

/**
 * Generate Jwt
 * Generate the jwt and store the id of the jwt in DB.
 * Storing the id triggers the db to add exp for the stored jwtid.
 * Exp is Date.now() + authExpire time defined in auth config.
 * @param _user User object
 * @param cb Callback
 */
o.generateJwt = function (_user, cb) {
  if(_user === undefined || _user === null){
    cb(common.Error('User is not defined', '#lib-1'));
    return;
  }

  //Find the user again and populate the permission fields
  db.user.findById(_user._id)
    .populate('permissions.scopes permissions.groups')
    .populate({
      path: 'permissions.groups',
      populate: {path: 'scopes'}
    })
    .exec(function (err, user) {
      /* istanbul ignore if */
      if(err){
        debug('Error generating jwt: ' + err);
        throw err;
      }

      if(user){
        var payload = {
          scopes: user.permissions.scopes,
          groups: user.permissions.groups
        };

        var options =
            {
              algorithm: 'HS256',
              expiresIn: authConfig.authExpire,
              subject: 'snw-auth',
              issuer: 'snw-authSys',
              jwtid: shortid.generate()
            };

        var login = new db.loginInstance();
        login.user = user._id;
        login.jwtid = options.jwtid.toString();

        login.save(function (err) {
          /* istanbul ignore if */
          if(err){
            debug('Failed to save login instance: ' + err);
            throw err;
          }
          debug('Login instance saved');

          debug('Jwt options: ' + JSON.stringify(options));
          debug('Jwt payload: ' + JSON.stringify(payload));

          cb(null,  jwt.sign(
            payload,
            authConfig.secret,
            options
          ));
        });
      }else{
        debug('Error generating jwt: ' + err);
        cb(common.Error('User not found.', '#lib-2'));
      }
    });
};
/**
 * Verify Jwt
 * Make sure the JWT is valid
 * Forced to HS256 to prevent exploits with algorithm type 'none'
 * @param {string} token - Jwt token to decode and verify
 * @param {Boolean} checkExpiry - Boolean to check if token has been expired or not
 * @param {function} cb - callback(err, decoded token)
 */
o.verifyJwt = function (token, checkExpiry, cb) {

  var options = {
    algorithms: ['HS256'],
    issuer: 'snw-authSys',
    subject: 'snw-auth'
  };

  debug('Jwt verify options: ' + JSON.stringify(options));

  try{
    var decoded = jwt.verify(
      token,
      authConfig.secret,
      options
    );
    debug('Jwt verified: ' + JSON.stringify(decoded));

    if(checkExpiry){
      debug('Checking token expiry');
      o.verifyJwtExpiration(decoded, function (err) {
        if(!err){
          cb(null,  decoded);
        }else{
          cb(common.Error('Failed to verify expiration.', '#lib-4', err.id));
        }
      });
    }else{
      cb(null, decoded);
    }

  }catch (err){
    debug('Jwt verify error: ' + JSON.stringify(err));
    cb(common.Error('Jwt verifying failed.','#lib-3'));
  }
};

/**
 * Verify jwt expiration
 * Check if there is a login instance active on that token
 * @param decodedToken
 * @param cb (err, login)
 */
o.verifyJwtExpiration = function (decodedToken, cb) {
  db.loginInstance.findOne({jwtid: decodedToken.jti}, function (err, login) {
    /* istanbul ignore if */
    if(err){
      debug('Error: ' + JSON.stringify(err));
      cb(common.Error('Error finding login instance', '#lib-6'));
      return;
    }

    if(login){
      debug('Jwt not expired. Verify valid.');
      cb(null, login);
    }else{
      debug('Couldn\'t find login with that jwtid!');
      cb(common.Error('No login instance found', '#lib-7'));
    }
  });
};

/**
 * Expire jwt
 * Manually expire the jwt.
 * Mainly used when logging out
 * Remove the entry from db.
 * @param jwt
 * @param cb (err, succes)
 */
o.expireJwt = function (jwt, cb) {
  var decoded = o.verifyJwt(jwt, false, decodedCb);


  function decodedCb(err, decoded){
    if(err) return cb(common.Error('Error decoding token', '#lib-9', err.id));

    //Should newer get to the else statement
    /* istanbul ignore else */
    if(decoded){
      o.verifyJwtExpiration(decoded, expire);
    }else{
      return cb(common.Error('No decoded token. Can\'t expire.', '#lib-5'));
    }
  }

  function expire(err, login) {    
    if(err){
      debug('Not a valid login. Can\'t expire');
      cb(common.Error('Not a valid login', '#lib-8', err.id));
      return;
    }

    //Should newer get to the else statement
    //Errors handled else where
    /* istanbul ignore else */
    if(login){
      login.remove();
      debug('Login expired successfully');
      cb(null,  true);
    }else{
      debug('Not a valid login. Can\'t expire');
      cb(null,  false);
    }
  }
};

o.successFullAuth = function (user, res) {
  debug('Login successful');

  o.generateJwt(user, function (jwt) {
    res.status(200).json({message: "Authentication successful!", data:{ user: user.profile, jwt: jwt }});
  });

};

o.failedAuth = function (reason, res) {
  debug('Login failed');
  res.status(401).json({error: { status: 401, message: 'Authentication failed!' }, message: "Authentication failed!", data: {reason: reason}});
};

module.exports = o;