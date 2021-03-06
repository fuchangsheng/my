'use strict';

const COLLECTION_NAME = 'category';

const BaseModel = require('../libs/BaseModel.js');
const moment = require('moment');
const model = new BaseModel();

const _Schema = new model.Schema({
    user_id        : {type: model.mongoose.Schema.Types.ObjectId, ref:'user'},
    name          : String,
    create_time    : String,
    update_time    : String
});


_Schema.pre('save', function(next){
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  if(!this.create_time){
    this.create_time = now;
  }
  if(!this.update_time){
    this.update_time = now;
  }
  next();
});

model.schema = model.mongoose.model(COLLECTION_NAME, _Schema);

module.exports = model;