'use strict';

const COLLECTION_NAME = 'article';

const BaseModel = require('../libs/BaseModel.js');
const moment = require('moment');
const model = new BaseModel();

const _Schema = new model.Schema({
    title        : String,
    write_type   : Number,   //0-yuanchuang 1-zhuanzai
    publish_type : Number,   //0-normal 1-development_docs 2-notification
    tags         : Object,   // Array of tags
    author       : {type: model.mongoose.Types.ObjectId, ref:'user'},
    content      : String,
    read         : Number,
    likes        : Object,
    comments     : Object,
    create_time  : String,
    update_time  : String
});


_Schema.pre('save', function(next){
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  if(!this.create_time){
    this.create_time = now;
    this.read = 0;
  }
  if(!this.update_time){
    this.update_time = now;
  }
  next();
});

model.schema = model.mongoose.model(COLLECTION_NAME, _Schema);

module.exports = model;