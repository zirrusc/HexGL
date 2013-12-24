var id = String(Math.floor(Math.random() * 1000000));
var roomid;
var mobile_enabled = true;
var mobile_clients = [];

$(function() {
	/* socket.io */
	
	var socket = io.connect();
	
	function addMessage(msg, pseudo) {
		$("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
	}
	
	function sentMessage() {
		if ($('#messageInput').val() != "") 
		{
			socket.emit('message', $('#messageInput').val());
			addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
			$('#messageInput').val('');
		}
	}
	
	function changeTopBarText() {
		var first = ("000" + Math.floor(roomid / 1000)).slice(-3);
		var last  = ("000" + (roomid - first * 1000  )).slice(-3);
		var t = mobile_enabled ? '' : 'モバイルからの操作: 無効';
		var c = mobile_clients.length == 0 ? '' : ' ' + mobile_clients.length + '台が接続中';
		$('#top-bar-pin').text('Pin: ' + first + ' ' + last + ' ' + c + ' ' + t);
		$('#top-bar-pin').append("<div class='caret'></div>");
		$('#top-bar-pin').css('font-weight', 'bold');
		
		$('#top-bar-toggle-mobile-enabled').text(mobile_enabled ?
			'モバイルからの操作を無効にする' : 'モバイルからの操作を行う');
	}
	
	socket.on('added_room_pc', function (data) {
		roomid = data['roomid'];
		//addMessage("received: added_room_pc, roomid=" + roomid, 'server');
		changeTopBarText();

	});
	
	socket.on('added_room_mobile', function (data) {
		mobile_clients[mobile_clients.length] = data['id'];
		changeTopBarText();
	});
	
	socket.on('report_motion', function (data) {
		// UNDONE
		if (mobile_enabled) {
			controlSampleCube.rotation.y = data['x'] * Math.PI / 180;
			controlSampleCube.rotation.x = data['y'] * Math.PI / 180;
			controlSampleCube.rotation.z = -data['z'] * Math.PI / 180;
		}
	});
	
	socket.on('message', function(data) {
		addMessage(data['message'], data['pseudo']);
	});
	
	socket.emit('add_room_pc', { id: id } );
	
	$("#chatControls").hide();
	$("#pseudoSet").click(function() {setPseudo()});
	$("#submit").click(function() {sentMessage();});
	$('#top-bar-toggle-mobile-enabled').click(function () { 
		mobile_enabled = !mobile_enabled; 
		changeTopBarText();
	});
	/* end of socket.io */
	
});
