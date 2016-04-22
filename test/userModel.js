/* eslint-disable */
/**
 * Created by Ilkka on 22.4.2016.
 */
var expect = require( 'chai' ).expect;

var mongoose = require('mongoose');
var user = require('../src/db/models/user/user');
var model = mongoose.model('user');

describe( 'user model', function (){

  it( 'should exist', function (){
    expect(user).to.exist;
    expect(model).to.exist;
  });

  it( 'should exist', function (){
    expect(user).to.exist;
  });

  it( 'should have generateHash function', function (){
    expect(model.prototype.generateHash).to.exist;
  });

  it( 'generateHash function should not retun same value we give it', function (){
    var input = 'test input';
    var outPut = model.prototype.generateHash(input);
    expect(outPut).to.exist;
    expect(outPut).to.not.equal(input);
  });

  it( 'should have validatePassword function', function (){
    expect(model.prototype.validatePassword).to.exist;
  });

  it( 'validatePassword function should return false when we give it bad password', function (){
    var _user = new model();
    var input = 'test input';
    var outPut = model.prototype.generateHash(input);

    _user.authentication.providers.push({
      pType: 'local',
      id: outPut
    });

    var valid = _user.validatePassword('TEstoöi');

    expect(outPut).to.exist;
    expect(outPut).to.not.equal(input);
    expect(valid).to.be.false;
  });

  it( 'validatePassword function should return true when we give it valid password', function (){
    var _user = new model();
    var input = 'test input';
    var outPut = model.prototype.generateHash(input);

    _user.authentication.providers.push({
      pType: 'local',
      id: outPut
    });

    var valid = _user.validatePassword(input);

    expect(outPut).to.exist;
    expect(outPut).to.not.equal(input);
    expect(valid).to.be.true;
  });

  it( 'validatePassword function should return false if the provider is not found', function (){
    var _user = new model();
    var input = 'test input';
    var outPut = model.prototype.generateHash(input);

    _user.authentication.providers.push({
      pType: 'not local',
      id: outPut
    });

    var valid = _user.validatePassword(input);

    expect(outPut).to.exist;
    expect(outPut).to.not.equal(input);
    expect(valid).to.be.false;
  });
});