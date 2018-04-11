'use strict';

const BaseRouter = require('../libs/BaseRouter.js');
const API_CONFIG = require('../config/api.js');
const service = require('../service/auth.js');

const apis = [];

apis.push({type: 'post',path: API_CONFIG.AUTH_TOKEN,handler:service.token});

apis.push({type: 'post',path: API_CONFIG.AUTH_CREATE_USER,handler:service.createUser});


class Router extends BaseRouter {

	constructor(app){
		super(app);
		this.apis = apis;
	}

}

module.exports = Router;