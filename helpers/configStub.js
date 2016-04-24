/* eslint-disable global-require */
/**
 * Created by Ilkka on 22.4.2016.
 */
"use strict";
module.exports = function(conf){
  if (process.env.SNW_FORUM_API_DEV){
    return require('../src/config/' + conf + 'Dev');
  }else{
    return require('../src/config/' + conf);
  }
};