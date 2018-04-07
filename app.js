'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// init chat service
const socket = require('./sockets/socket.js');
socket.init();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'));

//AUTH MODULE
new (require('./routes/auth.js'))(app, 'auth').init();

//404 Not Found
app.use('/', function(req, res){res.send({code:-1,msg:'404 Not Found',data:{}})});

app.listen(80, function(){
	console.log('HTTP SERVER Listening on port 80');
});