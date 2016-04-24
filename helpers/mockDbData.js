/**
 * Created by Ilkka on 23.4.2016.
 */
"use strict";
var dbModels   = require('../src/db/models'),
    uuid       = require('node-uuid'),
    shortid    = require('shortid');

var o = {};

o.scope = new dbModels.permissionScope({
  name: 'testScope',
  description: 'no description',
  field: 't'
}).save(function(err){
  if(err) throw err;
});

o.group = new dbModels.permissionGroup({
  name: 'testGroup',
  description: 'no there is really none',
  scopes: [o.scope._id]
}).save(function(err){
  if(err) throw err;
});

o.mockedUser = new dbModels.user();
o.mockedUser.profile = {
  email: 'asd@asd',
  userName: 'testuser',
  profileId: uuid.v1(),
  profileShortId: shortid.generate()
};
o.mockedUser.authentication = {
  emails: ['email@email', 'asd@asd'],
  providers:[
    {
      pType: 'local',
      id: '1234567890',
      email: 'asd@asd'
    }
  ]
};
o.mockedUser.permissions = {
  scopes: [o.scope._id],
  groups: [o.group._id]
};

o.mockedUser.save(function(err){
  if(err) throw err;
});

module.exports = o;