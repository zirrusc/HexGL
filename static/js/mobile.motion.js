// 端末固有の番号
var id = String(Math.floor(Math.random() * 1000000));
// ルーム番号
var roomid;
var socket;
var ready = false;
var authoricated = false;
var supportsTouchend = false;

// X軸のリセット
var base_x = 0;
var last_orientation_event;

var started = false;

function hashArgs()
{
  var vars = new Object, params;
  var temp_params = window.location.search.substring(1).split('&');
  for(var i = 0; i <temp_params.length; i++) {
    params = temp_params[i].split('=');
    vars[params[0]] = params[1];
  }
  return vars;
}

function initSocket() {
	socket = io.connect();
	
	socket.on('added_room_mobile' + id, function (data) {
		console.log('received', data);
		roomid = data['roomid'];
		$('#pinBox').hide();
		
		authoricated = true;
		
		// UNDONE
		
		
		$(".modal-backdrop").remove();
		
		if (initedCanvas == false) {
			initCanvas();
			initedCanvas = true;
		}
		
	});
	
	socket.on('failed_add_room_mobile' + id, function (data) {
		// bug: この場所で表示をしようとすると背景色が加算されてしまう
		// 回避策: ブラウザの更新
		location.href = '/mobile.html?invalid_pin=1';
	});
	
	socket.on('start', function (data) {
		console.log('STARTED');
		started = true;
	});
	
	socket.on('ping', function (data) {
		socket.emit('ping_return', { id: id, roomid: data['roomid'], time: data['time'] });
	});
}


function initPinBox() {
	$('#pinBoxOk').bind("touchend", sendAddRequest);
	$('#pinBoxOk').bind("click",    sendAddRequestOnClick);
	$('#pinBox').modal('show');
	$('#pinBoxValue').text('');
	$('#pinBoxValue').focus();
	window.ondeviceorientation = reportMotion;
}

function sendAddRequest() {
	supportsTouchend = true;
	var val = $("#pinBoxValue").val().replace(' ', '');
	if (ready) {
		socket.emit('add_room_mobile', { id: id, roomid: val } );
	}
}

function sendAddRequestOnClick() {
	if (supportsTouchend == false)
		sendAddRequest();
}

function preventTouchEvents() {
	function preventScroll(event) {
		event.preventDefault();
	}
	$(document).bind("touchmove", preventScroll);
	$(document).bind("gesturestart", preventScroll);
	$(document).bind("gesturechange", preventScroll);
	$(document).bind("gestureend", preventScroll);
}

function reportMotion() {
	if (authoricated) {
		last_orientation_event = event;
		/*
		socket.emit("report_motion", {
			id: id,
			roomid: roomid,
			x: event.alpha - base_x,
			y: event.beta,
			z: event.gamma,
			ch: event.webkitCompassHeading,
			ca: event.webkitCompassAccuracy,
			e: "window.ondeviceorientation"
		});*/
		reportMotionBase(event.alpha - base_x,
						 event.beta,
						 event.gamma,
						 event.webkitCompassHeading,
						 event.webkitCompassAccuracy,
						 "window.ondeviceorientation");
	}
	

}

var mx, my, mz, mch, mca, me;

function reportMotionLast() {
	reportMotionBase(mx, my, mz, mch, mca, me);
}

function reportMotionBase(x, y, z, ch, ca, e) {
	if (authoricated) {
		mx = x;
		my = y;
		mz = z;
		mch = ch;
		mca = ca;
		me = e;
		socket.emit("report_motion", {
			id: id,
			roomid: roomid,
			x: x,
			y: y,
			z: z,
			ch: ch,
			ca: ca,
			e: e
		});
	}

	if (waitingLandscape) {
		if (event.gamma > 45 && event.gamma < 45 + 90)
			landscaped();
	}
}