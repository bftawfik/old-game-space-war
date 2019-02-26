function AutoResize(direction){
  var elements = [];
  this.direction = direction;
  this.allDirections = {
    portrait: "portrait",
    landscape: "landscape",
  };
  //console.log(this.direction , this.allDirections.portrait);
  if(this.direction == this.allDirections.portrait){
    this.mainWidth = 720;
    this.mainHeight = 405;
  }else{
    this.mainWidth = 720;
    this.mainHeight = 405;
  }
  this.ratio = null;
  this.width = null;
  this.height = null;
  // this.gameCnvs = null;
  //-----------------------------------------------------------
  this.addElement = function(elem){
    elements.push(elem);
  }
  //-----------------------------------------------------------
  this.init = function(){
    console.log('init');
    if(this.direction == this.allDirections.portrait){
      this.ratio = this.mainWidth / this.mainHeight;
    }else{
      this.ratio = this.mainHeight / this.mainWidth;
    }
    this.width = this.mainWidth;
    this.height = this.mainHeight;
    //this.gameCnvs = gameCnvs;
    for(var elemCount = 0; elemCount < elements.length; elemCount++){
      var tempElement = elements[elemCount];
      if(tempElement.tagName =="CANVAS"){
        tempElement.width = this.mainWidth;
        tempElement.height = this.mainWidth;
      }else{
        tempElement.style.width = (this.mainWidth+2)+"px";
        tempElement.style.height = (this.mainWidth+2)+"px";
      }
      tempElement.style.top = ((window.innerHeight - this.height)/2)+"px";
      tempElement.style.left = ((window.innerWidth - this.width)/2)+"px";
    }
    //
    this.ua = navigator.userAgent.toLowerCase();
    this.android = this.ua.indexOf('android') > -1 ? true : false;
    this.ios = ( this.ua.indexOf('iphone') > -1 || this.ua.indexOf('ipad') > -1  ) ? true : false;
    return this.resize();
  };
  //-----------------------------------------------------------
  this.resize = function() {
    if(window.innerHeight > window.innerWidth){
      var dOrientation = "portrait";
    }else{
      var dOrientation = "landscape";
    }
    if(dOrientation == this.direction){
      game.rightOrientation = true;
  		// console.log(true);
  	}else{
      game.rightOrientation = false;
  		// console.log(false);
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
      document.body.style.height = (window.innerHeight + 50) + 'px';
    }
    for(var elemCount = 0; elemCount < elements.length; elemCount++){
      var tempElement = elements[elemCount];
      if(tempElement.tagName =="CANVAS"){
        tempElement.width = this.width;
        tempElement.height = this.height;
      }else{
        tempElement.style.width = (this.width+2)+"px";
        tempElement.style.height = (this.height+2)+"px";
      }
      tempElement.style.top = ((window.innerHeight - this.height)/2)+"px";
      tempElement.style.left = ((window.innerWidth - this.width)/2)+"px";
    }
    window.setTimeout(function() {
      window.scrollTo(0,1);
    }, 1);
    //return this.gameCnvs.width/720;
  }
}
