/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:lib');
var authConfig = require('../../config/authConfig');
var shortid = require('shortid');
var jwt = require('jsonwebtoken');
var db = require('../../db/models');

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
  //Find the user again and populate the permission fields
  db.user.findById(_user._id)
    .populate('permissions.scopes permissions.groups')
    .populate({
      path: 'permissions.groups',
      populate: {path: 'scopes'}
    })
    .exec(function (err, user) {
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
          if(err){
            debug('Failed to save login instance: ' + err);
            throw err;
          }
          debug('Login instance saved');
        });

        debug('Jwt options: ' + JSON.stringify(options));
        debug('Jwt payload: ' + JSON.stringify(payload));

        cb(jwt.sign(
          payload,
          authConfig.secret,
          options
        ));
      }else{
        debug('Error generating jwt: ' + err);
        throw err;
      }
    });
};
/**
 * Verify Jwt
 * Make sure the JWT is valid
 * Forced to HS256 to prevent exploits with algorithm type 'none'
 * @param {string} token - Jwt token to decode and verify
 * @param {Boolean} checkExpiry - Boolean to check if token has been expired or not
 * @return {Object} decoded token or nothing
 */
o.verifyJwt = function (token, checkExpiry) {
  checkExpiry = checkExpiry || false;

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
      o.verifyJwtExpiration(decoded, function (isValid) {
        if(isValid){
          return decoded;
        }
      });
    }else{
      return decoded;
    }

  }catch (err){
    debug('Jwt verify error: ' + JSON.stringify(err));
  }
};

/**
 * Verify jwt expiration
 * Check if there is a login instance active on that token
 * @param decodedToken
 * @param cb (Bool isValid, Object loginInstance)
 */
o.verifyJwtExpiration = function (decodedToken, cb) {
  db.loginInstance.findOne({jwtid: decodedToken.jti}, function (err, login) {
    if(err){
      debug('Error: ' + JSON.stringify(err));
      cb(false, null);
      return;
    }

    if(login){
      debug('Jwt not expired. Verify valid.');
      cb(true, login);
    }else{
      debug('Couldn\'t find login with that jwtid!');
      cb(false, null);
    }
  });
};

/**
 * Expire jwt
 * Manually expire the jwt.
 * Mainly used when logging out
 * Remove the entry from db.
 * @param jwt
 * @param cb
 */
o.expireJwt = function (jwt, cb) {
  var decoded = o.verifyJwt(jwt, false);

  if(decoded){
    o.verifyJwtExpiration(decoded, expire);
  }

  function expire(isValid, login) {
    if(!isValid){
      debug('Not a valid login. Can\'t expire');
      cb(false);
      return;
    }

    if(login){
      login.remove();
      debug('Login expired successfully');
      cb(true);
    }else{
      debug('Not a valid login. Can\'t expire');
      cb(false);
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