var container, hudcontainer, hexGL, preloader, pcontainer, quality = 2, difficulty = 0, player = "Anonym", 
hasLS = "undefined" !== typeof Storage, cbhalf = document.getElementById("cbhalf");
function setQuality(a)
{
	bkcore.Utils.updateClass("preset-q" + quality, "active", !1);
	quality = a;
	bkcore.Utils.updateClass("preset-q" + quality, "active", !0)
}
function init()
{
	var a = window.innerWidth, b = window.innerHeight;
	hudcontainer = document.getElementById("overlay");
	container = document.getElementById("main");
	pcontainer = document.getElementById("preloader");
	preloader = new bkcore.ThreePreloader({
		width : a, height : b, container : pcontainer
	});
	hexGL = new bkcore.hexgl.HexGL(
	{
		document : document, width : a, height : b, container : container, overlay : hudcontainer, quality : quality, 
		difficulty : difficulty, player : player, half : cbhalf && !!cbhalf.checked
	});
	hexGL.load(
	{
		onLoad : function ()
		{
			hexGL.init();
			hexGL.start();
			preloader.remove()
		},
		onError : function (a)
		{
			console.log("ERROR ON " + a + ".")
		},
		onProgress : function (a)
		{
			preloader.ratio = a.loaded / a.total;
		}
	})
}
function beta(a)
{
	difficulty = a;
	player = document.getElementById("playername").value;
	"" == player || void 0 == player ? alert("プレイヤー名を入力してください（半角のみ）\nPlease enter a player name.") : (hasLS && (localStorage.playername = player), 
	document.body.style.overflow = "hidden", document.getElementById("beta").innerHTML = "", setTimeout(function ()
	{
		init()
	}, 500))
}
function restrictCharacters(a, b)
{
	b || (b = window.event);
	b.keyCode ? code = b.keyCode : b.which && (code = b.which);
	return String.fromCharCode(code).match(/[A-Za-z]/g) ?!0 :!1
}
var p = document.getElementById("playername");
p.onkeypress = function (a)
{
	return restrictCharacters(this, a);
};
hasLS && void 0 != localStorage.playername && (p.value = localStorage.playername);
bkcore.Ladder.load(function ()
{
	bkcore.Ladder.displayLadder("ladder-cityscape-casual", "cityscape", "casual");
	bkcore.Ladder.displayLadder("ladder-cityscape-hard", "cityscape", "hard")
});
if (!Detector.webgl)
{
	var d = document.getElementById("detector-play");
	d.innerHTML = '<div id="detector-error">' + (window.WebGLRenderingContext ? 'お使いのグラフィックスカードは<a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>がサポートされていないようです。<a href="http://get.webgl.org/">ここ</a>をご覧ください。<br>Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />\nFind out how to get it <a href="http://get.webgl.org/">here</a>.' : 
	'お使いのブラウザは<a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>がサポートされていないようです。<a href="http://get.webgl.org/">ここ</a>でサポートされているブラウザを見つけてください。<br>Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>\nFind out how to get it <a href="http://get.webgl.org/">here</a>.') + "</div>";
};
