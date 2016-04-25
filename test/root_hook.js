/* eslint-disable */
/**
 * Created by Ilkka on 22.4.2016.
 */
var chai = require( 'chai' ),
    expect = chai.expect,
    proxyquire = require('proxyquire'),
    dbHelpers = require('../src/helpers/dbHelpers'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    mongoose = require('mongoose'),
    async = require('async');

chai.use(sinonChai);


before(function(done){
  require('../src/db/setup');

  dbHelpers.clearAndMock(done);
});

after(function(){
  dbHelpers.clearDb();
  mongoose.connection.close();
});