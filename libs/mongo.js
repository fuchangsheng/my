'use strict'

const Promise = require('bluebird');
const CONFIG = require('../config/conf.js');
const MONGO_CONN_URI = `mongodb://${CONFIG.MONGODB.HOST}:${CONFIG.MONGODB.PORT}/${CONFIG.MONGODB.DB}`;
const mongoose = Promise.promisifyAll(require('mongoose'));

mongoose.connectAsync(MONGO_CONN_URI)
.then((db)=>{
  console.log(`Connect to ${MONGO_CONN_URI}`)
})
.catch((err)=>{
	console.error(err);
});

module.exports = mongoose;