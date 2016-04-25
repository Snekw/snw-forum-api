/* eslint-disable */
/**
 * Created by Ilkka on 23.4.2016.
 */
var chai         = require('chai'),
    expect       = chai.expect,
    proxyquire   = require('proxyquire'),
    sinon        = require('sinon'),
    sinonChai    = require('sinon-chai');

chai.use(sinonChai);
var app;

describe('app', function(){
  before(function(){
    app = require('../../src/bin/app');
  });
  
  it('should run without errors', function(){
    expect(app).to.exist;
  });
});