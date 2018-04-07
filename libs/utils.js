'use strict'

let utils = {};

utils.isMobile = function(mobile){
	const r = /1[356789][0-9]{9}/g;
	return r.test(mobile);
}

module.exports = utils;