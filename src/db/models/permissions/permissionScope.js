/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";

var mongoose = require('mongoose');

var permissionScopeSchema = new mongoose.Schema({
    name: String,
    description: String,
    field: String
  });

mongoose.model('permissionScope', permissionScopeSchema);
