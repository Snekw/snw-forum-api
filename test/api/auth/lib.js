/* eslint-disable */
/**
 * Created by Ilkka on 23.4.2016.
 */
var chai       = require('chai'),
    expect     = chai.expect,
    proxyquire = require('proxyquire'),
    mongoose   = require('mongoose'),
    sinon      = require('sinon'),
    sinonChai  = require('sinon-chai'),
    request     = require('request'),
    jsonwebtoken = require('jsonwebtoken'),
    dbHelpers = require('../../../src/helpers/dbHelpers');

chai.use(sinonChai);

var lib;
var dbModels;

describe('lib', function(){
  before(function(){
    lib = require('../../../src/api/auth/lib');
    dbModels = require('../../../src/db/models');
  });
  
  beforeEach(function(done){
    dbHelpers.clearAndMock(done);
  });

  after(function(done){
    dbHelpers.clearAndMock(done);
  });

  it('should have generateJwt method', function(){
    expect(lib.generateJwt).to.exist;
  });

  it('should have verifyJwt method', function(){
    expect(lib.verifyJwt).to.exist;
  });

  it('should have verifyJwtExpiration method', function(){
    expect(lib.verifyJwtExpiration).to.exist;
  });

  it('should have expireJwt method', function(){
    expect(lib.expireJwt).to.exist;
  });

  it('should have successFullAuth method', function(){
    expect(lib.successFullAuth).to.exist;
  });

  it('should have failedAuth method', function(){
    expect(lib.failedAuth).to.exist;
  });

  it('generateJwt should return a jwt', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      genJwt(user);
    });

    function genJwt(user){
      lib.generateJwt(user, genJwtCb);
    }

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;
      expect(jwt.length).to.be.above(10);
      done();
    }
  });

  it('jwt should have content', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      genJwt(user);
    });

    function genJwt(user){
      lib.generateJwt(user, genJwtCb);
    }

    function genJwtCb(err, jwt){
      var parsed = jsonwebtoken.decode(jwt);

      expect(err).to.not.exist;
      expect(jwt).to.exist;
      expect(jwt.length).to.be.above(10);

      expect(parsed).to.exist;
      expect(parsed.iss).to.equal('snw-authSys');
      expect(parsed.jti).to.exist;
      expect(parsed.sub).to.equal('snw-auth');
      expect(parsed.exp).to.exist;
      expect(parsed.groups).to.exist;
      expect(parsed.scopes).to.exist;
      done();
    }
  });

  it('generateJwt should return a error if user is not found', function(done){
    dbModels.user.findOne({'profile.userName': 'not me'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;

      genJwt(user);
    });

    function genJwt(user){
      lib.generateJwt(user, genJwtCb);
    }

    function genJwtCb(err, jwt){
      expect(err).to.exist;
      expect(err).to.be.an('error');
      expect(err.message).to.not.be.empty;
      expect(err.id).to.equal('#lib-1');
      expect(jwt).to.not.exist;
      done();
    }
  });

  it('generateJwt should return a error if user is found but it is malformed by changing id', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;

      user._id = '123456';
      genJwt(user);
    });

    function genJwt(user){
      lib.generateJwt(user, genJwtCb);
    }

    function genJwtCb(err, jwt){
      expect(err).to.exist;
      expect(err).to.be.an('error');
      expect(err.message).to.not.be.empty;
      expect(err.id).to.equal('#lib-2');
      expect(jwt).to.not.exist;
      done();
    }
  });

  it('verifyJwt should pass succesfully with valid token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;

      lib.verifyJwt(jwt, false, verifyCb);
    }

    function verifyCb(err, decoded){
      expect(err).to.not.exist;

      expect(decoded).to.exist;
      expect(decoded.iss).to.equal('snw-authSys');
      expect(decoded.jti).to.exist;
      done();

    }
  });

  it('verifyJwt should fail with broken token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;
      jwt = 'hehe';

      lib.verifyJwt(jwt, false, verifyCb);
    }

    function verifyCb(err, decoded){
      expect(err).to.exist;
      expect(decoded).to.not.exist;
      expect(err).to.be.an('error');
      expect(err.message).to.not.be.empty;
      expect(err.id).to.equal('#lib-3');

      done();
    }
  });

  it('verifyJwt should pass checking expiry with valid token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if( err ) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;
      lib.verifyJwt(jwt, true, verifyCb);

    }

    function verifyCb(err, decoded){
      expect(err).to.not.exist;

      expect(decoded).to.exist;
      expect(decoded.iss).to.equal('snw-authSys');
      expect(decoded.jti).to.exist;
      done();
    }
  });

  it('verifyJwt should fail checking expiry with expired token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;
      var jwtdecoded = jsonwebtoken.decode(jwt);
      //remove the token from logininstances. That expires the token
      dbModels.loginInstance.findOneAndRemove({jwtid: jwtdecoded.jti},function(err){
        expect(err).to.not.exist;
        lib.verifyJwt(jwt, true, verifyCb);
      });
    }

    function verifyCb(err, decoded){
      expect(err).to.exist;
      expect(err).to.be.an('error');
      expect(err.message).to.not.be.empty;
      expect(err.id).to.equal('#lib-4');

      expect(decoded).to.not.exist;
      done();
    }
  });

  it('expireJwt should pass expiring jwt with valid token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;

      lib.expireJwt(jwt, expireJwtCb);
    }

    function expireJwtCb(err, success){
      expect(err).to.not.exist;
      expect(success).to.be.true;
      done();
    }
  });

  it('expireJwt should fail expiring jwt with expired token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;

      var jwtdecoded = jsonwebtoken.decode(jwt);
      //remove the token from logininstances. That expires the token
      dbModels.loginInstance.findOneAndRemove({jwtid: jwtdecoded.jti},function(err){
        expect(err).to.not.exist;
        lib.expireJwt(jwt, expireJwtCb);
      });
    }

    function expireJwtCb(err, success){
      expect(err).to.exist;
      expect(err.id).to.equal('#lib-8');
      expect(err.innerId).to.equal('#lib-7');
      expect(success).to.not.exist;
      done();
    }
  });

  it('expireJwt should fail expiring jwt with invalid token', function(done){
    dbModels.user.findOne({'profile.userName': 'testuser'}, function(err, user){
      if(err) throw err;

      expect(err).to.not.exist;
      lib.generateJwt(user, genJwtCb);
    });

    function genJwtCb(err, jwt){
      expect(err).to.not.exist;
      expect(jwt).to.exist;
      jwt = "buu";
      lib.expireJwt(jwt, expireJwtCb);
    }

    function expireJwtCb(err, success){
      expect(err).to.exist;
      expect(err.message).to.not.be.empty;
      expect(err.id).to.equal('#lib-9');
      expect(err.innerId).to.equal('#lib-3');
      expect(success).to.not.exist;
      done();
    }
  });
});