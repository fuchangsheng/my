'use strict';

const BaseService = require('../libs/BaseService.js');
const CONSTANTS = require('../constants/constants.js');
const ERRORS = require('../constants/errors.js');
const CONFIG = require('../config/conf.js');
const redis = require('../libs/redis.js');
const mongodb = require('../libs/mongo.js');
const utils = require('../libs/utils.js')
const moment = require('moment');

const Users = require('../models/user.js');
const Articles = require('../models/article.js');
const Categories = require('../models/category.js');
const Tags = require('../models/tag.js');
const Comments = require('../models/comment.js');

const service = new BaseService();


service.test = function(req, res){
    service.success(res, req.body);
}


//save or publish article
service.save = function(req, res){
    let err = ERRORS.NORMAL_RETURN;
    const user_id = req.headers.user_id || '';
    const nickname = req.headers.nickname || '';

    const title = req.body.title || '';
    const write_type = req.body.write_type || CONSTANTS.ARTICLE_WRITE_TYPE.SELF.VALUE;
    const ref = req.body.ref || '';
    const publish_type = req.body.publish_type || CONSTANTS.PUBLISH_TYPE.NORMAL.VALUE;
    const tags = req.body.tags || [];
    const content = req.body.content || '';
    const category = req.body.category || '';
    const publish = req.body.publish || 0;

    if((!title) || (!content) || !(utils.validateIdStr(category))){
        return service.error(res, ERRORS.PARAM_INVALID);
    }
    const realtags = [];
    tags.map((tag)=>{
        if(utils.validateIdStr(tag)){
            realtags.push(utils.str2ObjectId(tag));
        }
    });

    let article = new Articles.schema({
        title       : title,
        write_type  : write_type,
        publish_type: publish_type,
        ref         : ref,
        tags        : realtags,
        author      : utils.str2ObjectId(user_id),
        content     : content,
        read        : 0,
        delete      : CONSTANTS.ARTICLE_DEL.NORMAL.VALUE,
        status      : publish ? 0 :1

    });

    if(utils.validateIdStr(category)){
        article.category = utils.str2ObjectId(category);
    }

    article.saveAsync().then((savedArticle)=>{
        console.log(savedArticle);
            return service.success(res, {_id:savedArticle._id.toString()});
    }).catch((err)=>{
        console.error(err);
        return service.error(res, ERRORS.DATA_PROCESS_FAIL);
    });
}

service.publish = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id ||'';

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    Articles.schema.findOne({_id:utils.str2ObjectId(id)}).execAsync()
    .then((article)=>{
        if(!article){throw ERRORS.DOCUMENT_NOT_EXIST;}
        article.status = 1;
        return article.saveAsync();
    })
    .catch((err)=>{
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);  
    });
}

service.detail = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id;

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    findDocument(Articles, {_id:utils.str2ObjectId(id)}).then((article)=>{
        article.read = article.read + 1;
        return article.saveAsync();
    })
    .then((savedArticle)=>{

    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);          
    });

}

service.comment_data = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id;

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    const result = {likes:[],comments:[]};

    Comments.schema.find({article_id:utils.str2ObjectId(id)})
    .populate('user_id').populate('parent_id').execAsync().then((comments)=>{
        comments.map((comment)=>{
            if(comment.type == 0){
                result.likes.push(comment);
            }else{
                result.comments.push(comment);
            }
        });
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err); 
    });

}


service.articles = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const write_type = req.body.write_type;
    const publish_type = req.body.publish_type || 0;
    const tags = req.body.tags || [];
    const category = req.body.category;
    const deleted = req.body.deleted || 0;
    const status = req.body.status || 1;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;



}

service.trashArticle = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id;

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    findDocument(Articles, {_id:utils.str2ObjectId(id)}).then((article)=>{
        article.delete = CONSTANTS.ARTICLE_DEL.TRASH.VALUE;
        return article.saveAsync();
    })
    .then((savedArticle)=>{
        if(!savedArticle){
            throw ERRORS.MONGODB_SAVE_FAIL;
        }
        return service.success(res, {});
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);  
    });

};

service.recoverArticle = function(req, res){
    
    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id;

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    findDocument(Articles, {_id:utils.str2ObjectId(id)}).then((article)=>{
        article.delete = CONSTANTS.ARTICLE_DEL.NORMAL.VALUE;
        return article.saveAsync();
    })
    .then((savedArticle)=>{
        if(!savedArticle){
            throw ERRORS.MONGODB_SAVE_FAIL;
        }
        return service.success(res, {});
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);  
    });

}

service.deleteArticle = function(req, res){
    
    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const id = req.body.id;

    if(!utils.validateIdStr(id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    findDocument(Articles, {_id:utils.str2ObjectId(id)}).then((article)=>{
        article.delete = CONSTANTS.ARTICLE_DEL.DELETE.VALUE;
        return article.saveAsync();
    })
    .then((savedArticle)=>{
        if(!savedArticle){
            throw ERRORS.MONGODB_SAVE_FAIL;
        }
        return service.success(res, {});
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);  
    });
}




//add category
service.addCategory = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const name = req.body.name || '';
    if(!name){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    Categories.schema.findOne({name:name,user_id:utils.str2ObjectId(user_id)}).execAsync()
    .then((category)=>{
        if(category){throw ERRORS.DATA_DUPLICATED;}
        return;
    })
    .then(()=>{
        let category = new Categories.schema({
            user_id : utils.str2ObjectId(user_id),
            name    : name
        });
        return category.saveAsync();
    })
    .then((category)=>{
        console.log(category);
        if(category){return service.success(res, {_id: category._id.toString()});}
        throw ERRORS.MONGODB_SAVE_FAIL
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);
    });

}

