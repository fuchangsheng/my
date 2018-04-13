'use strict';

const BaseRouter = require('../libs/BaseRouter.js');
const API_CONFIG = require('../config/api.js');
const service = require('../service/articles.js');

const apis = [];

apis.push({type:'post',path:API_CONFIG.ARTICLES_TEST,handler:service.test});

apis.push({type:'post',path:API_CONFIG.ARTICLES_POST,handler:service.save});

apis.push({type:'post',path:API_CONFIG.ARTICLES_CATEGORY_ADD,handler:service.addCategory});

apis.push({type:'post',path:API_CONFIG.ARTICLES_TAG_ADD,handler:service.addTag});


class Router extends BaseRouter {

	constructor(app){
		super(app);
		this.apis = apis;
	}

}

module.exports = Router;