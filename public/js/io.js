'use striict';
const SOCKET_URL = 'http://localhost:10086';
const socketManager = new io.Manager(SOCKET_URL);
const socket = socketManager.socket('/chat');
const get = function(name){
	const search = window.location.search;
	if(search && search.length){
		let query = {};
		let ca = search.substr(1, search.length).split('&');
		ca.map(function(c,i){
			const q = c.split('=');
			if(q && q.length){
				query[q[0]] = q[1];
			}
		});
		return query[name];
	}
	return undefined;
}
const user_id = get('user_id');

socket.emit('SET_USER_ID',user_id);


socket.on('SERVER_NOTIFICATION', function(data, reply){
	$('#messages').append(`<li>${data}</li>`)
});

socket.on('MSG_FROM_USER', function(data){
	$('#messages').append(`<li>${data.from}: ${data.msg}</li>`);
});

$('form').submit(function(){
	let to = 'user01';
	if(user_id === 'user01'){
		to = 'user02';
	}
	let msg = $('#m').val();
	socket.emit('MSG_TO_USER', {msg:msg,to:to});
	$('#messages').append(`<li>${user_id}: ${msg}</li>`);
	$('#m').val('');
	return false;
});