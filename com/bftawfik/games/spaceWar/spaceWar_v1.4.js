//console.log('game script');
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
var dependants, autoResize;
var images;
var gamePreloader = {prepared:false}, gameReorient = {prepared:false}, gameCnvs, gameCntx;
var gameGFX, game = {};
var mouseClickEvent, moveEvent;
var counter = 0;
var score = 0;
var bestScore = 0;
var drawFix = new Object();
var currentTime = new Date();
var n = 'BFTawfikSpaceWarV1.4';
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
function retrieveBestScore(gameName){
  if (typeof(Storage) !== "undefined") {
		console.log(localStorage.getItem(gameName));
    var myGame = JSON.parse(localStorage.getItem(gameName)) || {date: +new Date(), bestScore: 0};
    return myGame.bestScore;
  }
  return 0;
}
//---------------------------------------------------------------
function storeBestScore(userS, gameName){
  if (typeof(Storage) !== "undefined") {
    var myGame = JSON.parse(localStorage.getItem(gameName)) || {date: +new Date(), bestScore: 0};
    if(myGame.date <= +new Date()){
      if(userS > myGame.bestScore){
        myGame.date = +new Date();
        myGame.bestScore = userS;
        console.log(localStorage.getItem(gameName));
        localStorage.setItem( gameName, JSON.stringify(myGame));
        console.log(localStorage.getItem(gameName));
        console.log("data Changed");
      }
    }
    return true;
  }
  return false;
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function updateScore(){
	if(score>bestScore){
		bestScore = score;
	}
	score = 0;
}
//---------------------------------------------------------------
function setScore(newScore){
	score = newScore;
	//console.log(score);
}
//---------------------------------------------------------------
function getScore(){
	return score;
}
//---------------------------------------------------------------
function getBestScore(){
	return bestScore;
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function esBtnsMouseUp(e){
	if(game.endScreen.replayBtn.state == 'mouseDown'){
		game.endScreen.replayBtn.state = 'mouseUp';
		game.endScreen.replayBtn.id = 1;
		changeGameState(game.states.replayGame);
	}
	if(game.endScreen.exitBtn.state == 'mouseDown'){
		game.endScreen.exitBtn.state = 'mouseUp';
		game.endScreen.exitBtn.id = 3;
		changeGameState(game.states.reinitiateGame);
	}
}
//-------------------------------------------------------------
function esBtnsMouseDown(e){
	var myX = 0;
	var myY = 0;
	if(e.clientX != undefined && e.clientY != undefined){
		myX = e.clientX - e.target.offsetLeft;
		myY = e.clientY - e.target.offsetTop;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		myX = e.touches[0].clientX - e.target.offsetLeft;
		myY = e.touches[0].clientY - e.target.offsetTop;
	}
	var replayBtnRect = {
		x: (game.endScreen.replayBtn.x + game.endScreen.org.x)*game.scaleRatio,
		y: (game.endScreen.replayBtn.y + game.endScreen.org.y)*game.scaleRatio,
		endX: gameGFX.endScreen.sprites[game.endScreen.replayBtn.id].getWidth()*game.scaleRatio,
		endY: gameGFX.endScreen.sprites[game.endScreen.replayBtn.id].getHeight()*game.scaleRatio,
	};
	replayBtnRect.endX += replayBtnRect.x;
	replayBtnRect.endY += replayBtnRect.y;
	if(myX>replayBtnRect.x && myX<replayBtnRect.endX && myY>replayBtnRect.y && myY<replayBtnRect.endY ){
		game.endScreen.replayBtn.id = 2;
		game.endScreen.replayBtn.state = 'mouseDown';
	}
	var exitBtnRect = {
		x: (game.endScreen.exitBtn.x + game.endScreen.org.x)*game.scaleRatio,
		y: (game.endScreen.exitBtn.y + game.endScreen.org.y)*game.scaleRatio,
		endX: gameGFX.endScreen.sprites[game.endScreen.exitBtn.id].getWidth()*game.scaleRatio,
		endY: gameGFX.endScreen.sprites[game.endScreen.exitBtn.id].getHeight()*game.scaleRatio,
	};
	exitBtnRect.endX += exitBtnRect.x;
	exitBtnRect.endY += exitBtnRect.y;
	if(myX>exitBtnRect.x && myX<exitBtnRect.endX && myY>exitBtnRect.y && myY<exitBtnRect.endY ){
		game.endScreen.exitBtn.id = 4;
		game.endScreen.exitBtn.state = 'mouseDown';
	}
}
//---------------------------------------------------------------
function deactivate_esBtns(){
	gameCnvs.removeEventListener(mouseDownEvent, esBtnsMouseDown);
	gameCnvs.removeEventListener(mouseUpEvent, esBtnsMouseUp);
}
//---------------------------------------------------------------
function activate_esBtns(){
	gameCnvs.addEventListener(mouseDownEvent, esBtnsMouseDown);
	gameCnvs.addEventListener(mouseUpEvent, esBtnsMouseUp);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function gsMouseClick(e){
	audios.playStartSound();
	game.gameScreen.ball.changeState(game.gameScreen.ball.states.on);
	game.gameScreen.defender.letTheBallGo();
	deactivate_defenderClick ();
}
//---------------------------------------------------------------
function deactivate_defenderClick (){
	gameCnvs.removeEventListener(mouseClickEvent, gsMouseClick);
}
//---------------------------------------------------------------
function activate_defenderClick (){
	gameCnvs.addEventListener(mouseClickEvent, gsMouseClick);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function getGameMainDimentions(){
	return {width: autoResize.mainWidth, height: autoResize.mainHeight};
}
function gsMouseMove(e){
	var myX = 0;
	var myY = 0;
	if(e.clientX != undefined && e.clientY != undefined){
		myX = e.clientX - e.target.offsetLeft;
		myY = e.clientY - e.target.offsetTop;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		myX = e.touches[0].clientX - e.target.offsetLeft;
		myY = e.touches[0].clientY - e.target.offsetTop;
	}
	game.mousePos = {};
	game.mousePos.x = myX / game.scaleRatio;
	game.mousePos.y = myY / game.scaleRatio;
}
//---------------------------------------------------------------
function deactivate_defender (){
	gameCnvs.removeEventListener(mouseMoveEvent, gsMouseMove);
	changeGameState(game.states.gameOver);
}
//---------------------------------------------------------------
function activate_defender (){
	gameCnvs.addEventListener(mouseMoveEvent, gsMouseMove);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function hsStartBtnMouseUp(e){
	if(game.helpScreen.playBtn.state == 'mouseDown'){
		game.helpScreen.playBtn.state = 'mouseUp';
		game.helpScreen.playBtn.id = 1;
		changeGameState(game.states.hide_HelpScreen);
	}
}
//-------------------------------------------------------------
function hsStartBtnMouseDown(e){
	var myX = 0;
	var myY = 0;
	if(e.clientX != undefined && e.clientY != undefined){
		myX = e.clientX - e.target.offsetLeft;
		myY = e.clientY - e.target.offsetTop;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		myX = e.touches[0].clientX - e.target.offsetLeft;
		myY = e.touches[0].clientY - e.target.offsetTop;
	}
	var startBtnRect = {
		x: (game.helpScreen.playBtn.x + game.helpScreen.org.x)*game.scaleRatio,
		y: (game.helpScreen.playBtn.y + game.helpScreen.org.y)*game.scaleRatio,
		endX: gameGFX.helpScreen.sprites[1].getWidth()*game.scaleRatio,
		endY: gameGFX.helpScreen.sprites[1].getHeight()*game.scaleRatio,
	};
	startBtnRect.endX += startBtnRect.x;
	startBtnRect.endY += startBtnRect.y;
	if(myX>startBtnRect.x && myX<startBtnRect.endX && myY>startBtnRect.y && myY<startBtnRect.endY ){
		game.helpScreen.playBtn.id = 2;
		game.helpScreen.playBtn.state = 'mouseDown';
	}
}
//---------------------------------------------------------------
function deactivate_hsStartBtn(){
	gameCnvs.removeEventListener(mouseDownEvent, hsStartBtnMouseDown);
	gameCnvs.removeEventListener(mouseUpEvent, hsStartBtnMouseUp);
}
//---------------------------------------------------------------
function activate_hsStartBtn(){
	gameCnvs.addEventListener(mouseDownEvent, hsStartBtnMouseDown);
	gameCnvs.addEventListener(mouseUpEvent, hsStartBtnMouseUp);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function ssBtnsMouseUp(e){
	if(game.startScreen.playBtn.state == 'mouseDown'){
		game.startScreen.playBtn.state = 'mouseUp';
		game.startScreen.playBtn.id = 2;
		changeGameState(game.states.hide_StartScreen);
	}
	if(game.startScreen.soundBtn.state == 'mouseDown'){
		game.startScreen.soundBtn.state = 'mouseUp';
		if(game.startScreen.soundBtn.id == 1){
			game.startScreen.soundBtn.id = 0;
		}else if(game.startScreen.soundBtn.id == 3){
			game.startScreen.soundBtn.id = 2;
		}
	}
}
//-------------------------------------------------------------
function ssBtnsMouseDown(e){
	var myX = 0;
	var myY = 0;
	if(e.clientX != undefined && e.clientY != undefined){
		myX = e.clientX - e.target.offsetLeft;
		myY = e.clientY - e.target.offsetTop;
	}else if(e.touches[0].clientX != undefined && e.touches[0].clientY != undefined){
		myX = e.touches[0].clientX - e.target.offsetLeft;
		myY = e.touches[0].clientY - e.target.offsetTop;
	}
	var startBtnRect = {
		x: game.startScreen.playBtn.x,
		y: game.startScreen.playBtn.y,
		endX: gameGFX.startScreen.sprites[2].getWidth()*game.scaleRatio,
		endY: gameGFX.startScreen.sprites[2].getHeight()*game.scaleRatio,
	};
	startBtnRect.endX += startBtnRect.x;
	startBtnRect.endY += startBtnRect.y;
	if(myX>startBtnRect.x && myX<startBtnRect.endX && myY>startBtnRect.y && myY<startBtnRect.endY ){
		//console.log('Rect Hit');
		game.startScreen.playBtn.id = 3;
		game.startScreen.playBtn.state = 'mouseDown';
	}
	//--
	var soundBtnRect = {
		x: game.startScreen.soundBtn.x,
		y: game.startScreen.soundBtn.y,
		endX: gameGFX.soundBtn.sprites[game.startScreen.soundBtn.id].getWidth()*game.scaleRatio,
		endY: gameGFX.soundBtn.sprites[game.startScreen.soundBtn.id].getHeight()*game.scaleRatio,
	};
	soundBtnRect.endX += soundBtnRect.x;
	soundBtnRect.endY += soundBtnRect.y;
	if(myX>soundBtnRect.x && myX<soundBtnRect.endX && myY>soundBtnRect.y && myY<soundBtnRect.endY ){
		if(game.startScreen.soundBtn.id == 0){
			game.startScreen.soundBtn.id = 3;
		}else if(game.startScreen.soundBtn.id == 2){
			game.startScreen.soundBtn.id = 1;
		}
		audios.changeState();
		game.startScreen.soundBtn.state = 'mouseDown';
	}
}
//---------------------------------------------------------------
function deactivate_ssBtns(){
	gameCnvs.removeEventListener(mouseDownEvent, ssBtnsMouseDown);
	gameCnvs.removeEventListener(mouseUpEvent, ssBtnsMouseUp);
}
//---------------------------------------------------------------
function activate_ssBtns(){
	gameCnvs.addEventListener(mouseDownEvent, ssBtnsMouseDown);
	gameCnvs.addEventListener(mouseUpEvent, ssBtnsMouseUp);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function render(){
	var correctRender = !checkIfMobilePhone() || game.rightOrientation;
	if(correctRender){
		$('#orientDiv').css({"display": "none"});
		gameCntx.clearRect(0,0, gameCnvs.width, gameCnvs.height);
		switch(game.currentState){
			case(game.states.show_StartScreen):
				game.background.draw(gameCntx);
				game.startScreen.draw(gameCntx);
			break;
			case(game.states.show_HelpScreen):
				game.background.draw(gameCntx);
				game.startScreen.draw(gameCntx);
				game.helpScreen.draw(gameCntx);
			break;
			case(game.states.show_GameScreen):
				game.background.draw(gameCntx);
				game.helpScreen.draw(gameCntx);
				game.gameScreen.draw(gameCntx);
			break;
			case(game.states.gameOn):
				game.background.draw(gameCntx);
				game.gameScreen.draw(gameCntx);
			break;
			case(game.states.gameOver):
				game.background.draw(gameCntx);
				game.gameScreen.draw(gameCntx);
				game.endScreen.draw(gameCntx);
			break;
			case(game.states.replayGame):
				game.background.draw(gameCntx);
				game.endScreen.draw(gameCntx);
				game.helpScreen.draw(gameCntx);
			break;
			case(game.states.reinitiateGame):
				game.background.draw(gameCntx);
				game.endScreen.draw(gameCntx);
				game.startScreen.draw(gameCntx);
			break;
		}
	}else{
		$('#orientDiv').css({"display": "inline"});
	}
}
//---------------------------------------------------------------
function update(){
	var correctRender = !checkIfMobilePhone() || game.rightOrientation;
	if(correctRender){
		var now  = new Date();
		var dTime = (now.getTime()-currentTime.getTime())/1000 ;
		currentTime = now;
		game.currentFrame++;
		switch(game.currentState){
			case(game.states.show_StartScreen):
				game.background.update(game.scaleRatio);
				game.startScreen.update(game.scaleRatio, dTime);
			break;
			case(game.states.show_HelpScreen):
				game.background.update(game.scaleRatio, dTime);
				game.startScreen.update(game.scaleRatio, dTime);
				game.helpScreen.update(game.scaleRatio, dTime);
			break;
			case(game.states.show_GameScreen):
				game.background.update(game.scaleRatio);
				game.helpScreen.update(game.scaleRatio, dTime);
				game.gameScreen.update(game.scaleRatio, dTime, game.mousePos);
				if(game.gameScreen.currentState == game.gameScreen.states.on){
					changeGameState(game.states.gameOn);
					activate_defenderClick();
				}
			break;
			case(game.states.gameOn):
				game.background.update(game.scaleRatio);
				game.gameScreen.update(game.scaleRatio, dTime, game.mousePos);
			break;
			case(game.states.gameOver):
				game.background.update(game.scaleRatio);
				game.gameScreen.update(game.scaleRatio, dTime, game.mousePos);
				game.endScreen.update(game.scaleRatio, dTime);
			break;
			case(game.states.replayGame):
				game.background.update(game.scaleRatio);
				game.endScreen.update(game.scaleRatio, dTime);
				game.helpScreen.update(game.scaleRatio, dTime);
			break;
			case(game.states.reinitiateGame):
				game.background.update(game.scaleRatio);
				game.endScreen.update(game.scaleRatio, dTime);
				game.startScreen.update(game.scaleRatio, dTime);
			break;
		}
	}else{
		game.orientImgMarginTop = (parseInt($('#orientDiv').css("height")) - parseInt($('#orientDiv img').css("height")))/2;
		$('#orientDiv img').css({"margin-top": game.orientImgMarginTop+"px"});
	}
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function changeGameState(gameState){
	//console.log('changeGameState');
	switch(gameState){
		case(game.states.show_StartScreen):
			if(game.currentState == game.states.off){
				game.currentState = game.states.show_StartScreen;
				game.background.changeState(game.background.states.on);
				game.startScreen.changeState(game.startScreen.states.show);
			}
		break;
		case(game.states.hide_StartScreen):
			if(game.currentState == game.states.show_StartScreen){
				game.currentState = game.states.hide_StartScreen;
				game.startScreen.changeState(game.startScreen.states.hide);
				game.background.changeState(game.background.states.dim);
				game.currentState = game.states.show_HelpScreen;
				game.helpScreen.changeState(game.helpScreen.states.show);
			}else if(game.currentState == game.states.reinitiateGame){
				game.currentState = game.states.hide_StartScreen;
				updateScore();
				game.endScreen = new EndScreen(game.scaleRatio, gameCntx);
				game.startScreen.changeState(game.startScreen.states.hide);
				game.background.changeState(game.background.states.dim);
				game.currentState = game.states.show_HelpScreen;
				game.helpScreen.changeState(game.helpScreen.states.show);
			}
		break;
		case(game.states.hide_HelpScreen):
			if(game.currentState == game.states.show_HelpScreen){
				game.currentState = game.states.hide_HelpScreen;
				game.helpScreen.changeState(game.helpScreen.states.hide);
				game.currentState = game.states.show_GameScreen;
				game.gameScreen.changeState(game.gameScreen.states.show);
			}else if(game.currentState == game.states.replayGame){
				game.currentState = game.states.hide_HelpScreen;
				updateScore();
				game.endScreen = new EndScreen(game.scaleRatio, gameCntx);
				game.helpScreen.changeState(game.helpScreen.states.hide);
				game.currentState = game.states.show_GameScreen;
				game.gameScreen.changeState(game.gameScreen.states.show);
			}
		break;
		case(game.states.gameOn):
			if(game.currentState == game.states.show_GameScreen){
				game.currentState = game.states.gameOn;
			}
		break;
		case(game.states.gameOver):
			if(game.currentState == game.states.gameOn){
				game.currentState = game.states.gameOver;
				if(score > bestScore){
					bestScore = score;
				}
				console.log(storeBestScore(bestScore, n));
				game.gameScreen.changeState(game.gameScreen.states.hide);
				game.endScreen.changeState(game.endScreen.states.show);
			}
		break;
		case(game.states.replayGame):
			if(game.currentState == game.states.gameOver){
				game.currentState = game.states.replayGame;
				game.helpScreen = new HelpScreen(game.scaleRatio);
				game.gameScreen = new GameScreen(game.scaleRatio, gameCntx);
				game.endScreen.changeState(game.endScreen.states.hide);
				game.helpScreen.changeState(game.helpScreen.states.show);
			}
		break;
		case(game.states.reinitiateGame):
			if(game.currentState == game.states.gameOver){
				game.currentState = game.states.reinitiateGame;
				game.startScreen = new StartScreen(game.scaleRatio);
				game.helpScreen = new HelpScreen(game.scaleRatio);
				game.gameScreen = new GameScreen(game.scaleRatio, gameCntx);
				game.endScreen.changeState(game.endScreen.states.hide);
				game.startScreen.changeState(game.startScreen.states.show);
			}
		break;
	}
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function run() {
	console.log("run");
	if(window.innerHeight > window.innerWidth){
		dOrientation = "portrait";
	}else{
		dOrientation = "landscape";
	}
	if(dOrientation == game.orientation){
		game.rightOrientation = true;
	}else{
		game.rightOrientation = false;
	}
	autoResizeResize();
	audios.playLoopSound();
	changeGameState(game.states.show_StartScreen);
	var loop = function() {
		if(game.currentState != game.states.off){
			update();
			render();
		}
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function createGameClasses(){
	console.log(game.scaleRatio);
  game.currentFrame = 0;
  game.states = {
		off:"off",
    show_StartScreen:"show_StartScreen",
		hide_StartScreen:"hide_StartScreen",
		show_HelpScreen:"show_HelpScreen",
		hide_HelpScreen:"hide_HelpScreen",
		show_GameScreen:"show_GameScreen",
		hide_GameScreen:"hide_GameScreen",
		gameOn:"gameOn",
		gameOver:"gameOver",
		replayGame: "replayGame",
		reinitiateGame: "reinitiateGame",
  };
  game.currentState = 'off';
  game.background = new Background(game.scaleRatio, this);
	game.startScreen = new StartScreen(game.scaleRatio);
	game.helpScreen = new HelpScreen(game.scaleRatio);
	game.gameScreen = new GameScreen(game.scaleRatio, gameCntx);
	game.endScreen = new EndScreen(game.scaleRatio, gameCntx);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function autoResizeInit(){
	//console.log('autoResizeInit');
	autoResize.init(gameCnvs);
}
//---------------------------------------------------------------
function autoResizeResize(){
	//console.log('autoResizeResize');
	game.scaleRatio = autoResize.resize();
	game.scaleRatio = gameCnvs.width/autoResize.mainDimensions[autoResize.direction].width;
}
//---------------------------------------------------------------
function createAutoResize(){
	//console.log('createAutoResize');
	autoResize = new AutoResize(game.orientation);
	autoResize.addElement(gamePreloader.tag);
	autoResize.addElement(gameReorient.tag);
	autoResize.addElement(gameCnvs);
	autoResize.init();
	window.addEventListener('load', autoResizeInit, false);
	window.addEventListener('resize', autoResizeResize, false);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function createGamePreloader(){
	gamePreloader.tag = $("<div>", {id: "preloaderDiv", "class": "fullscreenDiv"})[0];
	$(gamePreloader.tag).css({"display" : "none"});
  $('body').append(gamePreloader.tag);
}
//---------------------------------------------------------------
function createGameReorient(){
	gameReorient.tag = $("<div>", {id: "orientDiv", "class": "fullscreenDiv"})[0];
	$(gameReorient.tag).css({"display" : "none"});
  $('body').append(gameReorient.tag);
}
//---------------------------------------------------------------
function createGameCanvas(){
	gameCnvs = $('<canvas width="412" height="732" style="border:1px solid black">')[0];
  gameCntx = gameCnvs.getContext("2d");
	gameCntx.fillCircle = fillCircle;
  gameCntx.strokeCircle = strokeCircle;
	$('body').append(gameCnvs);
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function initGame(){
	createGameCanvas();
	createGameReorient();
	createGamePreloader();
	game.orientation = "portrait";
	createAutoResize();
}
//---------------------------------------------------------------
function startGame(){
	console.log('startGame');
	//--
	var localBestScore = retrieveBestScore(n);
	if(localBestScore > bestScore){
		bestScore = localBestScore;
	}
	drawFix.now = new Date();
	drawFix.currentMS = drawFix.now.getMilliseconds();
	drawFix.currentSecond = 0;
	drawFix.fpsFactor = 1;
	drawFix.FixedFPS = 0;
	drawFix.realFPS = drawFix.now.getSeconds();
	//--
	gameGFX = createGameSprites(images.gameImgs[images.mainImageId].image);
	//--
	createGameClasses();
	//--
	if(checkIfMobilePhone()){
		mouseClickEvent = "touchstart";
		mouseDownEvent = "touchstart";
		mouseUpEvent = "touchend";
		mouseMoveEvent = "touchmove";
	}else{
		mouseClickEvent = "click";
		mouseDownEvent = "mousedown";
		mouseUpEvent = "mouseup";
		mouseMoveEvent = "mousemove";
	}
	//--
	run();
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function loadImagesAndAudios(){
  initGame();
	images = new ImageRepository();
	audios = new AudioRepository();
	var loop = function() {
		var loadedImgs =images.getLoadedCount();
		if((images.getLoadedCount() != images.gameImgs.length) || (audios.getLoadedCount() != audios.gameAudios.length)){
			if(images.checkPreloaderImages()){
				if(!gamePreloader.prepared){
					gamePreloader.prepared = true;
					$(gamePreloader.tag).css({"display" : "inline"});
					$(gamePreloader.tag).append(images.gameImgs[0].image);
					$(gamePreloader.tag).append('<div>');
					$(gamePreloader.tag).find('div').append(images.gameImgs[1].image);
					$(images.gameImgs[2].image).attr('id', 'maskedGamePreloader');
					$(gamePreloader.tag).find('div').append(images.gameImgs[2].image);
				}
				var bytesLoaded = 0;
				var bytesTotal = 0;
				for(var imgsCount = 0;imgsCount < images.gameImgs.length; imgsCount++){
					bytesLoaded += images.gameImgs[imgsCount].bytesLoaded;
					bytesTotal += images.gameImgs[imgsCount].bytesTotal;
				}
				for(var audiosCount = 0;audiosCount < audios.gameAudios.length; audiosCount++){
					bytesLoaded += audios.gameAudios[audiosCount].bytesLoaded;
					bytesTotal += audios.gameAudios[audiosCount].bytesTotal;
				}
				var percentage = bytesLoaded/ bytesTotal;
				$('#maskedGamePreloader').css({"clip-path": "polygon(0 0, "+100 * percentage+"% 0, "+100 * percentage+"% 100%, 0 100%)"});
			}
			console.log(bytesLoaded +' of '+ bytesTotal);
			window.requestAnimationFrame(loop);
		}else{
			$(gameReorient.tag).append(images.gameImgs[3].image);
			$(gamePreloader.tag).css({"display" : "none"});
			$(gameCnvs).css({"display" : "inline"});
			startGame();
		}
	}
	window.requestAnimationFrame(loop);
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
		"com/bftawfik/games/spaceWar/imageRepository.js",
		"com/bftawfik/games/spaceWar/audioRepository.js", "com/bftawfik/games/spaceWar/sprite.js",
		"com/bftawfik/games/spaceWar/autoResize.js",
		"com/bftawfik/games/spaceWar/fullScreen.js",
		"com/bftawfik/games/spaceWar/background.js",
		"com/bftawfik/games/spaceWar/startScreen.js",
		"com/bftawfik/games/spaceWar/helpScreen.js",
		"com/bftawfik/games/spaceWar/gameScreen.js",
		"com/bftawfik/games/spaceWar/defender.js",
		"com/bftawfik/games/spaceWar/ball.js",
		"com/bftawfik/games/spaceWar/enemy.js",
		"com/bftawfik/games/spaceWar/enemies.js",
		"com/bftawfik/games/spaceWar/scoreBox.js",
		"com/bftawfik/games/spaceWar/endScreen.js"
	);
	dependants.loadAll('loadImagesAndAudios');
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
