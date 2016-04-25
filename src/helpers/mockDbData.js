/**
 * Created by Ilkka on 23.4.2016.
 * I know this file is awfull. I should make it better but nah. It works... maybe... sometimes..
 */
"use strict";
var dbModels   = require('../db/models'),
    uuid       = require('node-uuid'),
    shortid    = require('shortid');


module.exports = function(cb){
  var o = {};

  o.group = new dbModels.permissionGroup({
    name: 'testGroup',
    description: 'no there is really none'
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

  o.scope = new dbModels.permissionScope({
    name: 'testScope',
    description: 'no description',
    field: 't'
  }).save(function(err){
    if(err) throw err;

    dbModels.permissionScope.findOne({name:'testScope'}, function(err, scope){
      if(err)throw err;
      o.scope = scope;
      o.group.scopes.push(scope._id);
      o.group.save();

      dbModels.permissionGroup.findOne({'name': 'testGroup'}, function(err, group){
        if(err) throw err;
        o.group = group;


        o.mockedUser.permissions = {
          scopes: [],
          groups: []
        };
        o.mockedUser.permissions.scopes.push(o.scope._id);
        o.mockedUser.permissions.groups.push(o.group._id);

        o.mockedUser.save(function(){
          cb();
        });
      });
    });
  });
};