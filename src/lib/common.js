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

o.DataBaseError = function(res, innerErr, id){
 res.status(500).json({success: false, message: 'Database error.', error:{status: innerErr.statusCode, id:id, stack: o.FilterErrorStack(innerErr.stack)}});
};

o.FilterErrorStack = function(stack){
  if (process.env.NODE_ENV === 'development'){
    return stack;
  }
};

/**
 * @return {boolean}
 */
o.CheckIfValidEmail = function(email){
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var reg = regex.exec(email);

  return (reg && reg.length === 1)? true:false;
};

module.exports = o;