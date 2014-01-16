var id = String(Math.floor(Math.random() * 1000000));
var roomid;
var socket;
var ready = false;
var authoricated = false;

var base_x = 0;
var last_orientation_event;

$(function() {
	var args = getArgs();
	
	initSocket();
	
	// UI 
	
	window.scrollTo(0,0);
	
	preventTouchEvents();
	
	$('.navbar-collapse').mousedown('li', function() {
		$('.navbar-collapse').collapse('hide');
	}); 
	
	 if (args['invalid_pin'] == 1) {
		// 前回の Pin は間違っていた
		$('#pinBoxAdvice').show();
		$('#pinBoxAdvice').text('Pin が違うよ');

	}
	  
	$('#pinBoxOk').mousedown(clickedPinButton);
	$('#pinBox').modal('show');
	$('#pinBoxValue').text('');
	$('#pinBoxValue').focus();
	
	$('#topbar-reset-position').mousedown(function () { base_x = last_orientation_event.alpha; });
	ready = true;
});


function getArgs()
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
		addMessage("received: added_room_mobile, roomid=" + roomid, 'server');
		$('#pinBox').hide();
		
		authoricated = true;
		// UNDONE
	});
	
	socket.on('failed_add_room_mobile' + id, function (data) {
		// bug: この場所で表示をしようとすると背景色が加算されてしまう
		// 回避策: ブラウザの更新
		location.href = '/mobile.html?invalid_pin=1';
	});
}

function clickedPinButton() {
	if (ready) {
		socket.emit('add_room_mobile', { id: id, roomid: $("#pinBoxValue").val().replace(' ', '') } );
	}
}

function preventTouchEvents() {
	// スクロールを抑止する関数
	function preventScroll(event) {

	  // li要素だけは、タップイベントに反応したいので、抑止しない。
	  if (event.touches[0].target.tagName.toLowerCase() == "li") {return;}

	  // preventDefaultでブラウザ標準動作を抑止する。
	  event.preventDefault();
	}

	// タッチイベントの初期化
	//document.addEventListener("touchstart", preventScroll, false);
	document.addEventListener("touchmove", preventScroll, false);
	//document.addEventListener("touchend", preventScroll, false); 
	// ジェスチャーイベントの初期化
	document.addEventListener("gesturestart", preventScroll, false);
	document.addEventListener("gesturechange", preventScroll, false);
	document.addEventListener("gestureend", preventScroll, false);
	
	window.ondeviceorientation = function(event) {
		if (authoricated) {
			last_orientation_event = event;
			socket.emit("report_motion", {
				id: id,
				roomid: roomid,
				x: event.alpha - base_x,
				y: event.beta,
				z: event.gamma,
				ch: event.webkitCompassHeading,
				ca: event.webkitCompassAccuracy,
				e: "window.ondeviceorientation"
			});
		}
	}
}
