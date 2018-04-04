'use strict';

const BaseService = require('../libs/BaseService.js');
const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');
const CONFIG = require('../config/conf.js');
const jwt = require('jwt-simple');
const redis = require('../libs/redis.js');
const mongodb = require('../libs/mongo.js');
const jwtsecret = CONFIG.AUTH.JWT_SECRET;

const service = new BaseService();

service.token = function(req, res){

};


module.exports = service;