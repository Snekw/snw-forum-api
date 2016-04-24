/* eslint-disable */
/**
 * Created by Ilkka on 22.4.2016.
 */
var expect = require( 'chai' ).expect;

var mongoose = require('mongoose');
var loginInstance = require('../../src/db/models/user/loginInstance');
var model = mongoose.model('loginInstance');

describe( 'loginInstanceModel', function (){

  it( 'should exist', function (){
    expect(loginInstance).to.exist;
    expect(model).to.exist;
  });

  it( 'should have setExpiry function', function (){
    expect(model.prototype.setExpiry).to.exist;
  });

  it( 'setExpiry should set expAt', function (){

    var instance = new model();
    expect(instance.expAt).to.not.exist;

    instance.setExpiry(function (){});
    
    expect(instance.expAt).to.exist;
  });

  it( 'should have ensureCb function', function (){
    expect(model.prototype.ensureCb).to.exist;
  });

  it( 'ensureCb should throw if err', function (){

    var instance = new model();
    var ierr = new ReferenceError('');
    expect(instance.ensureCb.bind(instance, ierr)).to.throw(ierr, '');
  });

  it( 'ensureCb should not throw if no err', function (){

    var instance = new model();
    instance.ensureCb(null);

    expect(instance).to.not.throw;
  });

});