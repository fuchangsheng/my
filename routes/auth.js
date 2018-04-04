'use strict';

const BaseRouter = require('../libs/BaseRouter.js');

const service = require('../service/auth.js');

const apis = [];

apis.push({
	type: 'get',
	path: '/token',
	handler:service.token
});


class Router extends BaseRouter {

	constructor(app, modulename){
		super(app, modulename);
		this.apis = apis;
	}

}

module.exports = Router;