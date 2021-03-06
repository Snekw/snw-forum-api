/**
 * Created by Ilkka on 12.4.2016.
 */
"use strict";
var mongoose = require('mongoose');
var ms = require('ms');
var authConfig = require('../../../helpers/configStub')('auth');

/*
 Login instance Schema
 */
var LoginInstanceSchema = new mongoose.Schema({
  user: {type: String, ref: 'user'},
  jwtid: String,
  expAt: Date
});

//TODO: Add info about the login to the schema so we can help the user to see if the login is made by him/her

//Expiration
LoginInstanceSchema.index({expAt: 1}, { expireAfterSeconds: ms(authConfig.authExpire) /1000 });

//Expiration
LoginInstanceSchema.methods.setExpiry = function (next) {
  this.expAt = Date.now();
  next();
};

//Expiration
LoginInstanceSchema.methods.ensureCb = function(err) {
  if (err){
    throw err;
  }
};

//Expiration
LoginInstanceSchema.pre('save', LoginInstanceSchema.methods.setExpiry);

mongoose.model('loginInstance', LoginInstanceSchema);


//Expiration
mongoose.model('loginInstance').ensureIndexes(LoginInstanceSchema.methods.ensureCb);