var io = require('socket.io')(8080);

var mangUser = [];

io.on('connection', socket => {
	socket.on('login', data => {
		(mangUser.findIndex(user => user.username == data.username) < 0) ? mangUser.push(data) && socket.emit('login', {status: 'success'}) : socket.emit('login', {status: 'error'})
	});
})