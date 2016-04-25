/**
 * Created by Ilkka on 25.4.2016.
 */
"use strict";
var o = {};


o.Error = function(message, id, innerId){
  var err = new Error(message);
  err.id = id;
  err.innerId = innerId || '';

  return err;
};



module.exports = o;