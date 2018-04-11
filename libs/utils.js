'use strict'
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));


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


module.exports = utils;