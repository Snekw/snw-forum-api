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
    config     = require('../src/helpers/configStub')('main'),
    authConfig = require('../src/helpers/configStub')('auth');

chai.use(sinonChai);
describe('/', function(){

  before(function(){
    app = require('../src/bin/app');
  });

  it('should return 404', function(done){
    supertest(app)
      .get('/notfound')
      .expect(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(404);
      })
      .end(done);
  });
});