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


function reportMotion() {
	if (authoricated) {
		last_orientation_event = event;
		reportMotionBase(event, "window.ondeviceorientation");
	}
	

}

var lastEvent;

function reportMotionLast() {
	if (lastEvent != undefined)
		reportMotionBase(lastEvent, 'reportMotionLast');
}

function reportMotionBase(event, eventName) {
	if (authoricated) {
		lastEvent = event;
		var d = {
			id: id,
			roomid: roomid,
			//x: event.alpha - base_x,
			y: event.beta,
			//z: event.gamma,
			//ch: event.webkitCompassHeading,
			//ca: event.webkitCompassAccuracy,
			e: eventName
		};
		if (eventName == 'reportMotionLast')
			d['touch'] = istouch;
		socket.emit("report_motion", d);
	}

	if (waitingLandscape) {
		if (event.gamma > 45 && event.gamma < 45 + 90)
			landscaped();
	}
}