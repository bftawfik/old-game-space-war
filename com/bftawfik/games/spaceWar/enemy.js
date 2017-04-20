function Enemy(gsr, pos){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.mainId = Math.floor(Math.random()*4);
  this.id = this.mainId;
  this.myScore = 0;
  switch(this.id){
    case(0):
      this.myScore  = 57;
    break;
    case(1):
      this.myScore  = 25;
    break;
    case(2):
      this.myScore  = 100;
    break;
    case(3):
      this.myScore  = 71;
    break;
  }
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    wayToDistory:'wayToDistory',
    hide:'hide',
  };
  this.currentState = this.states.off;
  this.x = pos.x;
  this.y = pos.y;
  this.org = {
    x: pos.x,
    y: pos.y,
  };
  this.count = 10;
  this.scale = 1;
  this.alpha =1;
  this.show = {
    currentTime: 0,
    duration: 0.4,
    startPos:{
      x: 171,
      y: -100,
    },
    distance:{
      x:pos.x-171,
      y:pos.y+100,
    },
  };
  this.hide = {
    currentTime: 0,
    duration: 1,
    startPos:{
      x: pos.x,
      y: pos.y,
    },
    distance:{
      x:0,
      y:-700,
    },
  };
  this.wayToDistory = {
    currentTime: 0,
    duration: 0.2,
    startScale: 1,
    endScale: 2,
    startAlpha: 1,
    endAlpha: -1,
  };
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
        case(this.states.wayToDistory):
        if(this.scaleAlphaWithEase(this, "wayToDistory")){
          this.currentState =  this.states.off;
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
      if(this.currentState == this.states.wayToDistory){
        gameCntx.save();
        this.x = (this.org.x + (gameGFX.gameScreen.sprites[this.id].getWidth() * (1-this.scale)/2)) * this.gameScaleRatio;
        this.y = (this.org.y + (gameGFX.gameScreen.sprites[this.id].getHeight() * (1-this.scale)/2)) * this.gameScaleRatio;
        gameCntx.translate(this.x, this.y);
        gameCntx.globalAlpha = this.alpha;
        gameGFX.gameScreen.sprites[this.id].draw(gameCntx, 0, 0, this.gameScaleRatio*this.scale);
        gameCntx.restore();
      }else{
        gameGFX.gameScreen.sprites[this.id].draw(gameCntx, (this.x*this.gameScaleRatio), (this.y*this.gameScaleRatio), this.gameScaleRatio*this.scale);
      }


      //
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
  this.destroy = function(){
    this.currentState = this.states.wayToDistory;
    this.org.x = this.x;
    this.org.y = this.y;
    this.id = 4;
  }
}
