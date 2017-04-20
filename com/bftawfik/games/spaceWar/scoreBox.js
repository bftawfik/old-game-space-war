function ScoreBox(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.id = 7;
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    hide:'hide',
  };
  this.x = 146;
  this.y = 20;
  this.org = {
    x: this.x,
    y: this.y,
  };
  this.count = 10;
  this.scale = 1;
  this.show = {
    currentTime: 0,
    duration: 1,
    startPos:{
      x: this.x,
      y: -100,
    },
    distance:{
      x:0,
      y:this.y+100,
    },
  };
  this.hide = {
    currentTime: 0,
    duration: 1,
    startPos:{
      x: this.x,
      y: this.y,
    },
    distance:{
      x:0,
      y:-700,
    },
  };
  this.score = {
    scale:0.7,
    gutter:1,
  }
  //---------------------------------------------------------------
  this.changeState = function(state){
    switch (state){
      case(this.states.off):
        this.currentState =  this.states.off;
      break;
      case(this.states.on):
        deactivate_hsStartBtn();
        this.currentState =  this.states.on;
      break;
      case(this.states.show):
        this.currentState =  this.states.show;
      break;
      case(this.states.hide):
        this.currentState =  this.states.hide;
      break;
    }
  };
  //---------------------------------------------------------------
  this.update = function(gsr, dTime){
    if(this.currentState != this.states.off){
      this.gameScaleRatio = gsr;
      this.dTime = dTime;
      switch(this.currentState){
        case(this.states.on):
          // this.playBtn.scale = this.scale;
          // this.playBtn.alpha = this.alpha;
        break;
        case(this.states.show):
          if(this.moveWithEase(this, "show")){
            this.currentState =  this.states.on;
          }
        break;
        case(this.states.hide):
          if(this.moveWithEase(this, "hide")){
            this.currentState =  this.states.off;
          }
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      gameGFX.gameScreen.sprites[this.id].draw(gameCntx, (this.x*this.gameScaleRatio), this.y*this.gameScaleRatio, this.gameScaleRatio*this.scale);
      this.drawScore();
    }
  };
  //---------------------------------------------------------------
  this.moveWithEase = function(obj, animation){
    if(obj[animation].currentTime < obj[animation].duration){
      var easing = BezierEasing(0.5, 0, 0.5, 1);
      obj[animation].currentTime += this.dTime;
      var dTime = obj[animation].currentTime / obj[animation].duration;
      obj.x = (easing(dTime) *obj[animation].distance.x)+obj[animation].startPos.x;
      obj.y = (easing(dTime) *obj[animation].distance.y)+obj[animation].startPos.y;
    }else{
      obj.x = obj[animation].distance.x+obj[animation].startPos.x;
      obj.y = obj[animation].distance.y+obj[animation].startPos.y;
      return true;
    }
    return false;
  }
  //---------------------------------------------------------------
  this.scaleAlphaWithEase = function(obj, animation){
    if(obj[animation].currentTime < obj[animation].duration){
      var easing = BezierEasing(0.5, 0, 0.5, 1);
      obj[animation].currentTime += this.dTime;
      var dTime = obj[animation].currentTime / obj[animation].duration;
      obj.scale = obj[animation].startScale + (easing(dTime)*obj[animation].endScale);
      obj.alpha = obj[animation].startAlpha + (easing(dTime)*obj[animation].endAlpha);
    }else{
      obj.scale = obj[animation].startScale + obj[animation].endScale;
      obj.alpha = obj[animation].startAlpha + obj[animation].endAlpha;
      return true;
    }
    return false;
  }
  //---------------------------------------------------------------
  this.drawScore = function(){
    var stringScore = getScore()+"";
    var start = {
      x: this.x,
      y: this.y,
    };
    var scoreWidth = 0;
    stringScore = stringScore.split('');
    for(var charCount = 0; charCount <stringScore.length;charCount++){
      var charId = parseInt(stringScore[charCount]);
      scoreWidth += (gameGFX.numbers.sprites[charId].getWidth() * this.score.scale);
      scoreHeight = gameGFX.numbers.sprites[charId].getHeight() * this.score.scale;
      //gameGFX.numbers.sprites[char].draw(gameCntx, char_x, char_y, 0.6);

    }
    //console.log(scoreWidth);
    scoreWidth += (stringScore.length-1) * (this.score.gutter * this.score.scale);
    //console.log(scoreWidth);
    var boxWidth = gameGFX.gameScreen.sprites[this.id].getWidth() * this.scale;
    var boxHeight = gameGFX.gameScreen.sprites[this.id].getHeight() * this.scale;
    start.x += (boxWidth-scoreWidth)/2;
    start.y += (boxHeight - scoreHeight)/2;
    var charX = start.x;
    for(var charCount = 0; charCount <stringScore.length;charCount++){
        var charId = parseInt(stringScore[charCount]);
        //console.log(charId);
      gameGFX.numbers.sprites[charId].draw(gameCntx, charX * this.gameScaleRatio, start.y * this.gameScaleRatio,this.score.scale * this.gameScaleRatio);
      charX += gameGFX.numbers.sprites[charId].getWidth() * this.score.scale;
      charX += this.score.gutter * this.score.scale;
    }
  }
  //---------------------------------------------------------------
}
