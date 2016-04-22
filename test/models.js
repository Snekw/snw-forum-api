/* eslint-disable */
/**
 * Created by Ilkka on 22.4.2016.
 */
"use strict";

var expect = require('chai').expect,
    proxyquire = require('proxyquire');

var configStub = {};
if (process.env.SNW_FORUM_API_DEV){
  configStub = require('../src/config/configDev');
}else{
  configStub = require('../src/config/config');
}

proxyquire('../src/db/setup', configStub);
var models = require('../src/db/models');

describe('Models.js', function (  ){
  it('should have user model', function (  ){
    console.log(configStub.db.enabled);
    expect(models.user).to.exist;
  });

  it('should have permissionScope model', function (  ){
    expect(models.permissionScope).to.exist;
  });

  it('should have permissionGroup model', function (  ){
    expect(models.permissionGroup).to.exist;
  });

  it('should have loginInstance model', function (  ){
    expect(models.loginInstance).to.exist;
  });
});