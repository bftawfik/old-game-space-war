function Defender(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.hitCount = 0;
  this.decayHitCount = 13;
  this.gameMain = getGameMainDimentions();
  this.mousePos = {
    x:this.gameMain.width/2,
    y:640,
  };
  this.hitArea = {
    x: 0,
    y: 0,
    width: 152,
    height: 2,
  };
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    hide:'hide',
    fakeBallOut:'fakeBallOut',
  };
  this.rocket0 = {
    x: 154,
    y: 640,
    scale: 0.082,
    show:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 154,
        y: 790,
      },
      distance:{
        x:0,
        y:-150,
      },
    },
    hide:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 154,
        y: 640,
      },
      distance:{
        x:0,
        y:150,
      },
    },
  };
  this.rocket1 = {
    x: 237,
    y: 640,
    scale: 0.082,
    show:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 237,
        y: 790,
      },
      distance:{
        x:0,
        y:-150,
      },
    },
    hide:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 237,
        y: 640,
      },
      distance:{
        x:0,
        y:150,
      },
    },
  };
  this.bar = {
    x: 165,
    y: 650,
    count: 10,
    scale: 1,
    show:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 165,
        y: 790,
      },
      distance:{
        x:0,
        y:-150,
      },
    },
    hide:{
      currentTime: 0,
      duration: 2,
      startPos:{
        x: 165,
        y: 650,
      },
      distance:{
        x:0,
        y:150,
      },
    },
  };
  //---------------------------------------------------------------
  this.changeState = function(state){
    switch (state){
      case(this.states.off):
        this.currentState =  this.states.off;
      break;
      case(this.states.show):
        this.currentState =  this.states.show;
        this.updateMyPos();
      break;
      case(this.states.hide):
        deactivate_hsStartBtn();
        this.currentState =  this.states.hide;
      break;
    }
  };
  //---------------------------------------------------------------
  this.update = function(gsr, dTime, mousePos){
    if(this.currentState != this.states.off){
      this.gameScaleRatio = gsr;
      this.dTime = dTime;
      this.mousePos = mousePos;
      this.mousePos.y = 640;
      switch(this.currentState){
        case(this.states.on):
          if(this.mousePos.x && this.mousePos.y){
            this.updateMousePos();
            this.updateMyPos();
          }
        break;
        case(this.states.show):
          this.moveWithEase(this.rocket0, "show");
          this.moveWithEase(this.rocket1, "show");
          if(this.moveWithEase(this.bar, "show")){
            this.currentState = this.states.on;
            activate_defender();
          }
        break;
        case(this.states.hide):
        this.moveWithEase(this.rocket0, "hide");
        this.moveWithEase(this.rocket1, "hide");
        this.moveWithEase(this.bar, "hide");
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      gameGFX.gameScreen.sprites[6].draw2(gameCntx, (this.bar.x*this.gameScaleRatio), this.bar.y*this.gameScaleRatio,   this.bar.width, 0, this.gameScaleRatio*this.bar.scale);
      //--
      gameGFX.rocket.sprites[0].draw(gameCntx, (this.rocket0.x*this.gameScaleRatio), (this.rocket0.y*this.gameScaleRatio) - (Math.random()*20*this.rocket0.scale), this.gameScaleRatio*this.rocket0.scale);
      gameGFX.rocket.sprites[1].draw(gameCntx, this.rocket0.x*this.gameScaleRatio, this.rocket0.y*this.gameScaleRatio, this.gameScaleRatio*this.rocket0.scale);
      //--
      gameGFX.rocket.sprites[0].draw(gameCntx, (this.rocket1.x*this.gameScaleRatio), (this.rocket1.y*this.gameScaleRatio) - (Math.random()*20*this.rocket1.scale), this.gameScaleRatio*this.rocket1.scale);
      gameGFX.rocket.sprites[1].draw(gameCntx, this.rocket1.x*this.gameScaleRatio, this.rocket1.y*this.gameScaleRatio, this.gameScaleRatio*this.rocket1.scale);
      //--
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
  this.updateMousePos = function(){
    this.gameMain = getGameMainDimentions();
    if(this.mousePos.x < (this.hitArea.width/2)){
      this.mousePos.x = (this.hitArea.width/2);
    }
    if(this.mousePos.x > this.gameMain.width-(this.hitArea.width/2)){
      this.mousePos.x = this.gameMain.width-(this.hitArea.width/2);
    }
  }
  //---------------------------------------------------------------
  this.updateMyPos = function(){
    this.hitArea.x = this.mousePos.x - (this.hitArea.width/2);
    this.hitArea.y = this.mousePos.y;
    //--
    this.rocket0.x = this.hitArea.x;
    this.rocket0.y = (this.hitArea.y-10);
    this.rocket0.show.startPos.x = this.rocket0.x;
    this.rocket0.show.startPos.y = this.rocket0.y - this.rocket0.show.distance.y;
    this.rocket0.hide.startPos.x = this.rocket0.x;
    this.rocket0.hide.startPos.y = this.rocket0.y;
    //--
    this.rocket1.x = this.hitArea.x + this.hitArea.width - (gameGFX.rocket.sprites[1].getWidth()*this.rocket1.scale);
    this.rocket1.y = (this.hitArea.y-10);
    this.rocket1.show.startPos.x = this.rocket1.x;
    this.rocket1.show.startPos.y = this.rocket1.y - this.rocket1.show.distance.y;
    this.rocket1.hide.startPos.x = this.rocket1.x;
    this.rocket1.hide.startPos.y = this.rocket1.y;
    //--
    this.bar.width = this.hitArea.width-20;
    this.bar.x = this.hitArea.x + (gameGFX.rocket.sprites[1].getWidth()*this.rocket1.scale/2);
    this.bar.y = this.hitArea.y;
    this.bar.show.startPos.x = this.bar.x;
    this.bar.show.startPos.y = this.bar.y - this.bar.show.distance.y;
    this.bar.hide.startPos.x = this.bar.x;
    this.bar.hide.startPos.y = this.bar.y;
    //--
    //console.log(this.ball.currentState);
    if(this.ball.currentState == this.ball.states.attached){
      //-------
      this.ball.x = this.hitArea.x + (this.hitArea.width/2) - (gameGFX.gameScreen.sprites[5].getWidth()/2);
      this.ball.y = this.hitArea.y - 10 - (this.hitArea.height*1.5);
    }
  }
  //---------------------------------------------------------------
  this.addTheBall = function(ball){
    this.ball = ball;
  }
  //---------------------------------------------------------------
  this.letTheBallGo = function(){
    //console.log('letTheBallGo');
    this.ball.changeState(this.ball.states.moving);
  }
  //---------------------------------------------------------------
  this.decay = function(){
    //console.log('decay');
    if(this.hitArea.width > 50){
      this.hitArea.width -= 10;
    };
  }
  //---------------------------------------------------------------
}
