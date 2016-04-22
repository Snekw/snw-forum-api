/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var mongoose = require('mongoose');

var permissionGroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    scopes: [{type: mongoose.Schema.ObjectId, ref: 'permissionScope'}]
});

mongoose.model('permissionGroup', permissionGroupSchema);

// var n = mongoose.model('permissionScope');
// var d = new n();
// d.name = 'testScope';
// d.description = 'Test description';
// d.field = 't:t';
//
// d.save();
//
// var m = mongoose.model('permissionGroup');
// var s = new m();
// s.name = 'testGroup';
// s.description = 'Test description';
// s.scopes = [];
// s.scopes.push(d._id);
//
// s.save();