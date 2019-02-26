//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function Sprite(img, x, y, width, height) {
	this.sizefactor = 2;
	this.img = img;
	this.x = x*this.sizefactor;
	this.y = y*this.sizefactor;
	this.width = width*this.sizefactor;
	this.height = height*this.sizefactor;
	this.getWidth = function(){
		return this.width/this.sizefactor;
	}
	this.getHeight = function(){
		return this.height/this.sizefactor;
	}
};
//---------------------------------------------------------------
Sprite.prototype.draw = function(ctx, x, y, scale=1) {
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, ((this.width/this.sizefactor)*scale), ((this.height/this.sizefactor)*scale));
};
//---------------------------------------------------------------
Sprite.prototype.draw2 = function(ctx, x, y, width=0, height=0, scale=1) {
	if(width == 0){
		width = (this.width/this.sizefactor);
	}
	if(height == 0){
		height = (this.height/this.sizefactor);
	}
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, (width*scale), (height*scale));
};
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function createGameSprites(img){
  var gameGFX = {};
  gameGFX.background = {
		sprites:[
			new Sprite(img, 2, 2, 412, 732),
			new Sprite(img, 2, 734, 412, 732),
			new Sprite(img, 416, 2, 86, 86),
			new Sprite(img, 416, 90, 44, 44),
		],
  };
	gameGFX.startScreen = {
		sprites:[
			new Sprite(img, 504, 2, 231, 99),
			new Sprite(img, 737, 2, 224, 82),
			new Sprite(img, 416, 136, 124, 129),
			new Sprite(img, 542, 136, 124, 129),
		],
  };
	gameGFX.soundBtn = {
		sprites:[
			new Sprite(img, 740, 447, 48, 65),
			new Sprite(img, 740, 514, 48, 65),
			new Sprite(img, 790, 447, 48, 65),
			new Sprite(img, 790, 514, 48, 65),
		],
  };
	gameGFX.rocket = {
		sprites:[
			new Sprite(img, 416, 677, 234, 408),
			new Sprite(img, 416, 267, 234, 408),
		],
  };
	gameGFX.smallRocket = {
		sprites:[
			new Sprite(img, 668, 615, 19, 33),
			new Sprite(img, 668, 580, 19, 33),
		],
  };
	gameGFX.helpScreen = {
		sprites:[
			new Sprite(img, 416, 1089, 308, 275),
			new Sprite(img, 668, 103, 91, 95),
			new Sprite(img, 761, 103, 91, 95),
		],
  };
	gameGFX.gameScreen = {
		sprites:[
			new Sprite(img, 668, 200, 70, 16),
			new Sprite(img, 668, 218, 70, 16),
			new Sprite(img, 668, 236, 70, 16),
			new Sprite(img, 668, 254, 70, 16),
			new Sprite(img, 668, 272, 70, 16),
			new Sprite(img, 668, 290, 15, 15),
			new Sprite(img, 685.5, 292, 82, 4),
			new Sprite(img, 740, 200, 120, 33),
			new Sprite(img, 740, 235, 70, 16),
		],
  };
	gameGFX.endScreen = {
		sprites:[
			new Sprite(img, 416, 1366, 308, 266),
			new Sprite(img, 668, 307, 68, 68),
			new Sprite(img, 668, 377, 68, 68),
			new Sprite(img, 668, 447, 48, 65),
			new Sprite(img, 668, 514, 48, 65),
		],
  };
	gameGFX.numbers = {
		sprites:[
			new Sprite(img, 2, 1470, 19, 22),
			new Sprite(img, 23, 1470, 12, 22),
			new Sprite(img, 37, 1470, 18, 22),
			new Sprite(img, 57, 1470, 19, 22),
			new Sprite(img, 78, 1470, 19, 22),
			new Sprite(img, 99, 1470, 17, 22),
			new Sprite(img, 118, 1470, 18, 22),
			new Sprite(img, 138, 1470, 17, 22),
			new Sprite(img, 157, 1470, 19, 22),
			new Sprite(img, 178, 1470, 18, 22),
		],
  };
  return gameGFX;
};
