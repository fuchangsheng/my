'use strict'

const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');

const success = function(res, data){
	const result = {
		code: ERRORS.NORMAL_RETURN.CODE,
		msg : ERRORS.NORMAL_RETURN.MSG,
		data: data ? data :{}
	};
	res.send(result);
};

const error = function(res, err){
	const result = {
		code: err.code || err.CODE || ERRORS.DEFAULT_ERROR.CODE,
		msg : err.msg  || err.MSG  || ERRORS.DEFAULT_ERROR.MSG,
		data: {}
	};
	res.send(result);
};


class BaseService {

	constructor(){
		this.success = success;
		this.error = error;
	}
}

module.exports = BaseService;