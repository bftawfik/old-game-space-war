function Bar(gsr){
  //--
  this.gameScaleRatio = gsr;
  //console.log(this.gameScaleRatio);
  this.x = 100;
  this.y = 710;
  this.width = 100;
  this.height = 10;
  // this.currentFrame = 0;
  // this.frFix = 0;
  this.currentState = 'off';
  this.velocity = 21;
  this.angle = 13;
  this.vx = 0;
  this.vy = 0;
  // this.rotation = 0;
  // this.gravity = 0;
  this.stoping = [0];
  this.states = {
    off:{
      name: 'off',
      axis: {x:-100,y:-246},
    },
    standing:{
      name: 'standing',
      axis: {x:100,y:246},
    },
    moving:{
      name: 'moving',
      axis: {x:100,y:246},
    },
  };
  //---------------------------------------------------------------
  // this.changeState = function(state){
  //   // switch (state){
  //   //   case this.states.on:
  //   //     this.currentState =  this.states.on;
  //   //   break;
  //   //   case this.states.off:
  //   //     this.currentState =  this.states.off;
  //   //   break;
  //   // }
  // };
  //---------------------------------------------------------------
  this.update = function(gsr,mousePos){
    if(this.currentState != this.states.off){
      this.gameScaleRatio = gsr;
      if(mousePos){
        if(mousePos.x+((this.width*this.gameScaleRatio)/2)>= gameCntx.canvas.width){
          this.x = gameCntx.canvas.width - ((this.width*this.gameScaleRatio)/2);
        }else if(mousePos.x - ((this.width*this.gameScaleRatio)/2) >= 0){
          this.x = mousePos.x;
        }else{
          this.x = ((this.width*this.gameScaleRatio)/2);
        }
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    gameCntx.fillStyle="#aaa";
    gameCntx.fillRect(this.x-((this.width*this.gameScaleRatio)/2), this.y*this.gameScaleRatio, this.width*this.gameScaleRatio, this.height*this.gameScaleRatio);
  };
  //---------------------------------------------------------------
  this.getPos = function(){
    //console.log(this.gameScaleRatio);
    return{x:this.x-((this.width*this.gameScaleRatio)/2), y:this.y*this.gameScaleRatio, width:(this.width*this.gameScaleRatio), height:this.height*this.gameScaleRatio};
  };
  //---------------------------------------------------------------
}
