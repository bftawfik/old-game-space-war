function HelpScreen(gsr){
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
  this.playBtn = {
    x: 109,
    y: 175,
    id: 1,
    state: 'mouseUp',
  };
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
        deactivate_hsStartBtn();
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
          this.playBtn.scale = this.scale;
          this.playBtn.alpha = this.alpha;
        break;
        case(this.states.show):
          if(this.scaleAlphaWithEase(this, "show")){
            this.currentState = this.states.on;
            activate_hsStartBtn();
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
      this.x = (this.org.x + (gameGFX.helpScreen.sprites[0].getWidth() * (1-this.scale)/2)) * this.gameScaleRatio;
      this.y = (this.org.y + (gameGFX.helpScreen.sprites[0].getHeight() * (1-this.scale)/2)) * this.gameScaleRatio;
      gameCntx.translate(this.x, this.y);
      gameCntx.globalAlpha = this.alpha;
      gameGFX.helpScreen.sprites[0].draw(gameCntx, 0, 0, this.gameScaleRatio*this.scale);
      gameGFX.helpScreen.sprites[this.playBtn.id].draw(gameCntx, this.playBtn.x*this.scale* this.gameScaleRatio, this.playBtn.y*this.scale* this.gameScaleRatio, this.gameScaleRatio*this.scale);
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
}
