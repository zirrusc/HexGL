
var initedCanvas = false;
var canvas;
var ctx;
var canvasWidth = 1000;
var canvasHeightScale = 1.0 / 3.0 * 4.0;
var canvasHeight = canvasWidth * canvasHeightScale;
var waitingLandscape = false;

var istouch = false;

// image
var descImage = new Image();
//var lookPcImage = new Image();
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
	//lookPcImage.src = 'images/lookPcImage.png';
	runningImage.src = 'images/runningImage.png';
	onTouchImage.src = 'images/onTouchImage.png';
	
	
	// メインループ
	setInterval(loopCanvas, 1000 / 30);
	loopCanvas();
};

function canvasTouchStart() {
	istouch = true;
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

	if (loopcount < 90) {
		drawn = true;
		ctx.drawImage(descImage, 0, 0, canvasWidth, canvasHeight);
	}
	else
	{
		//ctx.drawImage(lookPcImage, 0, 0, canvasWidth, canvasHeight);
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
