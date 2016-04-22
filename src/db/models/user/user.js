/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');
var shortid = require('shortid');
var ms = require('ms');
var authConfig = require('../../../config/authConfig');

/*
 Helpers
 */


/*
 User schema

 Never! send the actual _id of the db entry. Use profileId instead!
 */

var UserSchema = new mongoose.Schema({
  _id: {type: String, default: uuid.v1},
  authentication: {
    emails: [String],
    providers: [{
      pType: String,
      id: String,
      email: String
    }]
  },
  profile: {
    profileShortId: String,
    profileId: String,
    userName: {type: String, minlength:4 , maxlength:64},
    email: String,
    avatarUrl: {type: String, default: 'default'}
  },
  settings: {
    privacy: {
      email: String
    }
  },
  meta: {
    //TODO: Update the fields when changing the section. Try to make it automatic by adding methods to model.
    created: { type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now},
    profileModified: {type: Date, default: Date.now},
    settingsModified: {type: Date, default: Date.now},
    permissionScopesModified: {type: Date, default: Date.now},
    permissionGroupsModified: {type: Date, default: Date.now}
  },
  permissions: {
    scopes: [{type: mongoose.Schema.Types.ObjectId, ref: 'permissionScope'}],
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'permissionGroup'}]
  }
});

/*
 Generate hash
 pw: String
 return: String, hash for pw

 Generate the hash for the local password which we store in db
 */
UserSchema.methods.generateHash = function (pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(11), null);
};

/*
 Validate password
 pw: String
 return: true/false

 We compare the pw hash to the 'local' provider id
 */
UserSchema.methods.validatePassword = function (pw) {
  for (var i = 0; i < this.authentication.providers.length; i++){
    if(this.authentication.providers[i].pType === 'local'){
      return bcrypt.compareSync(pw, this.authentication.providers[i].id);
    }
  }
  return false;
};


mongoose.model('user', UserSchema);
