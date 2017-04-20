function GameScreen(gsr, gameCntx){
  //--
  this.gameScaleRatio = gsr;
  this.gameCntx = gameCntx;
  this.dTime = 0;
  this.mousePos = {};
  this.currentState = 'off';
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    hide:'hide',
  };
  this.defender = new Defender(this.gameScaleRatio);
  this.ball = new Ball(this.gameScaleRatio, this.gameCntx);
  this.defender.addTheBall(this.ball);
  this.enemies = new Enemies(this.gameScaleRatio);
  this.scoreBox = new ScoreBox(this.gameScaleRatio);
  //---------------------------------------------------------------
  this.changeState = function(state){
    switch (state){
      case(this.states.off):
        this.currentState =  this.states.off;
      break;
      case(this.states.show):
        this.currentState =  this.states.show;
        this.defender.changeState(this.defender.states.show);
        this.ball.changeState(this.ball.states.show);
        this.enemies.changeState(this.enemies.states.show);
        this.scoreBox.changeState(this.defender.states.show);
      break;
      case(this.states.hide):
        this.currentState =  this.states.hide;
        this.defender.changeState(this.defender.states.hide);
        this.enemies.changeState(this.enemies.states.hide);
        this.scoreBox.changeState(this.defender.states.hide);
      break;
    }
  };
  //---------------------------------------------------------------
  this.update = function(gsr, dTime, mousePos={}){
    if(this.currentState != this.states.off){
      this.gameScaleRatio = gsr;
      this.dTime = dTime;
      this.mousePos = mousePos;
      this.defender.update(this.gameScaleRatio, this.dTime, this.mousePos);
      this.ball.update(this.gameScaleRatio, this.dTime, this.mousePos);
      this.enemies.update(this.gameScaleRatio, this.dTime);
      this.scoreBox.update(this.gameScaleRatio, this.dTime);
      if(this.currentState == this.states.show){
        if(this.enemies.currentState == this.enemies.states.on){
          this.currentState =  this.states.on;
        }
      }
      if(this.ball.currentState == this.ball.states.moving){
        this.chickBallCollision();
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      this.scoreBox.draw(gameCntx);
      this.defender.draw(gameCntx);
      this.ball.draw(gameCntx);
      this.enemies.draw(gameCntx);
    }
  };
  //---------------------------------------------------------------
  this.chickBallCollision = function(){
    //console.log('this.chickBallCollision');
    var ballPos= {
      x:this.ball.x*this.gameScaleRatio,
      y:this.ball.y*this.gameScaleRatio,
      width:this.ball.radius*this.gameScaleRatio*2, height:this.ball.radius*this.gameScaleRatio*2,
    };
    var defenderPos= {
      x:this.defender.hitArea.x*this.gameScaleRatio,
      y:this.defender.hitArea.y*this.gameScaleRatio,
      width:this.defender.hitArea.width*this.gameScaleRatio, height:this.defender.hitArea.height*this.gameScaleRatio,
    };
    //console.log(defenderPos);
    if(this.chickCollide(ballPos, defenderPos)){
      this.ball.hitCount = (this.ball.hitCount+1) % this.ball.speedIncHitCount;
      this.defender.hitCount++;
      this.defender.hitCount = this.defender.hitCount % this.defender.decayHitCount;
      if(this.defender.hitCount == 0){
        this.defender.decay();
      }
      var dPos = (ballPos.x - (defenderPos.x-(ballPos.width)))/ (defenderPos.width+ballPos.width);
      var dAngle = 185 + (dPos * 170);
      this.ball.angle = dAngle;
      this.ball.y = (defenderPos.y-ballPos.width)/this.gameScaleRatio;
      this.enemies.createNewRaw();
    }
    if(this.enemies.enemiesArray.length){
      for(var enemCount=0; enemCount<this.enemies.enemiesArray.length; enemCount++){
        var tempEnemy = this.enemies.enemiesArray[enemCount];
        if(tempEnemy){
          if(tempEnemy.currentState == tempEnemy.states.on){
            var enemyPos = {
              x:tempEnemy.x*this.gameScaleRatio,
              y:tempEnemy.y*this.gameScaleRatio,
              width:gameGFX.gameScreen.sprites[tempEnemy.id].width * this.gameScaleRatio * tempEnemy.scale,
              height:gameGFX.gameScreen.sprites[tempEnemy.id].height * this.gameScaleRatio * tempEnemy.scale,
            }
            if(this.chickCollide(ballPos, enemyPos)){
              this.ball.hitCount = (this.ball.hitCount+1) % this.ball.speedIncHitCount;
              setScore(getScore()+tempEnemy.myScore);
              this.ball.angle = (this.ball.angle * -1)+360;
              //this.ball.velocity *= this.ball.velocityIncr;
              //this.ball.currentState = this.ball.states.on;
              this.enemies.removeEnemyNo(enemCount);
              break;
            }
          }
        }
      }
    }
  }
  //---------------------------------------------------------------
  this.chickCollide = function(obj1, obj2){
    if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.height + obj1.y > obj2.y) {
      //console.log('collided');
      return true;
    }
    return false;
  }
  //---------------------------------------------------------------
}
