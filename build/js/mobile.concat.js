
var initedCanvas = false;
var canvas;
var ctx;
var canvasWidth = 1000;
var canvasHeightScale = 1.0 / 9.0 * 16.0;
var canvasHeight = canvasWidth * canvasHeightScale;
var waitingLandscape = false;

var istouch = false;
var page = 0;

// image
var descImage = new Image();
var lookPcImage = new Image();
var runningImage = new Image();
var onTouchImage = new Image();

// http://jsdo.it/haii/3kRx
// 親要素のサイズに合わせて対象要素をリサイズする関数
function fit(element, parent, aspectRatio) {
    var pw = parent.clientWidth, ph = parent.clientHeight,
        l = 0, t = 0, w = pw, h = ph,
        s = element.style;

    // 位置とサイズを計算
    if (isFinite(aspectRatio)) {
        if (aspectRatio < pw / ph) {
            w = ph * aspectRatio | 0;
            l = pw - w >> 1;
        } else {
            h = pw / aspectRatio | 0;
            t = ph - h >> 1;
        }
    }

    // 要素のスタイルを変更
    s.left = l + 'px';
    s.top = t + 'px';
    s.width = w + 'px';
    s.height = h + 'px';
}

var fillTextLine = function(text, x, y) {
  var textList = text.split('\n');
  var lineHeight = ctx.measureText("あ").width;
  textList.forEach(function(text, i) {
    ctx.fillText(text, x, y+(lineHeight * 1.5)*i);
  });
};

// ロード時
function initCanvas() {
	$(window).on("orientationchange", resizeCanvas);
	$(window).on("resize", resizeCanvas);

	// Canvas 要素を作成して body に追加
	canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.addEventListener("touchstart", canvasTouchStart, false);
	canvas.addEventListener("touchend", canvasTouchEnd, false);
	document.body.appendChild(canvas);

	// Canvas 要素のリサイズ
	fit(canvas, canvas.parentNode, canvas.width / canvas.height);

	ctx = canvas.getContext('2d');

	// image
	descImage.src = 'images/mobile-hands.png';
	lookPcImage.src = 'images/lookPcImage.png';
	runningImage.src = 'images/runningImage.png';
	onTouchImage.src = 'images/onTouchImage.png';
	
	
	// メインループ
	setInterval(loopCanvas, 1000 / 30);
	loopCanvas();
};

function canvasTouchStart() {
	istouch = true;
	page++;
	socket.emit("report_motion", {
		id: id,
		roomid: roomid,
		e: "canvas.touchstart"
	});
}

function canvasTouchEnd() {
	istouch = false;
	socket.emit("report_motion", {
		id: id,
		roomid: roomid,
		e: "canvas.touchend"
	});
}

var loopcount = 0;

function loopCanvas() {
	if (updateCanvas())
		drawCanvas();
	loopcount++;
}

function updateCanvas() {
	reportMotionLast();
	return true;
}

function drawCanvas() {
	// Canvas のコンテキストへ描画
	
	// 初期化
	ctx.moveTo(0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// normal draw 
	var drawn = false;

	if (page == 0) {
		drawn = true;
		ctx.drawImage(descImage, 0, 0, canvasWidth, canvasHeight);
		if (loopcount >= 90)
			page++;
	}
	else if (page == 1) {
		drawn = true;
		ctx.drawImage(lookPcImage, 0, 0, canvasWidth, canvasHeight);
		if (loopcount >= 180)
			page++;
	}
	else {
		if (istouch) {
			drawn = true;
			ctx.drawImage(onTouchImage, 0, 0, canvasWidth, canvasHeight);
		} else {
			drawn = true;
			ctx.drawImage(runningImage, 0, 0, canvasWidth, canvasHeight);
		}
	}
}

function landscaped() {
	waitingLandscape = false;
	
}

// ウィンドウリサイズ時
function resizeCanvas() {
	// Canvas 要素のリサイズ
	fit(canvas, canvas.parentNode, canvas.width / canvas.height);
};

///////////

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
