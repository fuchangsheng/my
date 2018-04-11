'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwtHandler = require('./libs/jwtHandler.js');
const uploader = require('./libs/uploader.js');

const app = express();

// init chat service
const socket = require('./sockets/socket.js');
socket.init();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/uploads',	express.static('uploads'));

//debug request info
app.use(function(req, res, next){
	console.log(`${req.method} : ${req.path}`);
	console.log(`headers:${JSON.stringify(req.headers)}`);
	const params = {query:req.query,body:req.body};
	console.log(`params:${JSON.stringify(params)}`);
	next();
});

//check jwt && skip urls
app.use(jwtHandler.check);

//start file service
app.use(uploader);

//AUTH MODULE
new (require('./routes/auth.js'))(app).init();

//404 Not Found
app.use('/', function(req, res){res.send({code:-1,msg:'404 Not Found',data:{}})});

app.listen(80, function(){
	console.log('HTTP SERVER Listening on port 80');
});