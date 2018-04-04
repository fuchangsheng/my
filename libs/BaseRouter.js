'use strict';

const express = require('express');
const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');

const defaultHandler = function(req, res){
    res.end({code :CONSTANTS.SERVER_NO_HANDLER.CODE,msg:CONSTANTS.SERVER_NO_HANDLER.MSG});
};

class BaseRouter {

    constructor(app, modulename){
    	this.app = app;
    	this.router = express.Router();
    	this.modulename = modulename;
    	this.apis = [];
    }

 	init(){
 		let self = this;
 		self.apis.map(function(api, index){
 			let type = api.type || 'GET';
 			let path = api.path || '';
 			let handler = api.handler || defaultHandler;

 			if(type.toLowerCase() === 'get'){
 				self.router.get(path, handler);
 			}else{
 				self.router.post(path, handler);
 			} 
 		});
 		self.app.use(`/${self.modulename}`, self.router);
 	}

}

module.exports = BaseRouter;