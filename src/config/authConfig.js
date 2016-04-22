/**
 * Created by Ilkka on 11.4.2016.
 */
"use strict";
var debug = require('debug')('Auth:config');
var o = {};

o.secret = 'secret';
o.authExpire = '7d';

o.providers = {};
o.providers.google = {};
o.providers.google.clientSecret = '';
o.providers.google.clientId = '';

debug('Auth Config: ' + JSON.stringify(o));

module.exports = o;