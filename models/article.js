'use strict';

const COLLECTION_NAME = 'article';

const BaseModel = require('../libs/BaseModel.js');
const moment = require('moment');
const model = new BaseModel();

const _Schema = new model.Schema({
    title        : String,
    write_type   : Number,   //0-yuanchuang 1-zhuanzai
    publish_type : Number,   //0-normal 1-development_docs 2-notification
    ref          : String,
    tags         : [{type: model.mongoose.Schema.Types.ObjectId, ref:'tag'}],   // Array of tags
    author       : {type: model.mongoose.Schema.Types.ObjectId, ref:'user'},
    content      : String,
    category     : {type: model.mongoose.Schema.Types.ObjectId, ref:'category'},// wenzhangfenlei
    read         : Number,
    delete       : Number,
    status       : Number, //0-caogao 1-publish
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