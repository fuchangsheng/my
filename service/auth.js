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
const moment = require('moment');

const User = require('../models/user.js');

const service = new BaseService();


//get token by nickname && password
service.token = function(req, res){

    let err = ERRORS.NORMAL_RETURN;

    const nickname = req.body.nickname;
    const password = req.body.password;

    if((!nickname) || (!password)){
        err = ERRORS.PARAM_INVALID;
        return service.error(res, err);
    } 

    User.schema.findOne({nickname:nickname,password:password}).execAsync()
    .then((u)=>{
        if(!u){
            throw ERRORS.NAME_PWD_NOT_MATCH;
        }
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const payload = {
            nickname : u.nickname,
            user_id  : u._id.toString(),
            createAT : now
        }

        const token = jwt.encode(payload, jwtsecret);
        redis.setAsync(`${CONFIG.AUTH.JWT_REDIS_PREFIX}${payload.user_id}`, token, 'EX',CONFIG.AUTH.JWT_EXPIRE_SECONDS);
        return service.success(res, {token:token});
    })
    .catch((err)=>{
        console.error(err);
        err = (err.CODE && err.MSG) ? err : ERRORS.DATA_PROCESS_FAIL;
        return service.error(res, err);
    });
};


//用户注册
service.createUser = function(req, res){

    let err = ERRORS.NORMAL_RETURN;

    const nickname = req.body.nickname;
    const password = req.body.password;
    const mobile   = req.body.mobile;
    const avtar    = req.body.avtar;
    const birth = req.body.birth;
    const province = req.body.province;
    const city = req.body.city;
    const profession = req.body.profession;
    
    if((!nickname) || (!password)){
    	err = ERRORS.PARAM_INVALID;
    	return service.error(res, err);
    } 

    User.schema.findOne({$or:[{nickname:nickname},{mobile:mobile}]}).execAsync()
    .then((u)=>{
    	if(u){
    		throw ERRORS.DATA_DUPLICATED;
    	}
	    const user = new User.schema({
	   		nickname : nickname,
	   		password : password,
	   		mobile   : mobile,
	   		avatar    : avatar,
            birth    : birth,
            province : province,
            city     : city,
            profession:profession,
            type     : CONSTANTS.USER_TYPE.DEFAULT_USER.VALUE
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
    .catch((err)=>{
        console.error(err);
        err = (err.CODE && err.MSG) ? err : ERRORS.DATA_PROCESS_FAIL;
        return service.error(res, err);
    });

}

module.exports = service;