function StartScreen(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.title0 = {
    x:52,
    y: 111,
    show:{
      currentTime: 0,
      duration: 1,
      startPos:{
        x:-248,
        y:171,
      },
      distance:{
        x:300,
        y:-60,
      },
    },
    hide:{
      currentTime: 0,
      duration: 0.6,
      startPos:{
        x:52,
        y:111,
      },
      distance:{
        x:-300,
        y:60,
      },
    },
  };
  this.title1 = {
    x: 136,
    y: 170,
    show:{
      currentTime: 0,
      duration: 1,
      startPos:{
        x: 436,
        y: 110,
      },
      distance:{
        x:-300,
        y:60,
      },
    },
    hide:{
      currentTime: 0,
      duration: 0.6,
      startPos:{
        x: 136,
        y: 170,
      },
      distance:{
        x:300,
        y:-60,
      },
    },
  };
  this.playBtn = {
    id:2,
    x: 148,
    y: 294,
    scale: 0,
    alpha: 0,
    state: 'mouseUp',
    org:{
      x: 148,
      y: 294,
    },
    scale: 1,
    on:{
      scale: 1,
      alpha: 1,
    },
    off:{
      scale: 0,
      alpha: 0,
    },
    show:{
      currentTime: 0,
      duration: 1,
      startScale: 0,
      endScale: 1,
      startAlpha: 0,
      endAlpha: 1,
    },
    hide:{
      currentTime: 0,
      duration: 1,
      startScale: 1,
      endScale: -1,
      startAlpha: 1,
      endAlpha: -1,
    },
  };
  this.rocket0 = {
    x: 291,
    y: 426,
    scale: 0.36,
    vipe:{
      angle:0,
      angleIncr:1.5,
      y:0,
      vipeDistance:5,
    },
    show:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 291,
        y: 1026,
      },
      distance:{
        x:0,
        y:-600,
      },
    },
    hide:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 291,
        y: 426,
      },
      distance:{
        x:0,
        y:600,
      },
    },
  };
  this.rocket1 = {
    x: -14,
    y: 395,
    scale: 1,
    vipe:{
      angle:0,
      angleIncr:1.5,
      y:0,
      vipeDistance:5,
    },
    show:{
      currentTime: 0,
      duration: 1.8,
      startPos:{
        x: -14,
        y: 795,
      },
      distance:{
        x:0,
        y:-400,
      },
    },
    hide:{
      currentTime: 0,
      duration: 1.5,
      startPos:{
        x: -14,
        y: 395,
      },
      distance:{
        x:0,
        y:600,
      },
    },
  };
  this.currentState = 'off';
  this.states = {
    off:'off',
    on:'on',
    show:'show',
    hide: 'hide',
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
        deactivate_ssStartBtn();
        this.currentState =  this.states.hide;
      break;
    }
  };
  //---------------------------------------------------------------
  this.update = function(gsr, dTime){
    this.gameScaleRatio = gsr;
    this.dTime = dTime;
    if(this.currentState != this.states.off){
      this.rocket0.vipe.angle = (this.rocket0.vipe.angle + this.rocket0.vipe.angleIncr) % 360;
      this.rocket0.vipe.y = Math.sin((Math.PI / 180) * this.rocket0.vipe.angle) * this.rocket0.vipe.vipeDistance;
      //
      this.rocket1.vipe.angle = (this.rocket1.vipe.angle + this.rocket1.vipe.angleIncr) % 360;
      this.rocket1.vipe.y = Math.sin((Math.PI / 180) * this.rocket1.vipe.angle) * this.rocket1.vipe.vipeDistance;
      switch(this.currentState){
        case(this.states.on):
          this.playBtn.scale = this.playBtn.on.scale;
          this.playBtn.alpha = this.playBtn.on.alpha;
        break;
        case(this.states.show):
          this.moveWithEase(this.title0, "show");
          this.moveWithEase(this.title1, "show");
          this.scaleAlphaWithEase(this.playBtn, "show");
          this.moveWithEase(this.rocket1, "show");
          if(this.moveWithEase(this.rocket0, "show")){
            this.currentState = this.states.on;
            activate_ssStartBtn();
          };
        break;
        case(this.states.hide):
          this.moveWithEase(this.title0, "hide");
          this.moveWithEase(this.title1, "hide");
          this.scaleAlphaWithEase(this.playBtn, "hide");
          this.moveWithEase(this.rocket1, "hide");
          if(this.moveWithEase(this.rocket0, "hide")){
            this.currentState = this.states.off;
          };
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    //--
    if(this.currentState != this.states.off){
      gameGFX.startScreen.sprites[0].draw(gameCntx, (this.title0.x*this.gameScaleRatio), (this.title0.y*this.gameScaleRatio), this.gameScaleRatio);
      gameGFX.startScreen.sprites[1].draw(gameCntx, (this.title1.x*this.gameScaleRatio), (this.title1.y*this.gameScaleRatio), this.gameScaleRatio);
      //--
      gameCntx.save();
      this.playBtn.x = (this.playBtn.org.x + (gameGFX.startScreen.sprites[2].width * (1-this.playBtn.scale)/2)) * this.gameScaleRatio;
      this.playBtn.y = (this.playBtn.org.y + (gameGFX.startScreen.sprites[2].height * (1-this.playBtn.scale)/2)) * this.gameScaleRatio;
      gameCntx.translate(this.playBtn.x, this.playBtn.y);
      gameCntx.globalAlpha = this.playBtn.alpha;
      gameGFX.startScreen.sprites[this.playBtn.id].draw(gameCntx, 0, 0, this.gameScaleRatio*this.playBtn.scale);
      gameCntx.restore();
      // gameGFX.startScreen.sprites[3].draw(gameCntx, (this.playBtn.x*this.gameScaleRatio), (this.playBtn.y*this.gameScaleRatio), this.gameScaleRatio);
      //--
      gameGFX.rocket.sprites[0].draw(gameCntx, (this.rocket0.x*this.gameScaleRatio), ((this.rocket0.y+(this.rocket0.vipe.y*this.rocket0.scale) -(Math.random()*20*this.rocket0.scale))*this.gameScaleRatio), this.gameScaleRatio*this.rocket0.scale);
      gameGFX.rocket.sprites[1].draw(gameCntx, (this.rocket0.x*this.gameScaleRatio), ((this.rocket0.y+(this.rocket0.vipe.y*this.rocket0.scale))*this.gameScaleRatio), this.gameScaleRatio*this.rocket0.scale);
      //--
      gameGFX.rocket.sprites[0].draw(gameCntx, (this.rocket1.x*this.gameScaleRatio), ((this.rocket1.y+(this.rocket1.vipe.y*this.rocket1.scale) -(Math.random()*20*this.rocket1.scale))*this.gameScaleRatio), this.gameScaleRatio*this.rocket1.scale);
      gameGFX.rocket.sprites[1].draw(gameCntx, (this.rocket1.x*this.gameScaleRatio), ((this.rocket1.y+(this.rocket1.vipe.y*this.rocket1.scale))*this.gameScaleRatio), this.gameScaleRatio*this.rocket1.scale);
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
}