//get catgory list
service.listCategory = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    Categories.schema.find({user_id: utils.str2ObjectId(user_id)}).select('name').execAsync()
    .then((categories)=>{
        let cs = categories.map((category)=>{
            return {id:category._id.toString(),name:category.name};
        });
        return service.success(res, {categories:cs});
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);       
    });
}


//delete category
service.delCategory = function(req, res){
    
    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const ids = utils.strs2ObjectIds(req.body.ids || []);
    const match = {user_id: utils.str2ObjectId(user_id),_id:{$in:ids}};

    Categories.schema.deleteMany(match).execAsync().then(()=>{
        return service.success(res, {});
    })
    .catch((err)=>{
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);           
    });
}


//add Tag
service.addTag = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const name = req.body.name || '';
    if(!name){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    Tags.schema.findOne({name:name,user_id:utils.str2ObjectId(user_id)}).execAsync()
    .then((tag)=>{
        if(tag){throw ERRORS.DATA_DUPLICATED;}
        return;
    })
    .then(()=>{
        let tag = new Tags.schema({
            user_id : utils.str2ObjectId(user_id),
            name    : name
        });
        return tag.saveAsync();
    })
    .then((tag)=>{
        console.log(tag);
        if(tag){return service.success(res, {_id: tag._id.toString()});}
        throw ERRORS.MONGODB_SAVE_FAIL
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);
    });

}


//get tag list
service.listTag = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    Tags.schema.find({user_id: utils.str2ObjectId(user_id)}).select('name').execAsync()
    .then((tags)=>{
        let ts = tags.map((tag)=>{
            return {id:tag._id.toString(),name:tag.name};
        });
        return service.success(res, {tags:ts});
    })
    .catch((err)=>{
        console.error(err);
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);       
    });
}


//delete tags
service.delTag = function(req, res){
    
    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const ids = utils.strs2ObjectIds(req.body.ids || []);
    const match = {user_id: utils.str2ObjectId(user_id),_id:{$in:ids}};

    Tags.schema.deleteMany(match).execAsync().then(()=>{
        return service.success(res, {});
    })
    .catch((err)=>{
        if(!(err.CODE || err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);           
    });
}


//like-dislike
service.like = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const article_id = req.body.article_id || '';
    if(!utils.validateIdStr(article_id)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    const match = {user_id:utils.str2ObjectId(user_id),type:0,article_id:utils.str2ObjectId(article_id)};

    Articles.schema.findOne({_id:utils.str2ObjectId(article_id)}).execAsync()
    .then((article)=>{
        if(!article){
            throw ERRORS.DOCUMENT_NOT_EXIST;
        }

        return Comments.schema.findOne(match).execAsync();
    })
    .then((comment)=>{
        if(comment){
            return Comments.schema.deleteOne(match).execAsync();
        }else{
            return new Comments.schema({
                user_id: utils.str2ObjectId(user_id),
                article_id:utils.str2ObjectId(article_id),
                type:0
            }).saveAsync();
        }
    })
    .then((data)=>{
        return service.success(res, {});
    })
    .catch((err)=>{
        console.error(err);
        if((!err.CODE) || (!err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);
    });
}

//comment
service.comment = function(req, res){

    const user_id = req.headers.user_id;
    const nickname = req.headers.nickname;

    const article_id = req.body.article_id || '';
    const parent_id  = req.body.parent_id || '';
    const content = req.body.content || '';

    if((!utils.validateIdStr(article_id)) || (!utils.content)){
        return service.error(res, ERRORS.PARAM_INVALID);
    }

    findDocument(Articles, {_id:utils.str2ObjectId(article_id)})
    .then((article)=>{
        if(!utils.validateIdStr(parent_id)){return;}
        return findDocument(Comments, {_id:utils.str2ObjectId(parent_id)});
    })
    .then((comment)=>{
        return new Comments.schema({
            user_id: utils.str2ObjectId(user_id),
            article_id:utils.str2ObjectId(article_id),
            parent_id:util.validateIdStr(parent_id)?utils.str2ObjectId(parent_id):null,
            type:1,
            content:content
        }).saveAsync();
    })
    .then((comment)=>{
        return service.success(res, {});
    })
    .catch((err)=>{
        console.error(err);
        if((!err.CODE) || (!err.MSG)){
            err = ERRORS.DATA_PROCESS_FAIL;
        }
        return service.error(res, err);
    })

}


const findDocument = function(model, match){
    return Promise.resolve().then(()=>{
        return model.schema.findOne(match).execAsync();
    })
    .then((doc)=>{
        if(!doc){
            throw ERRORS.DOCUMENT_NOT_EXIST;
        }
        return doc;
    });
};



module.exports = service;