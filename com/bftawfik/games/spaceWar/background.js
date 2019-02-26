function Background(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.currentState = 'off';
  this.bg0 = {
    x: 0,
    y: 0,
    velocity: 0.1,
  };
  this.bg1 = {
    x: 0,
    y: 0,
    velocity: 0.1,
    alpha:{
      angle:0,
      angleIncr:1,
      min: 0.3,
      totalIncr: 0.3,
      currentAlpha:0,
    },
  };
  this.planet0 = {
    x: 270,
    y: 60,
    angle: 0,
    angleIncr: 0.2,
    radius: 20,
    alpha: 1,
    center:{
      x:270,
      y:60,
    },
    vx: 0,
    vy: 0,
    dim:{
      currentTime: 0,
      duration: 1,
      startAlpha: 1,
      endAlpha: -0.5,
    },
    undim:{
      currentTime: 0,
      duration: 1,
      startAlpha: 0.5,
      endAlpha: 1,
    },
  };
  this.planet1 = {
    x: 95,
    y: 235,
    angle: 0,
    angleIncr: -0.15,
    radius: 10,
    alpha: 1,
    center:{
      x:95,
      y:235,
    },
    vx: 0,
    vy: 0,
    dim:{
      currentTime: 0,
      duration: 1,
      startAlpha: 1,
      endAlpha: -0.5,
    },
    undim:{
      currentTime: 0,
      duration: 1,
      startAlpha: 0.5,
      endAlpha: 1,
    },
  };
  this.states = {
    on:'on',
    off:'off',
    dim: 'dim',
    onDimmed: 'onDimmed',
  };
  //---------------------------------------------------------------
  this.update = function(gsr, dTime){
    this.gameScaleRatio = gsr;
    this.dTime = dTime;
    if(this.currentState != this.states.off){
      this.bg0.x = (this.bg0.x - this.bg0.velocity) % (gameGFX.background.sprites[0].getWidth());
      this.bg1.x = (this.bg1.x + this.bg1.velocity) % (gameGFX.background.sprites[0].getWidth());
      this.bg1.alpha.angle = (this.bg1.alpha.angle + this.bg1.alpha.angleIncr) % 360;
      this.bg1.alpha.currentAlpha = (Math.sin((Math.PI / 180) * this.bg1.alpha.angle)+1)/2;
      this.bg1.alpha.currentAlpha = this.bg1.alpha.currentAlpha * this.bg1.alpha.totalIncr;
      this.bg1.alpha.currentAlpha = this.bg1.alpha.min + this.bg1.alpha.currentAlpha;
      //--
      this.planet0.angle = (this.planet0.angle + this.planet0.angleIncr) % 360;
      this.planet0.vx = Math.sin((Math.PI/180) * this.planet0.angle)*this.planet0.radius;
      this.planet0.vy = Math.cos((Math.PI/180) * this.planet0.angle)*this.planet0.radius;
      this.planet0.x = this.planet0.center.x + this.planet0.vx;
      this.planet0.y = this.planet0.center.y + this.planet0.vy;
      //--
      this.planet1.angle = (this.planet1.angle + this.planet1.angleIncr) % 360;
      this.planet1.vx = Math.sin((Math.PI/180) * this.planet1.angle)*this.planet1.radius;
      this.planet1.vy = Math.cos((Math.PI/180) * this.planet1.angle)*this.planet1.radius;
      this.planet1.x = this.planet1.center.x + this.planet1.vx;
      this.planet1.y = this.planet1.center.y + this.planet1.vy;
    }
    if(this.currentState == this.states.dim){
      this.alphaWithEase(this.planet0, "dim");
      if(this.alphaWithEase(this.planet1, "dim")){
        this.currentState = this.states.onDimmed;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    gameCntx.fillStyle="#1D183C";
    gameCntx.fillRect(0,0,gameCntx.canvas.width,gameCntx.canvas.height);
    //--
    gameGFX.background.sprites[0].draw(gameCntx, (this.bg0.x *this.gameScaleRatio), (this.bg0.y*this.gameScaleRatio), this.gameScaleRatio);
    gameGFX.background.sprites[0].draw(gameCntx, (this.bg0.x*this.gameScaleRatio) + (gameGFX.background.sprites[0].getWidth()*this.gameScaleRatio), (this.bg0.y*this.gameScaleRatio), this.gameScaleRatio);
    //--
    gameCntx.save();
    gameCntx.globalAlpha = this.bg1.alpha.currentAlpha;
    gameGFX.background.sprites[1].draw(gameCntx, (this.bg1.x*this.gameScaleRatio), (this.bg1.y*this.gameScaleRatio), this.gameScaleRatio);
    gameGFX.background.sprites[1].draw(gameCntx, (this.bg1.x*this.gameScaleRatio) - (gameGFX.background.sprites[1].getWidth()*this.gameScaleRatio), (this.bg1.y*this.gameScaleRatio), this.gameScaleRatio);
    gameCntx.restore();
    //--
    gameCntx.save();
    gameCntx.globalAlpha = this.planet0.alpha;
    gameGFX.background.sprites[2].draw(gameCntx, (this.planet0.x*this.gameScaleRatio), (this.planet0.y*this.gameScaleRatio), this.gameScaleRatio);
    gameCntx.restore();
    //--
    gameCntx.save();
    gameCntx.globalAlpha = this.planet1.alpha;
    gameGFX.background.sprites[3].draw(gameCntx, (this.planet1.x*this.gameScaleRatio), (this.planet1.y*this.gameScaleRatio), this.gameScaleRatio);
    gameCntx.restore();
  };
  //---------------------------------------------------------------
  this.changeState = function(state){
    //console.log(state);
    switch (state){
      case (this.states.on):
        this.currentState =  this.states.on;
      break;
      case (this.states.dim):
        this.currentState =  this.states.dim;
      break;
    }
  };
  //---------------------------------------------------------------
  this.alphaWithEase = function(obj, animation){
    if(obj[animation].currentTime < obj[animation].duration){
      var easing = BezierEasing(0.5, 0, 0.5, 1);
      obj[animation].currentTime += this.dTime;
      var dTime = obj[animation].currentTime / obj[animation].duration;
      obj.alpha = obj[animation].startAlpha + (easing(dTime)*obj[animation].endAlpha);
    }else{
      obj.alpha = obj[animation].startAlpha + obj[animation].endAlpha;
      return true;
    }
    return false;
  }
  //---------------------------------------------------------------
}
