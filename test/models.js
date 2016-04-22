/**
 * Created by Ilkka on 22.4.2016.
 */
"use strict";

var expect = require('chai').expect;


require('../src/db/setup');
var models = require('../src/db/models');

describe('Models.js', function (  ){
  beforeEach(function (  ){
    models = require('../src/db/models');
  });

  it('should have user model', function (  ){
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