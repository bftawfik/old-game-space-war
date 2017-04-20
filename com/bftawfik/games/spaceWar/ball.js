function Ball(gsr, gameCntx){
  //--
  this.gameScaleRatio = gsr;
  this.gameCntx = gameCntx;
  this.dTime = 0;
  this.hitCount = 1;
  this.speedIncHitCount = 23;
  this.currentState = 'off';
  this.radius = 15/2;
  this.velocity = 7;
  this.velocityIncr = 1.03;
  this.angle = 330;
  this.vx = 0;
  this.vy = 0;
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    attached:'attached',
    moving:'moving',
    ready:'ready',
  };
  this.x = 198;
  this.y = 627;
  this.count = 10;
  this.scale = 1;
  this.show = {
    currentTime: 0,
    duration: 2,
    startPos:{
      x: 198,
      y: 777,
    },
    distance:{
      x:0,
      y:-150,
    },
  };
  this.hide = {
    currentTime: 0,
    duration: 2,
    startPos:{
      x: 198,
      y: 627,
    },
    distance:{
      x:0,
      y:100,
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
      break;
      case(this.states.attached):
        this.currentState =  this.states.attached;
      break;
      case(this.states.moving):
        this.currentState =  this.states.moving;
      break;
      case(this.states.hide):
        deactivate_hsStartBtn();
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
        break;
        case(this.states.show):
          if(this.moveWithEase(this, "show")){
            this.currentState = this.states.attached;
          }
        break;
        case(this.states.moving):
          //console.log(this.velocity);
          this.calculateVelocity((this.velocity), this.angle);
          this.x += this.vx;
          this.y += this.vy;
          if((this.x+(this.radius*2))*this.gameScaleRatio> this.gameCntx.canvas.width){
            this.x = (this.gameCntx.canvas.width / this.gameScaleRatio) - (this.radius*2);
            this.angle = (this.angle * -1)+180;
            this.hitCount = (this.hitCount+1) % this.speedIncHitCount;
          }
          if((this.x*this.gameScaleRatio) < 0){
            this.x = 0;
            this.angle = (this.angle * -1)+180;
            this.hitCount = (this.hitCount+1) % this.speedIncHitCount;
          }
          if((this.y*this.gameScaleRatio)< 0){
            this.y = 0;
            this.angle = (this.angle * -1)+360;
            this.hitCount = (this.hitCount+1) % this.speedIncHitCount;
          }
          if(this.y*this.gameScaleRatio> this.gameCntx.canvas.height){
            //console.log('game Over');
            deactivate_defender();
            this.currentState = this.states.on;
          }
          if(this.hitCount == 0){
            //console.log('ball hits is 0');
            this.hitCount = 1;
            this.velocity *= this.velocityIncr;
          }
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      gameGFX.gameScreen.sprites[5].draw(gameCntx, (this.x*this.gameScaleRatio), this.y*this.gameScaleRatio, this.gameScaleRatio*this.scale);
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
  this.calculateVelocity = function(dis, angle) {
    //console.log(dis);
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    this.vx = cos * dis;
    this.vy = sin * dis;
  }
  //---------------------------------------------------------------
}
