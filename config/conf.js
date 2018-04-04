'use strict'

module.exports = {
	AUTH:{
		JWT_SECRET : Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
	},

	REDIS:{
		HOST: '127.0.0.1',
		PORT: 6379
	},

	MONGODB:{
		HOST: '127.0.0.1',
		PORT: 27017,
		DB:'fcs'
	}
};