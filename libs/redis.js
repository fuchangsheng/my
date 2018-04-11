'use strict';

const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('redis'));
const CONFIG = require('../config/conf.js');

const client = redis.createClient(CONFIG.REDIS.PORT,CONFIG.REDIS.HOST);

client.on('ready',()=>{console.log(`redis connected`)});
client.on('error',()=>{console.log(`redis connect failed`)});

module.exports = client;