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

var initedCanvas = false;
var canvas;
var canvasWidth = 1000;
var canvasHeightScale = 1.0 / 3.0 * 4.0;
var canvasHeight = canvasWidth * canvasHeightScale;
var waitingLandscape = false;

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
}

/*
function resizeCanvas() {

	var handle = $('#handle');
	var b = document.body;
	var d = document.documentElement;
	handle.width(Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth));
	handle.height(Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight));

}
*/

/*
function initCanvas() {
	var handle = $('#handle');
	resizeCanvas();
	$(window).on("orientationchange", resizeCanvas);
	$(window).on("resize", resizeCanvas);

}
*/

////////////

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

/**
 * @param ctx context
 * @param x position x
 * @param y position y
 * @param fsz font size
 * @param rad radian
 * @param chr display string
 * @ref http://blog.livedoor.jp/nanoris/archives/51702417.html
 */
function fSpinText (ctx, x, y, fsz, rad, chr) {
	var hfsz = fsz / 2;
	//(0,0)を原点に回転する。
	ctx.setTransform (1, 0, 0, 1, 0, 0)
	//canvasの中心を移動する。
	ctx.translate (x+hfsz, y+hfsz);
	//回転する。
	ctx.rotate (rad);
	//文字を描画する。
	ctx.fillText (chr, -(hfsz), -(hfsz));
} //[[ fSpinText.

// ロード時
function initCanvas() {
	$(window).on("orientationchange", resizeCanvas);
	$(window).on("resize", resizeCanvas);

	// Canvas 要素を作成して body に追加
	canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	document.body.appendChild(canvas);

	// Canvas のコンテキストへ描画
	
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	
	ctx.strokeStyle = 'red';
	ctx.moveTo(10, 10);
	ctx.lineTo(canvasWidth - 10, (canvasWidth - 10) * canvasHeightScale);
	ctx.stroke();
	
	
	// Canvas 要素のリサイズ
	fit(canvas, canvas.parentNode, canvas.width / canvas.height);
	
	// 説明文
	/*
	ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
	ctx.rotate(80 * Math.PI / 180);
	ctx.fillStyle = 'black';
	ctx.font = "50px sans-serif";
	ctx.fillText("この部分を上にして持ちます", 1200, 100);
	waitingLandscape = true;
	*/
	ctx.fillStyle = 'black';
	ctx.font = "50px sans-serif";
	ctx.textAlign = "center";
	fSpinText(ctx, canvasWidth / 4 * 3, canvasHeight / 2, 60, 90 * Math.PI / 180, "この部分を上にして持ちます");
};

function landscaped() {
	waitingLandscape = false;
	
}

// ウィンドウリサイズ時
function resizeCanvas() {
	// Canvas 要素のリサイズ
	fit(canvas, canvas.parentNode, canvas.width / canvas.height);
};

///////////

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
	
	if (waitingLandscape) {
		if (event.gamma > 45 && event.gamma < 45 + 90)
			landscaped();
	}
}
