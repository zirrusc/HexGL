var port = process.argv[2] == undefined ? 80 : process.argv[2];
var rootdir = process.argv[3] == undefined ? 'src' : process.argv[3];

// express
var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
 
// all environments
app.set('port', process.env.PORT || port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, rootdir)));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.io
var io = require('socket.io').listen(server);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	console.log('sessionID ', socket.handshake.sessionID);
	
	// Register PC into room
	socket.on('add_room_pc', function (data) {
		var roomid = ("000000" + Math.floor(Math.random() * 1000000)).slice(-6);
		socket.join(roomid);
		
		var data = { roomid: roomid, id: data.id };
		console.log('added_room_pc ', data);
		io.sockets.to(roomid).emit('added_room_pc', data);
	});
	
	// Register mobile into room
	socket.on('add_room_mobile', function (data) {
		if (data['roomid'] == undefined || data['roomid'] == '') {
			// data['roomid'] is empty
			var send_group = 'failed_add_room_mobile' + data['id'];
			var send_data = { roomid: data['roomid'], id: data.id };
			console.log(send_group, 'data[\'roomid\'] must not be empty ', send_data);
			io.sockets.emit(send_group, send_data);
		} else {
		
			for (var room in io.sockets.manager.rooms) {
				if (room == '/' + data['roomid']) {
					// room が見つかったので登録する
					socket.join(data['roomid']);
					
					var send_group  = 'added_room_mobile' + data['id'];
					var send_group2 = 'added_room_mobile';
					var send_data = { roomid: data['roomid'], id: data['id'] };
					console.log(send_group, send_data);
					io.sockets.to(data['roomid']).emit(send_group,  send_data);
					io.sockets.to(data['roomid']).emit(send_group2, send_data);
					return;
				}
			}
			
			// not found :(
			var send_group = 'failed_add_room_mobile' + data['id'];
			var send_data = { roomid: data['roomid'], id: data.id };
			console.log(send_group, send_data);
			io.sockets.emit(send_group, send_data);
			
		}
	});
	
	var emit_room = function (name) {
		socket.on(name, function (data) {
			if (data['roomid'] != undefined) {
				io.sockets.to(data['roomid']).emit(name, data);
			} else {
				console.log(name + ': roomid required.');
			}
		});
	};
	
	emit_room('report_motion');
	emit_room('ping');
	emit_room('ping_return');
	emit_room('start');
});

