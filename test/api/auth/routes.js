/* eslint-disable */
/**
 * Created by Ilkka on 25.4.2016.
 */
var chai       = require('chai'),
    expect     = chai.expect,
    mongoose   = require('mongoose'),
    sinon      = require('sinon'),
    sinonChai  = require('sinon-chai'),
    supertest  = require('supertest'),
    dbHelpers  = require('../../../src/helpers/dbHelpers'),
    config     = require('../../../src/helpers/configStub')('main'),
    authConfig = require('../../../src/helpers/configStub')('auth');

chai.use(sinonChai);
var routes,
    api,
    app,
    lib,
    dbModels;

describe('auth routes', function(){
  before(function(){
    app = require('../../../src/bin/app');
    lib = require('../../../src/api/auth/lib');
    dbModels = require('../../../src/db/models');
  });

  beforeEach(function(done){
    dbHelpers.clearAndMock(done);
  });

  after(function(done){
    dbHelpers.clearAndMock(done);
  });

  describe('/auth/v/u', function(){
    it('should return 200 with json  with unused username', function(done){
      supertest(app)
        .post('/auth/v/u')
        .send({username:'test'})
        .expect(function(res){
          expect(res.status).to.equal(200);
          expect(res.body.data.isValid).to.be.true;
        })
        .expect(200, done);
    });

    it('should return 200 with json isValid false with used username', function(done){
      supertest(app)
        .post('/auth/v/u')
        .send({username:'testuser'})
        .expect(function(res){
          expect(res.status).to.equal(200);
          expect(res.body.data.isValid).to.be.false;
        })
        .expect(200, done);
    });

    it('should return 400', function(done){
      supertest(app)
        .post('/auth/v/u')
        .send({})
        .expect(function(res){
          expect(res.status).to.equal(400);
          expect(res.body.data.isValid).to.be.false;
        })
        .expect(400, done);
    });
  });

  describe('/auth/v/e', function(){
    it('should return 200 with json with unused email', function(done){
      supertest(app)
        .post('/auth/v/e')
        .send({email:'not@asd'})
        .expect(function(res){
          expect(res.status).to.equal(200);
          expect(res.body.data.isValid).to.be.true;
        })
        .expect(200, done);
    });

    it('should return 200 with json isValid false with used email', function(done){
      supertest(app)
        .post('/auth/v/e')
        .send({email:'asd@asd'})
        .expect(function(res){
          expect(res.status).to.equal(200);
          expect(res.body.data.isValid).to.be.false;
        })
        .expect(200, done);
    });

    it('should return 400', function(done){
      supertest(app)
        .post('/auth/v/e')
        .send({})
        .expect(function(res){
          expect(res.status).to.equal(400);
          expect(res.body.data.isValid).to.be.false;
        })
        .expect(400, done);
    });
  });
  
  describe('/auth/logout', function(){
    it('Should logout succesfully with valid login', function(done){
      var token;
      dbModels.user.findOne({'profile.userName': 'testuser'}, dbFindCb);

      function dbFindCb(err, user){
        expect(err).to.not.exist;
        expect(user).to.exist;

        lib.generateJwt(user, genJwtCb)
      }

      function genJwtCb(err, jwt){
        expect(err).to.not.exist;
        expect(jwt).to.exist;
        supertest(app)
          .post('/auth/logout')
          .set('authentication', jwt)
          .expect(200, done);
      }
    });

    it('Should fail to logout with bad token', function(done){
      supertest(app)
        .post('/auth/logout')
        .set('authentication', "sdfghu")
        .expect(400, done);
    });
  });

  describe('/auth/default/r', function(){
    it('should register successfully', function(done){
      var body = {
        email: 'test@test',
        pw: 'not mine',
        userName: 'really'
      };

      supertest(app)
        .post('/auth/default/r')
        .send(body)
        .expect(200, done);

    });
    
    it('should fail to register with used email', function(done){
      var body = {
        email: 'asd@asd',
        pw: 'not mine',
        userName: 'really'
      };

      supertest(app)
        .post('/auth/default/r')
        .send(body)
        .expect(401, done);

    });
  });

  describe('/auth/default', function(){
    it('should login successfully with valid email and password', function(done){

      var body = {
        email: 'test@test',
        pw: 'not mine',
        userName: 'really'
      };

      var loginBody = {
        email: 'test@test',
        pw: 'not mine'
      };

      supertest(app)
        .post('/auth/default/r')
        .send(body)
        .expect(401, doLogin);

      function doLogin(){
        supertest(app)
          .post('/auth/default')
          .send(loginBody)
          .expect(200, done);
      }
    });

    it('should fail with bad email', function(done){

      var body = {
        email: 'test@test',
        pw: 'not mine',
        userName: 'really'
      };

      var loginBody = {
        email: 'test@bad',
        pw: 'not mine'
      };

      supertest(app)
        .post('/auth/default/r')
        .send(body)
        .expect(200)
        .end(doLogin);

      function doLogin(){
        supertest(app)
          .post('/auth/default')
          .send(loginBody)
          .expect(401, done);
      }
    });

    it('should fail with bad password', function(done){

      var body = {
        email: 'test@test',
        pw: 'not mine',
        userName: 'really'
      };

      var loginBody = {
        email: 'test@test',
        pw: 'not mine hehe'
      };

      supertest(app)
        .post('/auth/default/r')
        .send(body)
        .expect(200)
        .end(doLogin);

      function doLogin(){
        supertest(app)
          .post('/auth/default')
          .send(loginBody)
          .expect(401, done);
      }
    });
  });
});