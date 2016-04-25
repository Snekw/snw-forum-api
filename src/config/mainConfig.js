/**
 * Created by Ilkka on 8.4.2016.
 */
"use strict";
module.exports = {
  server:{
    useHttps: false,
    CORS: 'http://localhost:1337'
  },
  
  db:{
    connectionString: 'mongodb://localhost/snw-forum',
    enabled: true
  }
};