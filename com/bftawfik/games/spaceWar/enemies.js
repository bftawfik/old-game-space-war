function Enemies(gsr){
  //--
  this.gameScaleRatio = gsr;
  this.dTime = 0;
  this.initEnemiesCount = 30;
  this.enemiesArray = [];
  this.alifeEnemiesCount = 0;
  this.mainId = Math.floor(Math.random()*4);
  this.id = this.mainId;
  this.leftMargin = 21;
  this.topMargin = 78;
  this.gutter = 5;
  this.countPerRow = 5;
  this.states = {
    on:'on',
    off:'off',
    show:'show',
    hide:'hide',
  };
  this.show = {
    currentCount: 0,
    enemyShown:0,
  }
  //---------------------------------------------------------------
  this.initEnemiesArray = function(enemiesNumber){
    for(var enemCount=0; enemCount<enemiesNumber; enemCount++){
      var tempX = this.leftMargin + ((enemCount%this.countPerRow)*(gameGFX.gameScreen.sprites[0].getWidth() + this.gutter));
      var tempY = this.topMargin+(Math.floor(enemCount/this.countPerRow)*(gameGFX.gameScreen.sprites[0].getHeight() + this.gutter));
      var tempEnemy = new Enemy(this.gameScaleRatio,{x:tempX, y:tempY});
      this.enemiesArray.push(tempEnemy);
    }
  };
  //---------------------------------------------------------------
  this.changeState = function(state){
    switch (state){
      case(this.states.off):
        for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
          var tempEnemy = this.enemiesArray[enemCount];
          tempEnemy.changeState(this.states.off);
        }
        this.currentState =  this.states.off;
      break;
      case(this.states.on):
        this.currentState =  this.states.on;
      break;
      case(this.states.show):
        this.currentState =  this.states.show;
      break;
      case(this.states.hide):
        for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
          var tempEnemy = this.enemiesArray[enemCount];
          if(tempEnemy.currentState == tempEnemy.states.on){
            tempEnemy.changeState(this.states.hide);
          }
        }
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
        for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
          var tempEnemy = this.enemiesArray[enemCount];
          if(tempEnemy){
            tempEnemy.update(this.gameScaleRatio, this.dTime);
          }
        }
        break;
        case(this.states.show):
          if(this.show.enemyShown<this.enemiesArray.length){
            this.show.currentCount++;
            if(Math.floor(this.show.currentCount/5) > this.show.enemyShown){
              var tempEnemy = this.enemiesArray[this.show.enemyShown];
              tempEnemy.changeState(tempEnemy.states.show);
              this.alifeEnemiesCount++;
              this.show.enemyShown++;
            }
          }
          for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
            var tempEnemy = this.enemiesArray[enemCount];
            if(tempEnemy.currentState == tempEnemy.states.show){
              tempEnemy.update(this.gameScaleRatio, this.dTime);
            }
          }
          if(this.show.enemyShown == this.enemiesArray.length){
            var allEnemiesOn = true;
            for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
              var tempEnemy = this.enemiesArray[enemCount];
              if(tempEnemy.currentState != tempEnemy.states.on){
                allEnemiesOn = false;
                break;
              }
            }
            if(allEnemiesOn){
              this.currentState =  this.states.on;
            }
          }
        break;
        case(this.states.hide):
          for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
            var tempEnemy = this.enemiesArray[enemCount];
            if(tempEnemy.currentState == tempEnemy.states.hide){
              tempEnemy.update(this.gameScaleRatio, this.dTime);
            }
          }
        break;
      }
    }
  };
  //---------------------------------------------------------------
  this.draw = function(gameCntx){
    if(this.currentState != this.states.off){
      for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
        var tempEnemy = this.enemiesArray[enemCount];
        //if(tempEnemy){
          tempEnemy.draw(gameCntx);
        //}
      }
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
  this.removeEnemyNo = function(enemyNo){
    var tempEnemy = this.enemiesArray[enemyNo];
    tempEnemy.destroy();
    this.alifeEnemiesCount--;
    //this.enemiesArray[enemyNo] = undefined;
  }
  //---------------------------------------------------------------
  this.createNewRaw = function(){
    //console.log(this.alifeEnemiesCount);
    while(this.alifeEnemiesCount+this.countPerRow <= this.initEnemiesCount){
      //--
      for(var enemCount=0; enemCount<this.enemiesArray.length; enemCount++){
        var tempEnemy = this.enemiesArray[enemCount];
        if(tempEnemy.currentState == tempEnemy.states.on){
          var tempY = gameGFX.gameScreen.sprites[0].getHeight() + this.gutter;
          tempEnemy.y += tempY;
        }
      }
      //--
      for(var rowEnemCount=0; rowEnemCount<this.countPerRow; rowEnemCount++){
        var emptyPlaceFound = -1;
        for(var arrayEnemCount=0; arrayEnemCount<this.enemiesArray.length; arrayEnemCount++){
          if(this.enemiesArray[arrayEnemCount].currentState == this.enemiesArray[arrayEnemCount].states.off){
            emptyPlaceFound = arrayEnemCount;
            break;
          }
        }
        var newX = this.leftMargin + (rowEnemCount*(gameGFX.gameScreen.sprites[0].getWidth() + this.gutter));
        var newY = this.topMargin;
        var newEnemy = new Enemy(this.gameScaleRatio,{x:newX, y:newY});
        if(emptyPlaceFound > -1){
          this.enemiesArray[emptyPlaceFound] = newEnemy;
        }else{
          this.enemiesArray.push(newEnemy);
        }
        newEnemy.changeState(newEnemy.states.on);
        this.alifeEnemiesCount++;
      }
    }
  }
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  this.initEnemiesArray(this.initEnemiesCount);
}
