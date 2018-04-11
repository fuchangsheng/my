'use strict';

const redis = require('./redis.js');
const CONFIG = require('../config/conf.js');
const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');
const utils = require('./utils.js');

const jwt = require('jwt-simple');

const check = function(req, res, next){

	//SKIP URLS
	if(utils.inArray(req.path, CONFIG.SKIP_JWT_URLS)){
		return next();
	}

	const token = req.headers[CONFIG.AUTH.JWT_HEADER_FIELD] || '';
	const result = {code:ERRORS.NORMAL_RETURN.CODE,msg:ERRORS.NORMAL_RETURN.MSG};

	console.log(`Checking JSON WEB TOKEN: ${token}`);
	//exist
	if(!token){
		result.code = ERRORS.NO_JWT_HEADER.CODE;
		result.msg = ERRORS.NO_JWT_HEADER.MSG;
		return res.send(result);
	}
	try{
		let payload = {};
		payload = jwt.decode(token, CONFIG.AUTH.JWT_SECRET);
		if(payload.user_id && payload.nickname){
			redis.getAsync(`${CONFIG.AUTH.JWT_REDIS_PREFIX}${payload.user_id}`).then((result)=>{
				if(result === token){
					req.headers.user_id = payload.user_id;
					req.headers.nickname = payload.nickname;
					next();
				}else{
					throw ERRORS.JWT_VALIDATE_FAIL;
				}
			})
			.catch((err)=>{
				result.code = ERRORS.JWT_VALIDATE_FAIL.CODE;
				result.msg = ERRORS.JWT_VALIDATE_FAIL.MSG;
				return res.send(result);
			});
		}else{
			throw ERRORS.JWT_VALIDATE_FAIL;
		}
	}catch(err){
		result.code = ERRORS.JWT_VALIDATE_FAIL.CODE;
		result.msg = ERRORS.JWT_VALIDATE_FAIL.MSG;
		return res.send(result);
	}

}

exports.check = check;