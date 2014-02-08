var id = String(Math.floor(Math.random() * 1000000));
var roomid;
var mobile_enabled = true;
var mobile_clients = [];

/* 
 * Report Mobile Orientations
 */
var mobile = mobile || {};

mobile.Direction = 0.0;
mobile.Forward = 0.0;

mobile.MaxDirection = 0.02;
mobile.DirectionXFactor = 1.0 / 100000.0;
mobile.DirectionYFactor = 1.0 / 3000.0;

mobile.MaxForward = 0.2;
mobile.NormalForward = 0.05;
mobile.ForwardFactor = 1.0 / 2000.0;
mobile.ForwardNeutral = 60.0

mobile.ReportOrientation = function (data) {
	if (data['e'] == "window.ondeviceorientation") {

		// 受話・送話口の上下による方向変更
		var directionX = 0;
		// 水平方向の回転による方向変更
		var directionY = -data['y'] * this.DirectionYFactor;
		this.Direction = directionX + directionY;
		if (this.Direction < -this.MaxDirection)
			this.Direction = -this.MaxDirection;
		if (this.Direction >  this.MaxDirection)
			this.Direction =  this.MaxDirection;
		/*
		// 受話・送話口の直線を軸としたときの回転による加速度変更
		this.Forward = (data['z'] + this.ForwardNeutral) * this.ForwardFactor;
		if (this.Forward < 0.0)
			this.Forward = 0.0;
		if (this.Forward > this.MaxForward) // bkcore.hexgl.ShipControls.thrust
			this.Forward = this.MaxForward;
		*/
	} else if (data['e'] == 'canvas.touchstart') {
		this.Forward = this.NormalForward;
	} else if (data['e'] == 'canvas.touchend') {
		this.Forward = 0;
	} else if (data['e'] == 'reportMotionLast') {
		// 受話・送話口の上下による方向変更
		var directionX = 0;
		// 水平方向の回転による方向変更
		var directionY = -data['y'] * this.DirectionYFactor;
		this.Direction = directionX + directionY;
		if (this.Direction < -this.MaxDirection)
			this.Direction = -this.MaxDirection;
		if (this.Direction >  this.MaxDirection)
			this.Direction =  this.MaxDirection;
		
		if (data['touch'] == true)
			this.Forward = this.NormalForward;
		else if (data['touch'] == false)
			this.Forward = 0;
	} else {
		console.log("mobile.ReportOrientation got unknown arguments: data['e'] = ", data['e']);
	}
};

$(window).load(function () {
	setQuality(1);
});

var socket;

$(function() {
	/* socket.io */
	
	socket = io.connect();	 
	socket.on('added_room_pc', function (data) {
		roomid = data['roomid'];
		var first = ("000" + Math.floor(roomid / 1000)).slice(-3);
		var last  = ("000" + (roomid - first * 1000  )).slice(-3);
		$('#pinbox-value').text('PIN: ' + first + ' ' + last);
		$('#pinbox-status-sign').html("<div class='glyphicon glyphicon-certificate'></div>");
		$('#pinbox-status-text').text("モバイルの接続待ちです");

	});
	
	socket.on('added_room_mobile', function (data) {
		mobile_clients[mobile_clients.length] = data['id'];
		$('#pinbox-status-sign').html("<div class='glyphicon glyphicon-ok'></div>");
		$('#pinbox-status-text').text(mobile_clients.length + "台のモバイルと接続しました");
		
		// speed test
		var time = +new Date();
		console.log(time);
		socket.emit('ping', { id: id, roomid: roomid, time: time });
	});
	
	socket.on('report_motion', function (data) {
		if (mobile_enabled) {
			mobile.ReportOrientation(data);
		}
	});
	
	socket.on('ping_return', function (data) {
		console.log(data['time']);
		var sec = (((+new Date()) - data['time']) / 1000) / 2;
		var s = sec >= 0.1 ? "遅いかもしれません" : "快適に動作できます";
		$('#pinbox-status-time').text("PC-Mobile間の片道通信時間：" + sec + "秒、" + s);
	});
	
	socket.emit('add_room_pc', { id: id } );
	
	$('#pinbox-status-sign').html("<div class='glyphicon glyphicon-refresh'></div>");
	$('#pinbox-status-text').text("通信中");
	$('#mc-mobile-url').text(location.href
		.replace('pc.html', '')
		.replace('#content', ''));
	/* end of socket.io */
});


var start_game = function (arg) {
	console.log('START');
	socket.emit('start', { id: id, roomid: roomid, mode: arg });
	
	//var b = document.getElementById("beta");
	if (document.body.requestFullScreen)
		document.body.requestFullScreen();
	else if (document.body.webkitRequestFullScreen)
		document.body.webkitRequestFullScreen();
	else if (document.body.mozRequestFullScreen)
		document.body.mozRequestFullScreen();
	
	beta(arg);
};
