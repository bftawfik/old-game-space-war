function AutoResize(direction){
  this.elements = [];
  this.mainDimensions={
    portrait:{
      width: 412,
      height: 732,
      ratio: function(){return this.width/this.height;}
    },
    landscape:{
      width: 732,
      height: 412,
      ratio: function(){return this.height/this.width;}
    }
  };
  this.allDirections = {
    portrait: "portrait",
    landscape: "landscape",
  };
  this.direction = direction;
  this.mainWidth = this.mainDimensions[this.direction].width;
  this.mainHeight = this.mainDimensions[this.direction].height;
  this.ratio = null;
  this.width = null;
  this.height = null;
  this.gameCnvs = null;
  //-----------------------------------------------------------
  this.addElement = function(elem){
    this.elements.push(elem);
  }
  //-----------------------------------------------------------
  this.init = function(){
    // console.log('init');
    this.ratio = this.mainDimensions[this.direction].ratio();
    this.width = this.mainWidth;
    this.height = this.mainHeight;
    for(var elemCount = 0; elemCount < this.elements.length; elemCount++){
      var tempElement = this.elements[elemCount];
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
    this.resize();
  };
  //-----------------------------------------------------------
  this.resize = function() {
    // console.log('resize');
    var dOrientation = window.innerHeight>window.innerWidth ? "portrait":"landscape";
    game.rightOrientation = dOrientation == this.direction ? true : false;
    var ratioFix;
    if(this.direction == this.allDirections.portrait){
      ratioFix = (window.innerHeight*this.ratio)>window.innerWidth ? window.innerWidth/(window.innerHeight*this.ratio):1;
      this.width = window.innerHeight*this.ratio * ratioFix;
      this.height = window.innerHeight*ratioFix;
    }else{
      ratioFix = (window.innerWidth*this.ratio)>window.innerHeight ? window.innerHeight/(window.innerWidth*this.ratio):1;
      this.width = window.innerWidth * ratioFix;
      this.height = window.innerWidth*this.ratio * ratioFix;
    }
    for(var elemCount = 0; elemCount < this.elements.length; elemCount++){
      var tempElement = this.elements[elemCount];
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
  }
  //-----------------------------------------------------------
}
