/* eslint-disable */
/**
 * Created by Ilkka on 22.4.2016.
 */
var chai = require( 'chai' ),
    expect = chai.expect,
    proxyquire = require('proxyquire'),
    configStub = require('../helpers/configStub'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mongoose = require('mongoose');

chai.use(sinonChai);

before(function(){
  proxyquire('../src/db/setup', {'../../config/config': configStub});
});

after(function(){
  mongoose.connection.close();
});