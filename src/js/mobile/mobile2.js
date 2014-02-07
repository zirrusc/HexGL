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
	  
	$('#pinBoxOk').bind("touchend", clickedPinButton);
	$('#pinBoxOk').bind("click", clickedPinButton);
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
		$('#pinBox').hide();
		
		authoricated = true;
		
		// UNDONE
		
		
		$(".modal-backdrop").remove();
		
		initCanvas();
	});
	
	socket.on('failed_add_room_mobile' + id, function (data) {
		// bug: この場所で表示をしようとすると背景色が加算されてしまう
		// 回避策: ブラウザの更新
		location.href = '/mobile.html?invalid_pin=1';
	});
}

function resizeCanvas() {

	var handle = $('#handle');
	var b = document.body;
	var d = document.documentElement;
	handle.width(Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth));
	handle.height(Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight));

}

function initCanvas() {
	var handle = $('#handle');
	resizeCanvas();
	$(window).on("orientationchange", resizeCanvas);
	$(window).on("resize", resizeCanvas);

	/*
	$('#handle').scaleCanvas({
	
		scaleX: 1,
		scaleY: 0.25
	
		scaleX: 1,
		scaleY: $('#handle').height() / window.innerHeight
	});
	*/
	/*
	$('#handle').width = window.innerHeight;
	$('#handle').height = window.innerWidth;
	*/
	/*
	$('#handle').width = window.innerWidth;
	$('#handle').height = window.innerHeight;
	*/
	$('canvas').drawRect({
		fillStyle: '#000',
		x: 0, y: 0,
		width: 200000,
		height: 400000
	});
	
	$('#handle').drawText({
		fillStyle: '#9cf',
		strokeStyle: '#25a',
		strokeWidth: 2,
		x: 150, y: 100,
		fontSize: 48,
		fontFamily: 'Verdana, sans-serif',
		text: 'Hello'
	});

	// Draw a full circle
	$('canvas').drawArc({
	  strokeStyle: '#dd',
	  strokeWidth: 5,
	  x: 100, y: 100,
	  radius: 50
	});
}

function clickedPinButton() {
	var val = $("#pinBoxValue").val().replace(' ', '');
	if (ready) {
		socket.emit('add_room_mobile', { id: id, roomid: val } );
	}
}

function preventTouchEvents() {
	function preventScroll(event) {
		event.preventDefault();
	}

	$(document).bind("touchmove", preventScroll);
	$(document).bind("gesturestart", preventScroll);
	$(document).bind("gesturechange", preventScroll);
	$(document).bind("gestureend", preventScroll);
	
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
