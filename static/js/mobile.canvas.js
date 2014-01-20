
var initedCanvas = false;
var canvas;
var ctx;
var canvasWidth = 1000;
var canvasHeightScale = 1.0 / 3.0 * 4.0;
var canvasHeight = canvasWidth * canvasHeightScale;
var waitingLandscape = false;

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
	
	//ctx.fillText (chr, -(hfsz), -(hfsz));
	fillTextLine(chr, -hfsz, -hfsz);
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(-(x+hfsz), -(y+hfsz));
} //[[ fSpinText.

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

	// メインループ
	//setInterval(loopCanvas, 1000 / 30);
	loopCanvas();
};

function canvasTouchStart() {
	//console.log('report_motion');
	socket.emit("report_motion", {
		id: id,
		roomid: roomid,
		e: "canvas.touchstart"
	});
}


function canvasTouchEnd() {
	//console.log('report_motion');
	socket.emit("report_motion", {
		id: id,
		roomid: roomid,
		e: "canvas.touchend"
	});
}

function loopCanvas() {
	if (updateCanvas())
		drawCanvas();
}

function updateCanvas() {
	return true;
}

function drawCanvas() {
	// Canvas のコンテキストへ描画
	
	// 初期化
	ctx.moveTo(0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// 対角線
	ctx.strokeStyle = 'red';
	ctx.moveTo(10, 10);
	ctx.lineTo(canvasWidth - 10, (canvasWidth - 10) * canvasHeightScale);
	ctx.stroke();
	
	
	
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
	ctx.font = "60px sans-serif";
	ctx.textAlign = "center";
	fSpinText(ctx, canvasWidth / 4 * 3, canvasHeight / 2, 60, 90 * Math.PI / 180, "画面縦向きロックを有効にして、\nこの部分を上にして持ちます\n\n画面をタップし続けて前進、\nモバイルを左右に傾けて操作します");
	
	////////

	
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
