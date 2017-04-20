function EndScreen(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.x = 52;
  this.y = 223;
  this.scale = 0;
  this.alpha = 0;
  this.org = {
    x: 52,
    y: 223,
  };
  this.currentState = 'off';
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    hide:'hide',
  };
  this.on = {
    scale: 1,
    alpha: 1,
  };
  this.off = {
    scale: 0,
    alpha: 0,
  };
  this.show = {
    currentTime: 0,
    duration: 1,
    startScale: 0,
    endScale: 1,
    startAlpha: 0,
    endAlpha: 1,
  };
  this.hide = {
    currentTime: 0,
    duration: 1,
    startScale: 1,
    endScale: -1,
    startAlpha: 1,
    endAlpha: -1,
  };
  this.replayBtn = {
    x: 120,
    y: 192,
    id: 1,
    state: 'mouseUp',
  };
  this.exitBtn = {
    x: 270,
    y: 5,
    id: 3,
    state: 'mouseUp',
  };
  this.score = {
    scale:0.9,
    gutter:1,
  }
  this.bestScore = {
    scale:0.7,
    gutter:1,
  }
  //---------------------------------------------------------------
  this.changeState = function(state){
    //console.log(state);
    switch (state){
      case(this.states.off):
        this.currentState =  this.states.off;
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
    this.gameScaleRatio = gsr;
    this.dTime = dTime;
    if(this.currentState != this.states.off){
      switch(this.currentState){
        case(this.states.on):
          this.replayBtn.scale = this.scale;
          this.replayBtn.alpha = this.alpha;
          //--
          this.exitBtn.scale = this.scale;
          this.exitBtn.alpha = this.alpha;
        break;
        case(this.states.show):
          if(this.scaleAlphaWithEase(this, "show")){
            this.currentState = this.states.on;
            activate_esBtns();
          };
        break;
        case(this.states.hide):
          if(this.scaleAlphaWithEase(this, "hide")){
            this.currentState = this.states.off;
          };
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      gameCntx.save();
      this.x = (this.org.x + (gameGFX.endScreen.sprites[0].width * (1-this.scale)/2)) * this.gameScaleRatio;
      this.y = (this.org.y + (gameGFX.endScreen.sprites[0].height * (1-this.scale)/2)) * this.gameScaleRatio;
      gameCntx.translate(this.x, this.y);
      gameCntx.globalAlpha = this.alpha;
      gameGFX.endScreen.sprites[0].draw(gameCntx, 0, 0, this.gameScaleRatio*this.scale);
      gameGFX.endScreen.sprites[this.replayBtn.id].draw(gameCntx, this.replayBtn.x*this.scale* this.gameScaleRatio, this.replayBtn.y*this.scale* this.gameScaleRatio, this.gameScaleRatio*this.scale);
      gameGFX.endScreen.sprites[this.exitBtn.id].draw(gameCntx, this.exitBtn.x*this.scale* this.gameScaleRatio, this.exitBtn.y*this.scale* this.gameScaleRatio, this.gameScaleRatio*this.scale);
      this.drawScore();
      this.drawBestScore();
      gameCntx.restore();

    }
  };
  //---------------------------------------------------------------
  this.scaleAlphaWithEase = function(obj, animation){
    //console.log(obj[animation]);
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
  };
  //---------------------------------------------------------------
  this.drawBestScore = function(){
    if(getScore() >getBestScore()){
      var stringScore = getScore()+"";
    }else{
      var stringScore = getBestScore()+"";
    }
    var start = {
      x: 218,
      y: 205,
    };
    var scoreWidth = 0;
    stringScore = stringScore.split('');
    for(var charCount = 0; charCount <stringScore.length;charCount++){
      var charId = parseInt(stringScore[charCount]);
      scoreWidth += gameGFX.numbers.sprites[charId].width;
      scoreHeight = gameGFX.numbers.sprites[charId].height;
    }
    scoreWidth += (stringScore.length-1) * this.bestScore.gutter;
    var boxHeight = 0;
    start.x -= scoreWidth;
    var charX = start.x;
    for(var charCount = 0; charCount <stringScore.length;charCount++){
      var charId = parseInt(stringScore[charCount]);
      gameGFX.numbers.sprites[charId].draw(gameCntx, charX * this.bestScore.scale * this.scale * this.gameScaleRatio, start.y * this.bestScore.scale * this.scale * this.gameScaleRatio, this.bestScore.scale * this.scale * this.gameScaleRatio);
      charX += gameGFX.numbers.sprites[charId].width;
      charX += this.bestScore.gutter;
    }
  }
  //---------------------------------------------------------------
  this.drawScore = function(){
    var stringScore = getScore()+"";
    var start = {
      x: 170,
      y: 110,
    };
    var scoreWidth = 0;
    stringScore = stringScore.split('');
    for(var charCount = 0; charCount <stringScore.length;charCount++){
      var charId = parseInt(stringScore[charCount]);
      scoreWidth += gameGFX.numbers.sprites[charId].width;
      scoreHeight = gameGFX.numbers.sprites[charId].height;
    }
    scoreWidth += (stringScore.length-1) * this.score.gutter;
    var boxHeight = 0;
    start.x -= scoreWidth;
    var charX = start.x;
    for(var charCount = 0; charCount <stringScore.length;charCount++){
      var charId = parseInt(stringScore[charCount]);
      gameGFX.numbers.sprites[charId].draw(gameCntx, charX * this.score.scale * this.scale * this.gameScaleRatio, start.y * this.score.scale * this.scale * this.gameScaleRatio, this.score.scale * this.scale * this.gameScaleRatio);
      charX += gameGFX.numbers.sprites[charId].width;
      charX += this.score.gutter;
    }
  }
  //---------------------------------------------------------------
}
