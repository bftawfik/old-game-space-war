//console.log('game script');
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

var dependants, autoResize;
var images;
var gameCnvs, gameCntx;
var gameGFX, game = {};
var clickEvent, moveEvent;
var counter = 0;
var score = 0;
var bestScore = 0;
var drawFix = new Object();
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function checkIfMobilePhone(){
  isMobilePhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isMobilePhone;
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

//---------------------------------------------------------------
function loadImages(){
  images = new ImageRepository('initGame');
}
//---------------------------------------------------------------
function createGameClasses(){
	//console.log(game.scaleRatio);
  game.currentFrame = 0;
  game.states = {
    initial:"initial",
    intro:"intro",
    game_on:"game_on",
    game_over:"game_over",
    lets_jump:"lets_jump",
  };
  game.currentState = 'initial';
  game.background = new Background(game.scaleRatio);
	game.bar = new Bar(game.scaleRatio);
	game.ball = new Ball(game.scaleRatio);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function update(){
  game.currentFrame++;
  game.background.update(game.scaleRatio);
	game.bar.update(game.scaleRatio, game.mouse);
	game.ball.update(game.scaleRatio, game.bar.getPos());
  // game.foreground.update(game.scaleRatio);
	// game.scoreScreen.update(game.scaleRatio);
  // game.boyFigure.update(game.scaleRatio);
	// game.barrels.update(game.scaleRatio);
  // game.startScreen.update(game.scaleRatio);
  // game.introScreen.update(game.scaleRatio);
  // game.endScreen.update(game.scaleRatio);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function render(){
	gameCntx.clearRect(0,0, gameCnvs.width, gameCnvs.height);
	game.background.draw(gameCntx);
	game.bar.draw(gameCntx);
	game.ball.draw(gameCntx);

  // game.foreground.draw(gameCntx);
	// game.scoreScreen.draw(gameCntx);
	// game.boyFigure.draw(gameCntx);
	// game.barrels.draw(gameCntx);
  // game.startScreen.draw(gameCntx);
  // game.introScreen.draw(gameCntx);
  // game.endScreen.draw(gameCntx);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function run() {
	var loop = function() {
		//console.log("loop");
		// drawFix.now = new Date();
		// drawFix.currentMS = drawFix.now.getMilliseconds();
		// var dMS = drawFix.currentMS - drawFix.lastMS;
		// //console.log(Math.floor(1000/dMS) +" fps");
		// drawFix.fpsFactor = 30/Math.floor(1000/dMS);
		// //console.log(drawFix.fpsFactor);
		// drawFix.lastMS = drawFix.currentMS;
		// if(drawFix.currentSecond == drawFix.now.getSeconds()){
		// 	drawFix.realFPS++;
		// 	if(Math.floor(drawFix.realFPS*drawFix.fpsFactor) > drawFix.FixedFPS){
		// 		drawFix.FixedFPS = Math.floor(drawFix.realFPS*drawFix.fpsFactor);
		// 		//console.log(drawFix.FixedFPS);
		// 		fixedRun();
		// 	}
		// }else{
		// 	drawFix.currentSecond = drawFix.now.getSeconds();
		// 	drawFix.realFPS = 0;
		// 	drawFix.FixedFPS = 0;
		// 	//console.log(drawFix.FixedFPS);
		// }
		update();
		render();
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}
function fixedRun(){
	update();
	render();
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function clicked(e){
  console.log('clicked');
	game.mouse = {};
	if(e.clientX != undefined && e.clientY != undefined){
		game.mouse.x = e.clientX;
		game.mouse.y = e.clientY;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		game.mouse.x = e.touches[0].clientX;
		game.mouse.y = e.touches[0].clientY;
	}
	changeGameState();
}
//---------------------------------------------------------------
function mouseMove(e){
	game.mouse = {};
	if(e.clientX != undefined && e.clientY != undefined){
		game.mouse.x = e.clientX - gameCnvs.offsetLeft;
		game.mouse.y = e.clientY - gameCnvs.offsetTop;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		console.log(e.touches[0].clientX, e.touches[0].clientY);
		game.mouse.x = e.touches[0].clientX - gameCnvs.offsetLeft;
		game.mouse.y = e.touches[0].clientY - gameCnvs.offsetTop;
	}
	// changeGameState();
}
//---------------------------------------------------------------
function changeGameState(){
	//console.log('changeGameState');
	if(game.currentState == game.states.initial){
		//console.log('0');
		var playRec = game.startScreen.getPlayRectangle();
		playRec.x+= (window.innerWidth-gameCnvs.width)/2;
		if(game.mouse.x > playRec.x && game.mouse.x < playRec.x + playRec.width && game.mouse.y > playRec.y && game.mouse.y < playRec.y + playRec.height ){
			game.currentState = game.states.intro;
			game.startScreen.changeState(game.startScreen.states.off);
			game.introScreen.changeState(game.introScreen.states.on);
			game.boyFigure.changeState(game.boyFigure.states.standing);
			game.barrels.changeState(game.barrels.states.standing);
		}
	}else if(game.currentState == game.states.intro){
		var playRec = game.introScreen.getPlayRectangle();
		playRec.x+= (window.innerWidth-gameCnvs.width)/2;
		if(game.mouse.x > playRec.x && game.mouse.x < playRec.x + playRec.width && game.mouse.y > playRec.y && game.mouse.y < playRec.y + playRec.height ){
			game.currentState = game.states.game_on;
			//console.log('1');
			game.introScreen.changeState(game.introScreen.states.off);
			game.background.changeState(game.background.states.on);
			game.foreground.changeState(game.foreground.states.on);
			game.scoreScreen.changeState(game.scoreScreen.states.on);
			game.boyFigure.changeState(game.boyFigure.states.walking);
			game.barrels.changeState(game.barrels.states.on);
		}
	}else if(game.currentState == game.states.game_on){
		//console.log('2');
		game.boyFigure.changeState(game.boyFigure.states.jumping);

	}else if(game.currentState == game.states.game_over){
		//console.log('3');
		var closeRec = game.endScreen.getCloseRectangle();
		closeRec.x+= (window.innerWidth-gameCnvs.width)/2;
		var replayRec = game.endScreen.getReplayRectangle();
		replayRec.x+= (window.innerWidth-gameCnvs.width)/2;
		if(game.mouse.x > closeRec.x && game.mouse.x < closeRec.x + closeRec.width && game.mouse.y > closeRec.y && game.mouse.y < closeRec.y + closeRec.height ){
			if(score > bestScore){
				bestScore = score;
			}
			score = 0;
			createGameClasses();
			return;
		}
		if(game.mouse.x > replayRec.x && game.mouse.x < replayRec.x + replayRec.width && game.mouse.y > replayRec.y && game.mouse.y < replayRec.y + replayRec.height ){
			if(score > bestScore){
				bestScore = score;
			}
			score = 0;
			game.currentState = game.states.intro;
			game.endScreen.changeState(game.startScreen.states.off);
			game.startScreen.changeState(game.startScreen.states.off);
			game.introScreen.changeState(game.introScreen.states.on);
			game.boyFigure.changeState(game.boyFigure.states.standing);
			game.barrels.changeState(game.barrels.states.standing);
			return;
		}
	}
}
//---------------------------------------------------------------
function endGame(){
	//console.log('endGame');
	//
	// console.log(score);
	// console.log(bestScore);
	game.background.changeState(game.background.states.off);
	game.foreground.changeState(game.foreground.states.off);
	game.scoreScreen.changeState(game.scoreScreen.states.off);
	game.boyFigure.changeState(game.boyFigure.states.killed);
	game.barrels.changeState(game.barrels.states.standing);
	game.endScreen.changeState(game.barrels.states.on);
	game.currentState = game.states.game_over;
}
//---------------------------------------------------------------
function increaseScore(){
	//console.log('increaseScore');
	//
	score++;
}

function createGameCanvas(){
  gameCnvs = document.createElement("canvas");
  // gameCnvs.width = 1920;
  // gameCnvs.height = 1080;
	gameCnvs.width = 732;
	gameCnvs.height = 412;
  gameCnvs.style.border = "1px solid black";
  gameCntx = gameCnvs.getContext("2d");
	gameCntx.fillCircle = fillCircle;
  gameCntx.strokeCircle = strokeCircle;
  document.body.appendChild(gameCnvs);
	//
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function autoResizeInit(){
	console.log('autoResizeInit');
	autoResize.init(gameCnvs);
}
//---------------------------------------------------------------
function autoResizeResize(){
	console.log('autoResizeResize');
	game.scaleRatio = autoResize.resize();
}
//---------------------------------------------------------------
function createAutoResize(){
	console.log('createAutoResize');
	autoResize = new AutoResize("portrait");
	game.scaleRatio = autoResize.init(gameCnvs);
	window.addEventListener('load', autoResizeInit, false);
	window.addEventListener('resize', autoResizeResize, false);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function initGame(){
	console.log('initGame');
	//--
	drawFix.now = new Date();
	drawFix.currentMS = drawFix.now.getMilliseconds();
	drawFix.currentSecond = 0;
	drawFix.fpsFactor = 1;
	drawFix.FixedFPS = 0;
	drawFix.realFPS = drawFix.now.getSeconds();
	//--
	createGameCanvas();
	createAutoResize();
	createGameClasses();
  gameGFX = createGameSprites(images.gameImg);
  run();
	if(checkIfMobilePhone()){
		clickEvent = "touchstart";
		moveEvent = "touchmove";
	}else{
		clickEvent = "click";
		moveEvent = "mousemove";
	}
	document.getElementById("fsDiv").addEventListener(clickEvent, function (){
		var fullScreen = toggleFullScreen();
		if(fullScreen){
			document.getElementById("fse").style.display = 'inline';
			document.getElementById("fs").style.display = 'none';
		}else{
			document.getElementById("fs").style.display = 'inline';
			document.getElementById("fse").style.display = 'none';
		}
	});
	document.addEventListener(moveEvent, mouseMove);
  //document.addEventListener(clickEvent, clicked);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(function(){
	dependants = new Dependants();
	dependants.init(
		"com/bftawfik/games/spaceInvaders/imageRepository.js", "com/bftawfik/games/spaceInvaders/sprite.js",
		"com/bftawfik/games/spaceInvaders/mobileSupport.js",
		"com/bftawfik/games/spaceInvaders/autoResize.js",
		"com/bftawfik/games/spaceInvaders/fullScreen.js",
		"com/bftawfik/games/spaceInvaders/background.js",
		"com/bftawfik/games/spaceInvaders/ball.js",
		"com/bftawfik/games/spaceInvaders/bar.js"
	);
	// dependants.init(
	// 	"com/bftawfik/games/spaceInvaders/imageRepository.js", "com/bftawfik/games/spaceInvaders/sprite.js",
	// 	"com/bftawfik/games/spaceInvaders/mobileSupport.js",
	// 	"com/bftawfik/games/spaceInvaders/autoResize.js",
	// 	"com/bftawfik/games/spaceInvaders/fullScreen.js", "com/bftawfik/games/spaceInvaders/background.js", "com/bftawfik/games/spaceInvaders/foreground.js", "com/bftawfik/games/spaceInvaders/barrels.js", "com/bftawfik/games/spaceInvaders/startScreen.js", "com/bftawfik/games/spaceInvaders/introScreen.js", "com/bftawfik/games/spaceInvaders/endScreen.js", "com/bftawfik/games/spaceInvaders/boyFigure.js", "com/bftawfik/games/spaceInvaders/scoreScreen.js"
	// );
	dependants.loadAll('loadImages');
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function fillCircle(obj){
  this.beginPath();
  this.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
  this.closePath();
  this.fill();
}
//---------------------------------------------------------------
function strokeCircle(obj){
  this.beginPath();
  this.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
  this.closePath();
  this.stroke();
}
