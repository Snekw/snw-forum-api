/* eslint-disable global-require */
/* istanbul ignore next */
/**
 * Created by Ilkka on 22.4.2016.
 */
"use strict";
module.exports = function(conf){
  if (process.env.SNW_FORUM_API_DEV){
    return require('../config/' + conf + 'ConfigDev');
  }else{
    return require('../config/' + conf + 'Config');
  }
};