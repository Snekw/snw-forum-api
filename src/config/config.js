/**
 * Created by Ilkka on 8.4.2016.
 */
"use strict";
var debug = require('debug')('Api:config');
var o = {};
o.server = {};
o.server.useHttps = false;
o.server.CORS = 'http://localhost:1337';


o.db = {};
o.db.connectionString = 'mongodb://localhost/snw-forum';
o.db.enabled = true;

debug('Main Config: ' + JSON.stringify(o));

module.exports = o;