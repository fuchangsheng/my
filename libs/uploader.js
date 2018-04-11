'use strict';
const express = require('express');
const app = express.Router();
const multer = require('multer');
const CONFIG = require('../config/conf.js');
const API_CONFIG = require('../config/api.js');
const fs = require('fs');
const moment = require('moment');
const utils = require('./utils');
const ERRORS = require('../constants/errors.js');


const storage = multer.diskStorage({
	destination : function(req, file, fn){
		const path = `uploads/${req.headers.nickname}/`
		if(req.path === API_CONFIG.UPLOAD_MD_PIC_FILE){
			return fn(null, CONFIG.MD_UPLOAD_PATH);
		}
		if(!fs.existsSync(path)){
			fs.mkdir(path,(err)=>{
				if(err){
					fn(null,CONFIG.DEFAULT_UPLOAD_PATH);
					return console.error(err);
				}
				fs.chmod(path,0o777,(err)=>{
					if(err){
						fn(null,CONFIG.DEFAULT_UPLOAD_PATH);
						return console.error(err);
					}
					fn(null, path);
				});
			});
			return;
		}else{
			return fn(null, path);
		}
	},
	filename    : function(req, file, fn){
		const now = moment().format('YYYYMMDDHHmmss');
		fn(null, `${now}-${file.originalname}`);
	}
});

const fileFilter = function(req, file, fn){
	const fieldnames = ['single-file','editormd-image-file','files','pic','doc','video','music'];
	if(!utils.inArray(file.fieldname, fieldnames)){
		return fn(null, false);
	}
	return fn(null, true);
};

const uploader = multer({storage:storage,fileFilter:fileFilter});	

//single-file
app.post(API_CONFIG.UPLOAD_SINGLE_FILE,uploader.single('single-file'),function(req, res, next){
	const result = {
		code:ERRORS.NORMAL_RETURN.CODE,
		msg : ERRORS.NORMAL_RETURN.MSG,
		data:{}
	};
	if(req.file){
		result.data.url = `/${req.file.path}`;
	}else{
		result.code = ERRORS.UPLOAD_ERR.CODE;
		result.msg  = ERRORS.UPLOAD_ERR.MSG;
	}
	res.send(result);
});

//single-file-formd
app.post(API_CONFIG.UPLOAD_MD_PIC_FILE,uploader.single('editormd-image-file'),function(req, res, next){
	const result = {};
	if(req.file){
		result.success = 1;
		result.message = 'success';
		result.url = `/${req.file.path}`;
	}else{
		result.success = 0;
		result.message = 'failed';
	}
	res.send(result);
});

//array-file
app.post(API_CONFIG.UPLOAD_ARRAY_FILE,uploader.array('files',12),function(req, res, next){
	const result = {
		code:ERRORS.NORMAL_RETURN.CODE,
		msg : ERRORS.NORMAL_RETURN.MSG,
		data:{}
	};
	if(req.files){
		result.data.urls = [];
		for(let file of req.files){
			result.data.urls.push(`/${file.path}`);
		}
	}else{
		result.code = ERRORS.UPLOAD_ERR.CODE;
		result.msg  = ERRORS.UPLOAD_ERR.MSG;
	}
	res.send(result);
});

const fields = uploader.fields([
	{name:'pic',maxCount:12},
	{name:'doc',maxCount:12},
	{name:'video',maxCount:12},
	{name:'music',maxCount:12}
]);
//fields
app.post(API_CONFIG.UPLOAD_FIELDS_FILE,fields,function(req, res, next){
	const result = {
		code:ERRORS.NORMAL_RETURN.CODE,
		msg : ERRORS.NORMAL_RETURN.MSG,
		data:{}
	};
	if(req.files && Object.keys(req.files).length){
		result.data.urls = [];
		Object.keys(req.files).map((field)=>{
			for(let file of req.files[field]){
				result.data.urls.push(`/${file.path}`);
			}
		});
	}else{
		result.code = ERRORS.UPLOAD_ERR.CODE;
		result.msg  = ERRORS.UPLOAD_ERR.MSG;
	}
	res.send(result);
});


module.exports = app;