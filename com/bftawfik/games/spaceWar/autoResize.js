function AutoResize(direction){

  this.direction = direction;
  this.allDirections = {
    portrait: "portrait",
    landscape: "landscape",
  };
  //console.log(this.direction , this.allDirections.portrait);
  if(this.direction == this.allDirections.portrait){
    this.mainHeight = 732;
    this.mainWidth = 412;
  }else{
    this.mainWidth = 732;
    this.mainHeight = 412;
  }
  this.ratio = null;
  this.width = null;
  this.height = null;
  this.gameCnvs = null;
  //-----------------------------------------------------------
  this.init = function(gameCnvs){
    console.log('init');
    if(this.direction == this.allDirections.portrait){
      this.ratio = this.mainWidth / this.mainHeight;
    }else{
      this.ratio = this.mainHeight / this.mainWidth;
    }
    this.width = this.mainWidth;
    this.height = this.mainHeight;
    this.gameCnvs = gameCnvs;
    this.gameCnvs.width = this.mainWidth;
    this.gameCnvs.height = this.mainHeight;
    //
    this.ua = navigator.userAgent.toLowerCase();
    this.android = this.ua.indexOf('android') > -1 ? true : false;
    this.ios = ( this.ua.indexOf('iphone') > -1 || this.ua.indexOf('ipad') > -1  ) ? true : false;
    return this.resize();
  };
  //-----------------------------------------------------------
  this.resize = function() {
    console.log('resize');
    if(getOrientation() == this.direction){
      game.rightOrientation = true;
  		console.log(true);
  	}else{
      game.rightOrientation = false;
  		console.log(false);
  	}
    if(this.direction == this.allDirections.portrait){
      var newHeight = window.innerHeight;
      var newWidth = newHeight * this.ratio;
        if(newWidth > window.innerWidth){
          var ratioFix = window.innerWidth/newWidth;
          this.width = newWidth * ratioFix;
          this.height = newHeight * ratioFix;
        }else{
          this.width = newWidth;
          this.height = newHeight;
        }
    }else{
      var newWidth = window.innerWidth;
      var newHeight = newWidth * this.ratio;
      if(newHeight > window.innerHeight){
        var ratioFix = window.innerHeight/newHeight;
        this.width = newWidth * ratioFix;
        this.height = newHeight * ratioFix;
      }else{
        this.width = newWidth;
        this.height = newHeight;
      }
    }
    if (this.android || this.ios) {
      //document.body.style.height = (window.innerHeight + 50) + 'px';
    }
    this.gameCnvs.width = this.width;
    this.gameCnvs.height = this.height;
    window.setTimeout(function() {
      window.scrollTo(0,1);
    }, 1);
    return this.gameCnvs.width/this.mainWidth;
  }
}
