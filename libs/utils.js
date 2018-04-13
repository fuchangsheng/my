'use strict'
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const mongoose = require('mongoose');

let utils = {};

utils.isMobile = function(mobile){
	const r = /1[3456789][0-9]{9}/g;
	return r.test(mobile);
}

utils.inArray = function(element, array){
	for(let value of array){
		if(element === value){
			return true;
		}
		continue;
	}
	return false;
}

utils.isExists = function(path){
	return fs.existsSync(path);
}


utils.validateIdStr = function(id){
	return (typeof id ==='string') && /[0-9a-fA-F]{24}/g.test(id);
}

utils.str2ObjectId = function(id){
	return mongoose.Types.ObjectId(id.toString());
}

utils.strs2ObjectIds = function(ids){
	return ids.map((id)=>{return utils.str2ObjectId(id);});
}

module.exports = utils;