'use strict'

const API_CONFIG = require('./api.js');

module.exports = {
	AUTH:{
		JWT_SECRET : Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex'),
		JWT_EXPIRE_SECONDS: 30*24*3600,
		JWT_REDIS_PREFIX:'AUTH_JWT_',
		JWT_HEADER_FIELD:'x-json-web-token'
	},

	REDIS:{
		HOST: '127.0.0.1',
		PORT: 6379
	},

	MONGODB:{
		HOST: '127.0.0.1',
		PORT: 27017,
		DB:'fcs'
	},

	SKIP_JWT_URLS:[
		API_CONFIG.AUTH_TOKEN,
		API_CONFIG.AUTH_CREATE_USER,
		API_CONFIG.UPLOAD_MD_PIC_FILE,
	],

	DEFAULT_UPLOAD_PATH:'uploads/',
	MD_UPLOAD_PATH:'uploads/md/',
};