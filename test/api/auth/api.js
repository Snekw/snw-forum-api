/* eslint-disable */
/**
 * Created by Ilkka on 23.4.2016.
 */
var chai       = require('chai'),
    expect     = chai.expect,
    proxyquire = require('proxyquire'),
    mongoose   = require('mongoose'),
    sinon      = require('sinon'),
    sinonChai  = require('sinon-chai');

chai.use(sinonChai);
var api;
var lib;

describe('auth api', function(){
  before(function(){
    lib = require('../../../src/api/auth/lib');
    api = require('../../../src/api/auth/api');
  });

  it('should have loginDefault function', function(){
    expect(api.loginDefault).to.exist;
  });

  it('should have registerDefault function', function(){
    expect(api.registerDefault).to.exist;
  });

  it('should have google function', function(){
    expect(api.google).to.exist;
  });

  it('should have logout function', function(){
    expect(api.logout).to.exist;
  });

  it('should have validateUsername function', function(){
    expect(api.validateUsername).to.exist;
  });

  it('should have validateEmail function', function(){
    expect(api.validateEmail).to.exist;
  });
});