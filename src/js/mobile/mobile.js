
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

$(function() {
	var args = hashArgs();
	
	initSocket();
	
	//initCanvas();
	
	// UI 
	
	window.scrollTo(0,1);
	preventTouchEvents();
	
	 if (args['invalid_pin'] == 1) {
		// 前回の Pin は間違っていた
		$('#pinBoxAdvice').show();
		$('#pinBoxAdvice').text('Pin が違うよ');
	}
	
	initPinBox();
	  
	ready = true;
});
