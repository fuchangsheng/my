'use strict'

const SOCKET_PORT = 10086;
const CHAT_NAMESPACE = '/chat';
const SocketServer = require('socket.io')(SOCKET_PORT);

const serveSocket = function(nsp, socket){
    // console.log(`Socket ${socket.id} Connected.`);
    //broadcast to all user the id of new user
    // socket.broadcast.emit('SERVER_NOTIFICATION', `New User : ${socket.id}`);
    socket.emit('SERVER_NOTIFICATION',socket.id);

    socket.on('SET_USER_ID',(user_id)=>{
        console.log(`Bind socket ${socket.id} to user:${user_id}`);
        socket.user_id = user_id;
    });

    socket.on('MESSAGE', function(data){
    	console.log(`MESSAGE from ${socket.user_id}: ${data}`);
    });

    socket.on('MSG_TO_USER', function(data){
        let s = findSocket(nsp, data.to);
        if(s){
            console.log(s.id, ' ', s.user_id);
            console.log(data);
            nsp.to(s.id).emit('MSG_FROM_USER',{from:socket.user_id,msg:data.msg});
        }else{
            console.error(`Cannot find user: ${data.to}`);
        }
    });

    socket.on('disconnect', ()=>{
    	console.log(`Socket ${socket.id} Disconnected.`);
    });
};

const init = function(){
    const chatNSP = SocketServer.of(CHAT_NAMESPACE);
    chatNSP.on('connection', function(socket){serveSocket(chatNSP, socket);});
    console.log(`SOCKET SERVER Listening on port ${SOCKET_PORT}`);
};

//find socket in nap.connected which binded to user_id
const findSocket = function(nsp, user_id){
    for(let k in nsp.connected){
        let socket = nsp.connected[k];
        if(socket.user_id === user_id){
            return socket;
        }
    }
    return null;
}


exports.init = init;