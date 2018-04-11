'use strict'

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));

class BaseModel {

	constructor(){
		this.ObjectId = mongoose.Types.ObjectId,
		this.Schema = mongoose.Schema,
		this.mongoose = mongoose
	}
}

module.exports = BaseModel;