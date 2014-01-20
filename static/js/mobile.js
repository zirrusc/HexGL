
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

