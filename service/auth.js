'use strict';

const BaseService = require('../libs/BaseService.js');
const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');
const CONFIG = require('../config/conf.js');
const jwt = require('jwt-simple');
const redis = require('../libs/redis.js');
const mongodb = require('../libs/mongo.js');
const jwtsecret = CONFIG.AUTH.JWT_SECRET;
const utils = require('../libs/utils.js')

const User = require('../models/user.js');

const service = new BaseService();

service.token = function(req, res){

};


//用户注册
service.createUser = function(req, res){

    let err = ERRORS.NORMAL_RETURN;

    const nickname = req.body.nickname || '付昌盛';
    const password = req.body.password || '52902**Fcs';
    const mobile   = req.body.mobile || '15527941667';
    const avtar    = req.body.avtar || 'default';
    
    if((!nickname) || (!password) ||(!utils.isMobile(mobile)) || (!avtar)){
    	err = ERRORS.PARAM_INVALID;
    	return service.error(res, err);
    } 

    User.schema.findOne({$or:[{nickname:nickname},{mobile:mobile}]}).execAsync()
    .then((u)=>{
    	if(u){
    		throw err = ERRORS.DATA_DUPLICATED;
    	}
	    const user = new User.schema({
	   		nickname : nickname,
	   		password : password,
	   		mobile   : mobile,
	   		avtar    : avtar
    	});
	    return user.saveAsync();
    })
    .then((user)=>{
    	if(user){
    		return service.success(res, {id:user._id.toString()});
    	}else{
    		throw ERRORS.MONGODB_SAVE_FAIL;
    	}
    })
    .catch((e)=>{
    	console.error(e);
    	return service.error(res, e);
    });

}

module.exports = service;